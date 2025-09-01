const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  bikeId: { type: String, required: true },
  bikeName: { type: String, required: true },
  maintenanceDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Ready", "Not Ready"],
    default: "Not Ready",
  },
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);
