/**
 * Data Accessor for Mongo.
 *
 * @module MenuItemAccessor
 */
import * as Constants from "../utils/constants.mjs";
import { ConnectionManager } from "./ConnectionManager.mjs";
import { MenuItem } from "../entity/MenuItem.mjs";

export {
    getAllItems,
    getItemByID,
    itemExists,
    deleteItem,
    addItem,
    updateItem,
};

/**
 * Gets all the items.
 *
 * @example
 * let items = await getAllItems();
 * @throws {Error} if a database error occurs
 * @returns {Promise<array<MenuItem>>} resolves to: an array of MenuItem objects (empty if there are none)
 */
async function getAllItems() {
    try {
        let client = await ConnectionManager.getConnection();
        let collection = client
            .db(Constants.DB_NAME)
            .collection(Constants.DB_COLLECTION);
        let objects = await collection.find({}).toArray();

        // 'objects' is an array of objects, but they're not instances of MenuItem.
        let items = [];
        objects.forEach((obj) => {
            let temp = new MenuItem(
                obj.id,
                obj.category,
                obj.description,
                obj.price,
                obj.vegetarian
            );
            items.push(temp);
        });

        return items;
    } catch (err) {
        throw new Error("Could not complete getAllItems!\n" + err);
    } finally {
        await ConnectionManager.closeConnection();
    }
} // end function

/**
 * Determines if a MenuItem object exists in the database.
 *
 * @param {MenuItem} - the object to find
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item exists; false otherwise
 */
async function itemExists(item) {
    let data = await getAllItems();
        let exists = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === item.id) {
                exists = true;
                break;
            }
        }
        return exists;
} // end function

/**
 * Gets the object with the specified ID.
 *
 * @param {number} itemID - the ID of the object to return
 * @throws {Error} if a database error occurs
 * @returns {Promise<MenuItem>} resolves to: the matching MenuItem object; or null if the object doesn't exist
 */
async function getItemByID(itemID) {
    let data = await getAllItems();
        let result = null;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === itemID) {
                result = data[i];
                break;
            }
        }
        return result;
} // end function

/**
 * Adds the specified item (if it doesn't already exist).
 *
 * @param {MenuItem} item - the item to add
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item was added; false if the item already exists.
 */
async function addItem(item) {
    if (await itemExists(item)) {
            return false;
        }
     try {
        let client = await ConnectionManager.getConnection();
        let collection = client
            .db(Constants.DB_NAME)
            .collection(Constants.DB_COLLECTION);
        await collection.insertOne( { id: item.id, category: item.category, description: item.description, price: item.price, vegetarian: item.vegetarian } );
        return true;
    } catch (err) {
        throw new Error("Could not complete getAllItems!\n" + err);
    }finally {
        await ConnectionManager.closeConnection();
    }
} // end function

/**
 * Deletes the specified item (if it exists).
 *
 * @param {MenuItem} item - the item to delete
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item was deleted; false if the item doesn't exist.
 */
async function deleteItem(item) {
    if (!(await itemExists(item))) {
            return false;
        }
     try {
        let client = await ConnectionManager.getConnection();
        let collection = client
            .db(Constants.DB_NAME)
            .collection(Constants.DB_COLLECTION);
        await collection.deleteOne({ id: item.id });
        return true;
    } catch (err) {
        throw new Error(err);
    }finally {
        await ConnectionManager.closeConnection();
    }
} // end function

/**
 * Updates the specified item (if it exists).
 *
 * @param {MenuItem} item - the item to update
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item was updated; false if the item doesn't exist.
 */
async function updateItem(item) {
    if (!(await itemExists(item))) {
            return false;
        }
     try {
        let client = await ConnectionManager.getConnection();
        let collection = client
            .db(Constants.DB_NAME)
            .collection(Constants.DB_COLLECTION);
        await collection.updateOne({ id: item.id },
            { $set: { category: item.category, description: item.description, price: item.price, vegetarian: item.vegetarian } });
        return true;
    } catch (err) {
        throw new Error(err);
    }finally {
        await ConnectionManager.closeConnection();
    }
} // end function
