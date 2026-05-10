const users = {

  agent47: {
    name: "Agent 47",
    rank: "Lead Forensic Investigator",
    badge: "IQ-4721",
    division: "Alpha Forensics Unit",
    email: "agent47@investiq.gov",
    specialization: "Temporal Reconstruction",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
  },

  agent46: {
    name: "Agent 46",
    rank: "Cyber Crime Specialist",
    badge: "IQ-4621",
    division: "Cyber Intelligence Unit",
    email: "agent46@investiq.gov",
    specialization: "Digital Surveillance",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
  },
  agent99: {
    name: "Agent 99",
    rank: "Field Commander",
    badge: "IQ-9921",
    division: "Tactical Response Unit",
    email: "agent99@investiq.gov",
    specialization: "Tactical Operations",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" 
  },
  agent01: {
    name: "Agent 01",
    rank: "Intelligence Analyst",
    badge: "IQ-0121",
    division: "Intelligence Analysis Unit",
    email: "agent01@investiq.gov",
    specialization: "Intelligence Gathering",
    avatar:
      "https://www.google.com/imgres?q=satoru%20gojo&imgurl=https%3A%2F%2Fimages4.alphacoders.com%2F133%2Fthumb-1920-1332281.jpeg&imgrefurl=https%3A%2F%2Fwall.alphacoders.com%2Fbig.php%3Fi%3D1332281&docid=BIFyVRuzck8eKM&tbnid=5wbrdASj5orvWM&vet=12ahUKEwiI8Yq9x62UAxWURmwGHWmDFr4QnPAOegQIHxAB..i&w=1920&h=1440&hcb=2&ved=2ahUKEwiI8Yq9x62UAxWURmwGHWmDFr4QnPAOegQIHxAB"
  }

};

let settings = {

  notifications: true,
  darkMode: true,
  biometricLogin: false

};

exports.getProfile = (req, res) => {

  const username =
    req.query.username?.toLowerCase();

  res.json(users[username]);

};

exports.updateProfile = (req, res) => {

  const username =
    req.query.username?.toLowerCase();

  users[username] = {
    ...users[username],
    ...req.body
  };

  res.json({
    success: true,
    profile: users[username]
  });

};

exports.getSettings = (req, res) => {

  res.json(settings);

};

exports.updateSettings = (req, res) => {

  settings = {
    ...settings,
    ...req.body
  };

  res.json({
    success: true,
    settings
  });

};