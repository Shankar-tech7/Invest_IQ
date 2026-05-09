const users = {

  agent47: {
    password: "forensics2026",
    user: {
      name: "Agent 47",
      rank: "Lead Investigator"
    }
  },

  agent46: {
    password: "cyber462026",
    user: {
      name: "Agent 46",
      rank: "Cyber Crime Specialist"
    }
  },

  agent99: {
    password: "tactical992026",
    user: {
      name: "Agent 99",
      rank: "Field Commander"
    }
  }

};

exports.login = (req, res) => {

  const username =
    req.body.username?.trim().toLowerCase();

  const password =
    req.body.password?.trim();

  const account = users[username];

  if (!account) {

    return res.status(401).json({
      success: false,
      message: "Invalid username"
    });

  }

  if (account.password !== password) {

    return res.status(401).json({
      success: false,
      message: "Invalid password"
    });

  }

  res.json({
    success: true,
    message: "Authentication successful",
    user: account.user
  });
};

exports.logout = (req, res) => {

  res.json({
    success: true,
    message: "Logout successful"
  });

};