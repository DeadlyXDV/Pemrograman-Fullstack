const db = require('../config/db');

function getNearbyRestaurants(userLat, userLon, maxDistance) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT  
        id, name, latitude, longitude, avg_rating, category,
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(latitude))
          )
        ) AS distance_km
      FROM restaurants
      HAVING distance_km <= ?
      ORDER BY distance_km ASC
    `;
    db.query(sql, [userLat, userLon, userLat, maxDistance], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function getUserPreferences(userId) {
  const mockPrefs = {
    'Italia': 5,
    'Seafood': 3,
    'Jawa': 1
  };
  return mockPrefs;
}

module.exports = {
  getNearbyRestaurants,
  getUserPreferences
};
