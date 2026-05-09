// authController.js - Handle authentication and session management

exports.login = (req, res) => {
  const { username, password } = req.body;
  
  const cleanUsername = username?.trim().toLowerCase();
  const cleanPassword = password?.trim();

  // Simulated secure authentication
  if (cleanUsername === "agent47" && cleanPassword === "forensics2026") {
    res.json({ 
      success: true, 
      message: "Authentication successful",
      user: { name: "Agent 47", rank: "Lead Investigator" }
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials. Use agent47 / forensics2026" });
  }
};

exports.logout = (req, res) => {
  res.json({ message: "Logout successful. Session invalidated." });
};
