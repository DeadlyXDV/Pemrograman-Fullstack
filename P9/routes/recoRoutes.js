const express = require('express');
const router = express.Router();
const recoService = require('../services/recoService');

router.get('/', async (req, res) => {
  try {
    const { userId, lat, lon, maxDistance = 10 } = req.query;
    if (!userId || !lat || !lon) {
      return res.status(400).json({ message: "Require userId, lat, and lon." });
    }

    const recommendations = await recoService.getRecommendations(
      userId,
      parseFloat(lat),
      parseFloat(lon),
      parseInt(maxDistance)
    );

    res.json({ user_input: { userId, lat, lon, maxDistance }, recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Internal server error.", details: error.message });
  }
});

module.exports = router;
