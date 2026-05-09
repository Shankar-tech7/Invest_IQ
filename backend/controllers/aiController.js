const { callClaude } = require('../services/claudeService');

const analyzeAutopsy = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Missing report content" });

  const SYSTEM = `You are an expert forensic pathologist AI assistant. Analyze autopsy reports and extract:
1. Probable Cause of Death
2. Manner of Death (Natural/Accident/Homicide/Suicide/Undetermined)
3. Key Injury Patterns and Wounds
4. Toxicological Findings
5. Medical Observations (organ conditions, disease, anomalies)
6. Estimated Time Frame Indicators
7. Forensic Red Flags or Suspicious Findings
8. Recommended Next Investigative Steps

Format clearly with section headers. Be precise, clinical, and comprehensive. Use bullet points for sub-items.`;

  try {
    const result = await callClaude(SYSTEM, `Analyze this autopsy report:\n\n${content}`);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Analysis failed." });
  }
};

const estimateTOD = async (req, res) => {
  const { bodyTemp, ambientTemp, humidity, rigor, livor, decomp, sceneCondition, lastSeenAlive, additionalNotes } = req.body;
  
  const SYSTEM = `You are a forensic pathologist specializing in postmortem interval estimation. Given physical and environmental data, estimate the time of death using:
1. Henssge Nomogram principles (body/ambient temperature)
2. Rigor mortis progression timeline
3. Livor mortis stage analysis
4. Decomposition staging
5. Environmental adjustment factors

Provide:
• Estimated Postmortem Interval (PMI) with a range
• Most probable time of death (date/time window)
• Confidence level (Low/Moderate/High) with reasoning
• Key indicators used
• Confounding factors that may affect accuracy
• Investigative recommendations

Be specific with time ranges. Format clearly.`;

  const prompt = `Estimate time of death from this postmortem data:
Body Temperature: ${bodyTemp || "Not recorded"}°C
Ambient Temperature: ${ambientTemp || "Not recorded"}°C
Humidity: ${humidity || "Not recorded"}%
Rigor Mortis: ${rigor || "Not assessed"}
Livor Mortis: ${livor || "Not assessed"}
Decomposition Stage: ${decomp || "None"}
Scene Condition: ${sceneCondition || "Unknown"}
Last Known Alive: ${lastSeenAlive || "Unknown"}
Additional Notes: ${additionalNotes || "None"}`;

  try {
    const result = await callClaude(SYSTEM, prompt);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Estimation failed." });
  }
};

const correlateDigital = async (req, res) => {
  const { parts } = req.body;
  if (!parts || parts.length === 0) return res.status(400).json({ error: "Missing evidence parts" });

  const SYSTEM = `You are a digital forensics AI analyst specializing in evidence correlation. Analyze the provided digital evidence logs and:
1. Extract and chronologically order all events/timestamps
2. Identify key persons, locations, devices, or entities
3. Detect timeline gaps, inconsistencies, or anomalies
4. Correlate evidence across different sources
5. Identify suspicious patterns, contradictions, or alibi violations
6. Build a unified event timeline
7. List high-priority investigative leads
8. Flag any evidence tampering indicators

Be structured, precise, and timeline-focused. Use timestamps explicitly.`;

  try {
    const result = await callClaude(SYSTEM, `Analyze and correlate this digital evidence:\n\n${parts.join("\n\n---\n\n")}`);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Correlation failed." });
  }
};

const scoreRisk = async (req, res) => {
  const { prompt } = req.body;

  const SYSTEM = `You are a forensic case intelligence AI. Assess the given case data and produce:
1. OVERALL RISK SCORE (0–100) with breakdown
2. Case Priority Level (CRITICAL / HIGH / MEDIUM / LOW)
3. Evidence Strength Assessment
4. Key Risk Factors identified
5. Anomaly Flags (inconsistencies, missing evidence, suspicious patterns)
6. Investigative Priority Actions (ordered by urgency)
7. Case Complexity Rating
8. Recommended Resource Allocation

Start your response with a line exactly like: RISK_SCORE: [number]
Then provide the full structured assessment. Be analytical and specific.`;

  try {
    const result = await callClaude(SYSTEM, prompt);
    const match = result.match(/RISK_SCORE:\s*(\d+)/);
    const score = match ? parseInt(match[1]) : null;
    const report = result.replace(/RISK_SCORE:\s*\d+\n?/, "").trim();
    res.json({ score, result: report });
  } catch (error) {
    res.status(500).json({ error: "Scoring failed." });
  }
};

const generateSummary = async (req, res) => {
  const { prompt } = req.body;
  
  const SYSTEM = `You are a forensic case summary AI. Given case metadata, provide a concise investigative briefing covering: current status assessment, critical next steps, evidence gaps, and recommended priority actions. Be direct and actionable. Use bullet points.`;

  try {
    const result = await callClaude(SYSTEM, prompt);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Summary generation failed." });
  }
};

module.exports = {
  analyzeAutopsy,
  estimateTOD,
  correlateDigital,
  scoreRisk,
  generateSummary
};
