const Maintenance = require("../models/Maintenance");

// Get all maintenance records
exports.getAllMaintenance = async (req, res) => {
  try {
    const maintenanceRecords = await Maintenance.find();
    res.json(maintenanceRecords);
  } catch (err) {
    res.status(500).json({ message: "Error fetching maintenance data" });
  }
};

// Create new maintenance record
exports.addMaintenance = async (req, res) => {
  try {
    const { bikeId, bikeName, maintenanceDate } = req.body;
    const record = new Maintenance({ bikeId, bikeName, maintenanceDate });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: "Invalid data" });
  }
};

// Update status (Ready / Not Ready)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const record = await Maintenance.findByIdAndUpdate(id, { status }, { new: true });
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
};
