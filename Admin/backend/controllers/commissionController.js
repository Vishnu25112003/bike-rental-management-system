const CommissionSetting = require('../models/CommissionSetting');

// GET commission settings
const getCommission = async (req, res) => {
  try {
    const settings = await CommissionSetting.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'No commission settings found' });
    }
    res.status(200).json(settings);
  } catch (err) {
    console.error('Error fetching commission settings:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST or UPDATE commission settings with input validation
const saveCommission = async (req, res) => {
  const { defaultCommission, tiers } = req.body;

  // Validate input before saving
  if (
    typeof defaultCommission !== 'number' ||
    !Array.isArray(tiers) ||
    tiers.length === 0 ||
    tiers.some(
      (tier) =>
        tier.min === undefined ||
        tier.max === undefined ||
        tier.rate === undefined ||
        typeof tier.min !== 'number' ||
        typeof tier.max !== 'number' ||
        typeof tier.rate !== 'number'
    )
  ) {
    return res.status(400).json({
      message:
        'Invalid input: defaultCommission must be a number and tiers must be an array of objects with numeric min, max, and rate properties',
    });
  }

  try {
    let existing = await CommissionSetting.findOne();
    if (existing) {
      existing.defaultCommission = defaultCommission;
      existing.tiers = tiers;
      await existing.save();
      res.status(200).json({ message: 'Commission settings updated', data: existing });
    } else {
      const newSetting = await CommissionSetting.create({ defaultCommission, tiers });
      res.status(201).json({ message: 'Commission settings created', data: newSetting });
    }
  } catch (err) {
    console.error('Error saving commission settings:', err.message);
    console.error(err.stack);
    res.status(500).json({ message: 'Failed to save commission settings', error: err.message });
  }
};

module.exports = {
  getCommission,
  saveCommission,
};
