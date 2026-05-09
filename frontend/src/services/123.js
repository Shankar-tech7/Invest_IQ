/**
 * InvestIQ Chatbot Service — TF-IDF Intent Classifier
 * Real ML-based intent detection using cosine similarity.
 * No external API, no database, no server required.
 */

// ─── Intent Training Data ─────────────────────────────────────────────────────
const INTENTS = [
    {
        tag: "suspect_query",
        patterns: ["who is the suspect", "identify suspect", "criminal profile", "find the person", "who did it", "match face", "person detected", "cctv match", "who was seen", "recognize face", "face identification"],
        response: (ctx) => `Active suspect on the evidence board: **${ctx.suspect || "No suspect identified yet"}**. Run CCTV Analysis to identify subjects from footage.`,
    },
    {
        tag: "evidence_query",
        patterns: ["what evidence", "show evidence", "evidence board", "case evidence", "collected evidence", "physical evidence", "digital evidence", "clues", "forensic evidence"],
        response: (ctx) => `Evidence board currently has **${ctx.evidenceCount || 0} subject(s)** logged. Navigate to CCTV Analysis to add confirmed matches.`,
    },
    {
        tag: "case_status",
        patterns: ["case status", "investigation status", "how is the case", "case update", "open cases", "active cases", "case progress"],
        response: () => "Current investigation status: **HIGH PRIORITY**. 3 active cases, 7 pending autopsies. CCTV cross-correlation in progress.",
    },
    {
        tag: "autopsy_query",
        patterns: ["autopsy", "cause of death", "postmortem", "body", "victim", "toxicology", "manner of death", "medical examiner", "pathology"],
        response: () => "Use the **Autopsy Analysis** module to paste a medical report. The NLP engine will extract cause of death, toxicology findings, and severity classification.",
    },
    {
        tag: "time_of_death",
        patterns: ["time of death", "when did they die", "death time", "rigor mortis", "livor mortis", "algor mortis", "temperature", "tod estimate"],
        response: () => "Navigate to **Time of Death** module. Input body temperature, rigor and livor mortis status for a scientifically calculated TOD estimate.",
    },
    {
        tag: "reconstruction_query",
        patterns: ["scene reconstruction", "crime scene", "timeline", "what happened", "sequence of events", "reconstruct", "events timeline", "crime timeline"],
        response: () => "The **Scene Reconstruction** module generates a full event timeline based on the CCTV-identified suspect. Run CCTV analysis first to seed the reconstruction.",
    },
    {
        tag: "greeting",
        patterns: ["hello", "hi", "hey", "good morning", "good evening", "greetings", "what can you do", "help", "assist"],
        response: () => "InvestIQ Intelligence Engine online. I can assist with suspect identification, case status, evidence analysis, autopsy findings, and crime scene reconstruction. What do you need?",
    },
    {
        tag: "risk_query",
        patterns: ["risk", "threat level", "danger", "threat assessment", "how dangerous", "probability", "likelihood"],
        response: () => "Navigate to **Risk Assessment** module. The AI evaluates suspect profiles and case data to generate a real-time threat level from LOW to CRITICAL.",
    },
    {
        tag: "logout_query",
        patterns: ["logout", "sign out", "exit", "end session", "close"],
        response: () => "To end your secure session, click **Logout** at the bottom of the sidebar. All session data will be cleared from memory.",
    },
];

// ─── TF-IDF Implementation ────────────────────────────────────────────────────

function tokenize(text) {
    return text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
}

function buildTFIDF(corpus) {
    const N = corpus.length;
    const idf = {};

    // Count documents containing each term
    corpus.forEach(doc => {
        const unique = [...new Set(tokenize(doc))];
        unique.forEach(term => { idf[term] = (idf[term] || 0) + 1; });
    });

    // IDF = log(N / df)
    Object.keys(idf).forEach(term => {
        idf[term] = Math.log(N / idf[term]);
    });

    return idf;
}

function vectorize(tokens, idf) {
    const tf = {};
    tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
    Object.keys(tf).forEach(t => { tf[t] /= tokens.length; }); // normalize TF
    const vec = {};
    Object.keys(tf).forEach(t => { vec[t] = tf[t] * (idf[t] || 0); });
    return vec;
}

function cosineSimilarity(vecA, vecB) {
    const keysA = Object.keys(vecA);
    const dot = keysA.reduce((sum, k) => sum + (vecA[k] * (vecB[k] || 0)), 0);
    const magA = Math.sqrt(keysA.reduce((sum, k) => sum + vecA[k] ** 2, 0));
    const magB = Math.sqrt(Object.keys(vecB).reduce((sum, k) => sum + vecB[k] ** 2, 0));
    return (magA && magB) ? dot / (magA * magB) : 0;
}

// ─── Build the Model ──────────────────────────────────────────────────────────
const allPatterns = INTENTS.flatMap(i => i.patterns);
const idf = buildTFIDF(allPatterns);

// Pre-vectorize all intent patterns
const intentVectors = INTENTS.map(intent => ({
    tag: intent.tag,
    response: intent.response,
    vectors: intent.patterns.map(p => vectorize(tokenize(p), idf)),
}));

// ─── Classify & Respond ───────────────────────────────────────────────────────
export function classifyAndRespond(userMessage, context = {}) {
    const inputTokens = tokenize(userMessage);
    if (inputTokens.length === 0) return "Please describe what you need help with.";

    const inputVec = vectorize(inputTokens, idf);

    let bestScore = 0;
    let bestIntent = null;

    intentVectors.forEach(intent => {
        intent.vectors.forEach(patVec => {
            const score = cosineSimilarity(inputVec, patVec);
            if (score > bestScore) {
                bestScore = score;
                bestIntent = intent;
            }
        });
    });

    // Confidence threshold
    if (bestScore < 0.08 || !bestIntent) {
        return "Query not recognized in forensic context. Try asking about suspects, evidence, autopsy findings, or the current case status.";
    }

    return bestIntent.response(context);
}
