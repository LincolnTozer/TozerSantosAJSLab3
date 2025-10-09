/**
 * Some useful constants
 *
 * @module Constants
 */

/** The connection URI for MongoDB. */
let CONNECTION_STRING = "mongodb://127.0.0.1:27017";

/** The database name. */
const DB_NAME = "restaurantdb";

/** The collection name. */
const DB_COLLECTION = "menuitems";

/** The number of records in the collection. */
const NUM_MENUITEMS = 39;

// this is here to deliberately corrupt the URI (for testing)
function setConnectionString(s) {
    CONNECTION_STRING = s;
}

export {
    CONNECTION_STRING,
    DB_NAME,
    DB_COLLECTION,
    NUM_MENUITEMS,
    setConnectionString,
};
