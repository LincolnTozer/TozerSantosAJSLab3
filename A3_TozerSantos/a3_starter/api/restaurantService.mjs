import { MenuItem } from "../entity/MenuItem.mjs";

/**
 * Handles a request to perform an action on the dataset.
 *
 * @param {string} action - the action to perform: one of LIST, ADD, UPDATE, DELETE
 * @param {MenuItem} content - the object to be added, updated, or deleted; null for LIST requests.
 * @returns {Promise<object>} - resolves to: an object containing three fields: statusCode, err, data.
 *                              As per convention, only one of err or data will be populated.
 */
async function processRequest(action, content) {
    let resp = null;

    // your code here

    return resp;
}

export { processRequest };
