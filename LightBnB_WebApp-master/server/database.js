const properties = require('./json/properties.json');
// const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'tom',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

let users;

pool.query(`
  SELECT * FROM users;
`).then((result) => {
  // console.log(result.rows)
  users = result.rows;
});

const args = process.argv.slice(2);

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  
  return pool.query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log("error!");
    });


};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (result) {
        return result.rows[0];
      } else return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  
  return pool.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });

};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  //return getAllProperties(null, 2);
  return pool.query(`
    SELECT * FROM reservations WHERE guest_id = $1 LIMIT $2;
  `, [guest_id, limit])
    .then((result) => {
      if (result) {
        return result.rows;
      } else return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const options = {
//   owner_id: 2,
//   minimum_price_per_night: 200,
//   maximum_price_per_night: 400,
//   minimum_rating: 2
// }

const getAllProperties = function(options, limit) {
  limit = 10;
  const queryParams = [];

  let queryString = `
   SELECT properties.*, avg(property_reviews.rating) as average_rating
   FROM properties
   JOIN property_reviews ON properties.id = property_id
   `;
 
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `WHERE owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`, `${options.maximum_price_per_night}`);
    queryString += `AND cost_per_night > $${queryParams.length - 1} AND cost_per_night < $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `AND rating >= $${queryParams.length}`;
  }
 
  queryParams.push(limit);
  queryString += `
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
    `;

  console.log(queryString, queryParams);
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = [];
  
  for (const key in property) {
    queryParams.push(property[key]);
  }
  
  let queryString = `
    INSERT INTO properties 
    (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
    VALUES (
  `
  for (let i = 1; i <= queryParams.length; i++) {
    if (i === queryParams.length) {
      queryString += `$${i})`
    } else {
    queryString += `$${i}, `;
    }
  }
  queryString += `RETURNING *;`

  pool.query(queryString, queryParams).then((res) => res.rows);

  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
