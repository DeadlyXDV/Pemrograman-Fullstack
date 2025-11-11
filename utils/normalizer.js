const normalizeDistanceScore = (distance, maxDistance = 10) => {
  return 1 - (Math.min(distance, maxDistance) / maxDistance);
};

const normalizeRatingScore = (rating, maxRating = 5) => {
  return rating / maxRating;
};

module.exports = {
  normalizeDistanceScore,
  normalizeRatingScore
};
