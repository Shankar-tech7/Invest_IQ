const express = require("express");

const router = express.Router();

const authController =
  require("../controllers/authController");

const userController =
  require("../controllers/userController");

/* AUTH */

router.post(
  "/auth/login",
  authController.login
);

router.post(
  "/auth/logout",
  authController.logout
);

/* PROFILE */

router.get(
  "/user/profile",
  userController.getProfile
);

router.post(
  "/user/profile",
  userController.updateProfile
);

/* SETTINGS */

router.get(
  "/user/settings",
  userController.getSettings
);

router.post(
  "/user/settings",
  userController.updateSettings
);

module.exports = router;