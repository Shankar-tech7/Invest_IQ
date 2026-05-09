// authController.js

const users = [
  {
    username: "agent47",
    password: "forensics2026",
    name: "Agent 47",
    rank: "Lead Investigator"
  },

  {
    username: "agent46",
    password: "crimeunit46",
    name: "Agent 46",
    rank: "Cyber Analyst"
  },

  {
    username: "agent99",
    password: "secure99",
    name: "Agent 99",
    rank: "Field Operative"
  },

  {
    username: "admin",
    password: "admin123",
    name: "System Admin",
    rank: "Chief Director"
  }
];

exports.login = (req, res) => {

  const { username, password } = req.body;

  const cleanUsername = username?.trim().toLowerCase();

  const cleanPassword = password?.trim();

  const foundUser = users.find(
    (user) =>
      user.username === cleanUsername &&
      user.password === cleanPassword
  );

  if (foundUser) {

    res.json({
      success: true,
      message: "Authentication successful",

      user: {
        name: foundUser.name,
        rank: foundUser.rank
      }
    });

  } else {

    res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });

  }
};

exports.logout = (req, res) => {

  res.json({
    success: true,
    message: "Logout successful"
  });

};