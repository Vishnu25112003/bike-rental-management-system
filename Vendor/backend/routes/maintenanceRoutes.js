const express = require("express");
const router = express.Router();
const {
  getAllMaintenance,
  addMaintenance,
  updateStatus,
} = require("../controllers/maintenanceController");

router.get("/", getAllMaintenance);
router.post("/", addMaintenance);
router.patch("/:id/status", updateStatus);

module.exports = router;
