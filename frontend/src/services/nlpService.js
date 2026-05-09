/**
 * InvestIQ NLP Service
 * Uses compromise.js — real in-browser Natural Language Processing.
 * No database, no API key, no server required.
 *
 * Capabilities:
 *  - Extract cause of death, body location, substances, time indicators
 *  - Classify case severity (Critical / High / Medium / Low)
 *  - Identify forensic keywords and medical entities
 */

import nlp from "compromise";

// ─── Medical / Forensic Entity Dictionaries ───────────────────────────────────
const CAUSE_OF_DEATH_TERMS = [
  "blunt force trauma", "stab wound", "gunshot", "asphyxiation", "poisoning",
  "overdose", "cardiac arrest", "exsanguination", "strangulation", "drowning",
  "suffocation", "electrocution", "hypothermia", "hemorrhage", "anaphylaxis",
  "head injury", "skull fracture", "internal bleeding", "sepsis", "liver failure"
];

const TOXIC_SUBSTANCES = [
  "cyanide", "arsenic", "methanol", "fentanyl", "heroin", "cocaine",
  "barbiturates", "benzodiazepines", "carbon monoxide", "lead", "mercury",
  "alcohol", "methamphetamine", "oxycodone", "morphine", "chloroform"
];

const BODY_REGIONS = [
  "head", "neck", "chest", "thorax", "abdomen", "pelvis", "spine",
  "skull", "cranium", "sternum", "rib", "femur", "tibia", "humerus",
  "left", "right", "anterior", "posterior", "lateral", "medial"
];

const TIME_INDICATORS = [
  "hours", "days", "weeks", "prior to", "before", "after", "approximately",
  "estimated", "postmortem", "ante mortem", "peri mortem", "between", "within"
];

// ─── Main Analysis Function ────────────────────────────────────────────────────
export function analyzeAutopsyReport(text) {
  if (!text || text.trim().length < 20) {
    return { error: "Report text too short. Please paste a full autopsy report." };
  }

  const doc = nlp(text.toLowerCase());

  // ── Extract Cause of Death ─────────────────────────────────────────────────
  const causeOfDeath = extractMatches(text.toLowerCase(), CAUSE_OF_DEATH_TERMS);

  // ── Extract Toxicology Findings ────────────────────────────────────────────
  const toxicology = extractMatches(text.toLowerCase(), TOXIC_SUBSTANCES);

  // ── Extract Body Regions Mentioned ────────────────────────────────────────
  const bodyRegions = extractMatches(text.toLowerCase(), BODY_REGIONS);

  // ── Extract Time Phrases using NLP ────────────────────────────────────────
  const timePhrases = [];
  const timeMatches = text.match(/\d+[\s-]?(hour|day|week|minute|month)s?(\s+ago|\s+prior|\s+before)?/gi) || [];
  timePhrases.push(...timeMatches.map(t => t.trim()));

  // ── Extract People (Victims, Suspects) ────────────────────────────────────
  const people = doc.people().out("array").filter(p => p.length > 3);

  // ── Extract Numbers (measurements, temperatures, weights) ─────────────────
  const measurements = [];
  const tempMatches = text.match(/\d+(\.\d+)?\s*°?(C|F|celsius|fahrenheit)/gi) || [];
  const weightMatches = text.match(/\d+(\.\d+)?\s*(kg|lbs?|grams?|mg)/gi) || [];
  const bloodMatches = text.match(/blood\s+alcohol[\s:]+[\d.]+/gi) || [];
  measurements.push(...tempMatches, ...weightMatches, ...bloodMatches);

  // ── Extract Verdict / Manner of Death ────────────────────────────────────
  let mannerOfDeath = "Undetermined";
  if (/homicide|murder|killed\s+by|inflicted/i.test(text)) mannerOfDeath = "Homicide";
  else if (/suicide|self[\s-]?inflicted|self[\s-]?administered/i.test(text)) mannerOfDeath = "Suicide";
  else if (/accident|accidental|unintentional/i.test(text)) mannerOfDeath = "Accidental";
  else if (/natural|disease|illness/i.test(text)) mannerOfDeath = "Natural";

  // ── Classify Severity ─────────────────────────────────────────────────────
  const severity = classifySeverity({ causeOfDeath, toxicology, mannerOfDeath, text });

  // ── Extract Key Sentences ─────────────────────────────────────────────────
  const sentences = doc.sentences().out("array");
  const keySentences = sentences
    .filter(s => CAUSE_OF_DEATH_TERMS.some(t => s.includes(t)) || TOXIC_SUBSTANCES.some(t => s.includes(t)))
    .slice(0, 4)
    .map(s => s.trim());

  // ── Build Report ──────────────────────────────────────────────────────────
  return {
    mannerOfDeath,
    severity,
    causeOfDeath: causeOfDeath.length > 0 ? causeOfDeath : ["Not explicitly stated"],
    toxicology: toxicology.length > 0 ? toxicology : ["No toxic substances detected"],
    bodyRegions: bodyRegions.length > 0 ? [...new Set(bodyRegions)] : [],
    timePhrases: timePhrases.length > 0 ? [...new Set(timePhrases)] : ["No time indicators found"],
    people: people.length > 0 ? [...new Set(people)] : [],
    measurements: measurements.length > 0 ? [...new Set(measurements)] : [],
    keySentences,
    wordCount: text.trim().split(/\s+/).length,
    confidence: calculateConfidence({ causeOfDeath, toxicology, timePhrases, keySentences }),
  };
}

// ─── Helper: Extract Term Matches ────────────────────────────────────────────
function extractMatches(text, termList) {
  return termList.filter(term => text.includes(term.toLowerCase()));
}

// ─── Helper: Classify Severity ───────────────────────────────────────────────
function classifySeverity({ causeOfDeath, toxicology, mannerOfDeath, text }) {
  let score = 0;
  if (mannerOfDeath === "Homicide") score += 40;
  if (toxicology.length > 0) score += 20;
  if (causeOfDeath.some(c => ["stab wound", "gunshot", "strangulation", "poisoning"].includes(c))) score += 25;
  if (/multiple|severe|extensive|catastrophic/i.test(text)) score += 15;

  if (score >= 60) return "CRITICAL";
  if (score >= 35) return "HIGH";
  if (score >= 15) return "MEDIUM";
  return "LOW";
}

// ─── Helper: Confidence Score ─────────────────────────────────────────────────
function calculateConfidence({ causeOfDeath, toxicology, timePhrases, keySentences }) {
  let c = 40; // base
  if (causeOfDeath.length > 0) c += 25;
  if (toxicology.length > 0) c += 15;
  if (timePhrases.length > 0) c += 10;
  if (keySentences.length > 0) c += 10;
  return Math.min(c, 99);
}

// ─── Extract Time of Death Clues ──────────────────────────────────────────────
export function extractTODClues(text) {
  const tempMatch = text.match(/body\s+temp(?:erature)?[\s:]+(\d+\.?\d*)/i);
  const rigidityMatch = text.match(/rigor\s+mortis[\s:]+([a-zA-Z\s]+)/i);
  const livorMatch = text.match(/livor\s+mortis[\s:]+([a-zA-Z\s]+)/i);

  return {
    bodyTemp: tempMatch ? parseFloat(tempMatch[1]) : null,
    rigorStatus: rigidityMatch ? rigidityMatch[1].trim() : null,
    livorStatus: livorMatch ? livorMatch[1].trim() : null,
  };
}
