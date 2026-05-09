/**
 * InvestIQ Face Recognition Service
 * Uses face-api.js (TensorFlow.js) — real ML, no database required.
 * Pre-trained neural network weights loaded from /public/models/
 *
 * How it works:
 *  1. Load 3 neural networks: face detector, landmark extractor, recognition encoder
 *  2. Build a reference set: load labeled images → compute 128D face descriptors → store in memory
 *  3. On user upload: detect faces → extract descriptor → Euclidean distance against reference set
 *  4. Closest match = identified suspect
 */

import * as faceapi from "face-api.js";

// ─── Reference Suspects (labels + public photo URLs) ────────────────────────
// These are the "known criminals" the system will match CCTV footage against.
// Photos with clear, frontal faces work best for the recognition model.
const REFERENCE_SUSPECTS = [
  { name: "Marcus Webb",      id: "SUBJ-001", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
  { name: "Diana Chen",       id: "SUBJ-002", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" },
  { name: "Raj Patel",        id: "SUBJ-003", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
  { name: "Elena Sorel",      id: "SUBJ-004", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  { name: "James Okafor",     id: "SUBJ-005", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  { name: "Sofia Mendez",     id: "SUBJ-006", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face" },
  { name: "Chen Wei",         id: "SUBJ-007", url: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face" },
  { name: "Aisha Nkosi",      id: "SUBJ-008", url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face" },
  { name: "Viktor Bauer",     id: "SUBJ-009", url: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face" },
  { name: "Priya Sharma",     id: "SUBJ-010", url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face" },
  { name: "Leon Torres",      id: "SUBJ-011", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face" },
  { name: "Nadia Ivanova",    id: "SUBJ-012", url: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?w=200&h=200&fit=crop&crop=face" },
  { name: "Kwame Asante",     id: "SUBJ-013", url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face" },
  { name: "Mei Lin",          id: "SUBJ-014", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face" },
  { name: "Anton Reyes",      id: "SUBJ-015", url: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=200&h=200&fit=crop&crop=face" },
];

// ─── State ───────────────────────────────────────────────────────────────────
let modelsLoaded = false;
let labeledDescriptors = []; // faceapi.LabeledFaceDescriptors[]
let faceMatcher = null;      // faceapi.FaceMatcher

// ─── Load Models (called once on app startup) ────────────────────────────────
export async function loadFaceModels(onProgress) {
  if (modelsLoaded) return;
  const MODEL_URL = "/models";

  onProgress?.("Loading face detector...");
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

  onProgress?.("Loading landmark model...");
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);

  onProgress?.("Loading recognition model...");
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

  onProgress?.("Building suspect reference set...");
  await buildReferenceSet(onProgress);

  modelsLoaded = true;
  onProgress?.("ML Engine Ready");
}

// ─── Build Reference Set ─────────────────────────────────────────────────────
// Loads each reference image, detects the face, computes its 128D descriptor,
// and stores it as a LabeledFaceDescriptors object. All in browser memory — no DB.
async function buildReferenceSet(onProgress) {
  const CACHE_KEY = "investiq_face_descriptors";
  
  // 1. Try to load pre-computed (trained) descriptors from local cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      onProgress?.("Loading pre-trained suspect biometrics from secure cache...");
      const parsed = JSON.parse(cached);
      labeledDescriptors = parsed.map(
        obj => new faceapi.LabeledFaceDescriptors(
          obj.label,
          obj.descriptors.map(arr => new Float32Array(arr))
        )
      );
      faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.55);
      return;
    }
  } catch (e) {
    console.error("Failed to read biometric cache", e);
  }

  // 2. If no cache, perform the "training" (feature extraction)
  const descriptors = [];
  const cacheData = [];

  for (let i = 0; i < REFERENCE_SUSPECTS.length; i++) {
    const suspect = REFERENCE_SUSPECTS[i];
    onProgress?.(`Extracting biometrics: ${suspect.name} (${i + 1}/${REFERENCE_SUSPECTS.length})...`);
    try {
      const img = await loadImageFromUrl(suspect.url);
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true)
        .withFaceDescriptor();

      if (detection) {
        const label = `${suspect.name}||${suspect.id}||${suspect.url}`;
        descriptors.push(
          new faceapi.LabeledFaceDescriptors(label, [detection.descriptor])
        );
        // Convert Float32Array to standard Array for JSON serialization
        cacheData.push({
          label,
          descriptors: [Array.from(detection.descriptor)]
        });
      }
    } catch {
      // Skip this suspect if image fails to load
    }
  }

  labeledDescriptors = descriptors;
  
  // 3. Save the trained descriptors to local cache
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (e) {
    console.error("Failed to write biometric cache", e);
  }

  // Distance threshold: 0.5 is standard. Lower = stricter matching.
  try {
    if (labeledDescriptors.length > 0) {
      faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.55);
    } else {
      console.warn("No labeled descriptors loaded. All subjects will be unidentified.");
      faceMatcher = null;
    }
  } catch (e) {
    console.error("Failed to initialize FaceMatcher", e);
    faceMatcher = null;
  }
}

// ─── Analyze Image/Video Frame ────────────────────────────────────────────────
export async function analyzeFrame(mediaElement) {
  if (!modelsLoaded) {
    throw new Error("ML models not loaded yet");
  }

  // Detect all faces in the frame with landmarks + recognition descriptors
  const detections = await faceapi
    .detectAllFaces(mediaElement, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }))
    .withFaceLandmarks(true)
    .withFaceDescriptors();

  if (!detections || detections.length === 0) {
    return { faces: [], primaryMatch: null };
  }

  // Resize detections to match display dimensions
  const dims = { width: mediaElement.width || mediaElement.videoWidth || 640, height: mediaElement.height || mediaElement.videoHeight || 480 };
  const resized = faceapi.resizeResults(detections, dims);

  // Match each detected face against our reference set (or fallback to unknown)
  const faces = resized.map((det, idx) => {
    let match = null;
    if (faceMatcher) {
      try {
        match = faceMatcher.findBestMatch(det.descriptor);
      } catch (e) {
        match = { label: "unknown", distance: 1.0 };
      }
    } else {
      match = { label: "unknown", distance: 1.0 };
    }

    const [name, id, dbImgUrl] = match.label !== "unknown" ? match.label.split("||") : ["Unidentified Subject", `UNKNOWN-${idx}`, null];
    const distance = match.distance;
    
    // Convert Euclidean distance to a confidence % (0.0 = perfect match, 0.6 = threshold)
    const confidence = match.label === "unknown"
      ? Math.round((1 - Math.min(distance, 1)) * 40)    // unknown = low confidence
      : Math.round((1 - distance / 0.6) * 100);         // known = high confidence

    // Extract live cropped photo of the face (Zoom feature)
    let liveCropUrl = null;
    try {
      const box = det.detection.box;
      const cropCanvas = document.createElement("canvas");
      const pad = 25; // padding for a good mugshot framing
      cropCanvas.width = box.width + pad * 2;
      cropCanvas.height = box.height + pad * 2;
      const ctx = cropCanvas.getContext("2d");
      
      const elWidth = mediaElement.videoWidth || mediaElement.width || 640;
      const elHeight = mediaElement.videoHeight || mediaElement.height || 480;
      
      const sx = Math.max(0, box.x - pad);
      const sy = Math.max(0, box.y - pad);
      const sw = Math.min(elWidth - sx, box.width + pad * 2);
      const sh = Math.min(elHeight - sy, box.height + pad * 2);

      ctx.drawImage(mediaElement, sx, sy, sw, sh, 0, 0, sw, sh);
      liveCropUrl = cropCanvas.toDataURL("image/jpeg", 0.9);
    } catch (e) {
      console.warn("Could not extract live crop:", e);
    }

    return {
      index: idx,
      box: det.detection.box,
      name,
      id,
      imgUrl: dbImgUrl,
      liveCropUrl,
      distance,
      confidence: Math.max(0, Math.min(100, confidence)),
      isMatch: match.label !== "unknown",
    };
  });

  // Primary match = highest confidence face
  const primaryMatch = [...faces].sort((a, b) => b.confidence - a.confidence)[0];
  return { faces, primaryMatch };
}

// ─── Draw Detection Results on Canvas ────────────────────────────────────────
export function drawDetections(canvas, faces, mediaElement) {
  const ctx = canvas.getContext("2d");
  canvas.width = mediaElement.width || mediaElement.videoWidth || 640;
  canvas.height = mediaElement.height || mediaElement.videoHeight || 480;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  faces.forEach(face => {
    const { box, name, confidence, isMatch } = face;
    const color = isMatch ? "#ff003c" : "#fbbf24";

    // Bounding box
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Corner accents
    const cs = 12;
    ctx.lineWidth = 3;
    [[box.x, box.y], [box.x + box.width - cs, box.y], [box.x, box.y + box.height - cs], [box.x + box.width - cs, box.y + box.height - cs]].forEach(([cx, cy]) => {
      ctx.beginPath(); ctx.moveTo(cx, cy + cs); ctx.lineTo(cx, cy); ctx.lineTo(cx + cs, cy); ctx.stroke();
    });

    // Label background
    ctx.shadowBlur = 0;
    const label = `${name} — ${confidence}%`;
    ctx.font = "bold 11px monospace";
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = color;
    ctx.fillRect(box.x - 1, box.y - 22, tw + 10, 20);
    ctx.fillStyle = "#000";
    ctx.fillText(label, box.x + 4, box.y - 7);
  });
}

// ─── Helper: Load Image from URL ─────────────────────────────────────────────
function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    // Use cors-anywhere proxy to avoid CORS issues with Unsplash
    img.src = url;
  });
}

export { REFERENCE_SUSPECTS, modelsLoaded };
