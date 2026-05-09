// userController.js - Handle user profile and system settings
let userProfile = {
  name: "Agent 47",
  rank: "Lead Forensic Investigator",
  email: "agent47@aiventra.gov",
  avatar: "https://i.pravatar.cc/150?u=47",
  specialization: "Temporal Reconstruction"
};

let userSettings = {
  notifications: true,
  darkMode: true,
  biometricLogin: false,
  language: "English (US)",
  region: "Northern Division"
};

exports.getProfile = (req, res) => {
  res.json(userProfile);
};

exports.updateProfile = (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  res.json({ message: "Profile updated successfully", profile: userProfile });
};

exports.getSettings = (req, res) => {
  res.json(userSettings);
};

exports.updateSettings = (req, res) => {
  userSettings = { ...userSettings, ...req.body };
  res.json({ message: "Settings updated successfully", settings: userSettings });
};
