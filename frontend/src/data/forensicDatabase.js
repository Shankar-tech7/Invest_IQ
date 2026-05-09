// InvestIQ Central Forensic Intelligence Database
// This database links suspects to specific digital footprints and event timelines

// Programmatically generate a database of 400 suspects for large-scale matching
const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

export const criminalDatabase = Array.from({ length: 400 }, (_, i) => {
  const fName = firstNames[i % firstNames.length];
  const lName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  return {
    id: `PX-${1000 + i}`,
    name: `${fName} ${lName}`,
    confidence: (85 + Math.random() * 14).toFixed(1),
    img: `https://i.pravatar.cc/150?u=${i}`, // Using pravatar for unique faces
    record: i % 10 === 0 ? "High Risk" : "Standard",
    status: "Wanted"
  };
});

export const forensicDatabase = [
  {
    id: "SCENARIO_ALPHA",
    suspect: criminalDatabase[12], // Marcus Thorne equivalent
    evidence: {
      victim: "John Doe",
      nodes: [
        { id: 1, type: "device", label: "Burner Phone #4", color: "#ff003c" },
        { id: 2, type: "gps", label: "Sector 4 Alley", color: "#0088ff" },
        { id: 3, type: "call", label: "+1-555-8372", color: "#f59e0b" }
      ],
      riskDesc: "Suspect's device intersects with victim's last known GPS ping.",
      riskScore: "99.2%"
    },
    reconstruction: {
      name: "Office Incursion Analysis",
      events: [
        { time: "10:32 PM", event: "Victim enters lobby", desc: "Front lobby camera pinged. Victim appears on schedule." },
        { time: "10:41 PM", event: "Suspect Detected", desc: "Individual matching database profile captured on stairwell 4." },
        { time: "10:48 PM", event: "Acoustic Alert", desc: "Suspect triggered sudden noise decibel spike (95dB) in suite 402." },
        { time: "10:53 PM", event: "Extraction", desc: "Suspect detected fleeing via roof exit. Subject neutralized." }
      ]
    }
  },
  {
    id: "SCENARIO_BETA",
    suspect: criminalDatabase[85], // Elena Rostova equivalent
    evidence: {
      victim: "Sarah Smith",
      nodes: [
        { id: 1, type: "device", label: "Encrypted Laptop", color: "#a855f7" },
        { id: 2, type: "gps", label: "Port Terminal", color: "#0088ff" },
        { id: 3, type: "activity", label: "Data Siphoned", color: "#10b981" }
      ],
      riskDesc: "Suspect initiated encrypted data transfer at terminal wifi.",
      riskScore: "92.4%"
    },
    reconstruction: {
      name: "Port Anomaly Analysis",
      events: [
        { time: "02:10 AM", event: "Subject Detected", desc: "Subject detected at Warehouse B entry. Magnetic lock bypassed." },
        { time: "02:15 AM", event: "Data Access", desc: "Subject gained root access on local terminal. 4.2GB transferred." },
        { time: "02:22 AM", event: "Exfiltration", desc: "Subject moving towards extraction point. Signal lost at harbor perimeter." }
      ]
    }
  },
  // ... more scenarios can be added or dynamically selected from criminalDatabase
];

