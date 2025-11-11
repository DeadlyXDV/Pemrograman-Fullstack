const restaurantModel = require('../models/restaurantModel');
const { normalizeDistanceScore, normalizeRatingScore } = require('../utils/normalizer');

const WEIGHT_DISTANCE = 0.5;
const WEIGHT_RATING = 0.3;
const WEIGHT_PREFERENCE = 0.2;

async function getRecommendations(userId, userLat, userLon, maxDistance) {
  const nearbyRestos = await restaurantModel.getNearbyRestaurants(userLat, userLon, maxDistance);
  const userPrefs = restaurantModel.getUserPreferences(userId);

  const scoredRestos = nearbyRestos.map(resto => {
    const prefValue = userPrefs[resto.category] || 0;
    const S_d = normalizeDistanceScore(resto.distance_km, maxDistance);
    const S_r = normalizeRatingScore(resto.avg_rating);
    const S_p = normalizeRatingScore(prefValue);
    const finalScore = (WEIGHT_DISTANCE * S_d) + (WEIGHT_RATING * S_r) + (WEIGHT_PREFERENCE * S_p);

    return {
      id: resto.id,
      name: resto.name,
      category: resto.category,
      avg_rating: resto.avg_rating,
      distance_km: resto.distance_km.toFixed(2),
      finalScore: finalScore.toFixed(4)
    };
  });

  scoredRestos.sort((a, b) => b.finalScore - a.finalScore);
  return scoredRestos;
}

module.exports = { getRecommendations };
