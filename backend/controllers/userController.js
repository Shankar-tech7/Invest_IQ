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
    rank: "Field Operations Commander",
    badge: "IQ-9921",
    division: "Tactical Response Unit",
    email: "agent99@investiq.gov",
    specialization: "Field Reconnaissance",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face"
  }

};

const settings = {
  notifications: true,
  darkMode: true,
  biometricLogin: false
};

/* GET PROFILE */

exports.getProfile = (req, res) => {

  const username =
    req.query.username?.toLowerCase();

  const user = users[username];

  if (!user) {

    return res.status(404).json({
      message: "User not found"
    });

  }

  res.json(user);
};

/* UPDATE PROFILE */

exports.updateProfile = (req, res) => {

  const username =
    req.query.username?.toLowerCase();

  if (!users[username]) {

    return res.status(404).json({
      message: "User not found"
    });

  }

  users[username] = {
    ...users[username],
    ...req.body
  };

  res.json({
    success: true,
    profile: users[username]
  });
};

/* GET SETTINGS */

exports.getSettings = (req, res) => {

  res.json(settings);
};

/* UPDATE SETTINGS */

exports.updateSettings = (req, res) => {

  Object.assign(settings, req.body);

  res.json({
    success: true,
    settings
  });
};