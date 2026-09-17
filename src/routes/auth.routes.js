const router = require("express").Router();

const ctrl = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middlware");

console.log("AUTH ROUTE CHECK:");
console.log("protect:", typeof protect);
console.log("login:", typeof ctrl.login);
console.log("getMe:", typeof ctrl.getMe);

router.post("/register", ctrl.register);

router.post("/login", ctrl.login);

router.get("/me", protect, ctrl.getMe);

module.exports = router;