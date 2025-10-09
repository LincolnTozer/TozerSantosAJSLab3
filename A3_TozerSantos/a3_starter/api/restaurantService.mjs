import { MenuItem } from "../entity/MenuItem.mjs";
import * as mia from "../db/menuItemAccessor.mjs";
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
    if (!action) {
        resp = createResponseObject(
            405,
            `unsupported operation: '${action}'`,
            null
        );
        return resp;
    }
    switch (action.toUpperCase()) {
        case "LIST":
            resp = doList();
            break;
        case "ADD":
            resp = doAdd(content);
            break;
        case "UPDATE":
            resp = doUpdate(content);
            break;
        case "DELETE":
            resp = doDelete(content);
            break;
        default:
            resp = {
                statusCode: 405,
                err: `unsupported operation: '${action}'`,
                data: null,
            };
    }

    return resp;
}

async function doList() {
    let resp;
    try {
        let items = await mia.getAllItems();
        resp = createResponseObject(200, null, items);
    } catch (err) {
        resp = createResponseObject(
            500,
            "server error - please try again later",
            null
        );
    }

    return resp;
}

async function doAdd(content) {
    let resp;
    if (!(content instanceof MenuItem)) {
        resp = createResponseObject(400, "unrecognized entity", null);
        return resp;
    }

    try {
        let ok = await mia.addItem(content);
        if (ok) {
            resp = createResponseObject(201, null, true);
        } else {
            resp = createResponseObject(
                409,
                "entity already exists - could not add",
                null
            );
        }
    } catch (err) {
        resp = createResponseObject(
            500,
            "server error - please try again later",
            null
        );
    }
    return resp;
}

async function doDelete(content) {
    let resp;
    if (!(content instanceof MenuItem)) {
        resp = createResponseObject(400, "unrecognized entity", null);
        return resp;
    }

    try {
        let ok = await mia.deleteItem(content);
        if (ok) {
            resp = createResponseObject(200, null, true);
        } else {
            resp = createResponseObject(
                404,
                "entity does not exist - could not delete",
                null
            );
        }
    } catch (err) {
        resp = createResponseObject(
            500,
            "server error - please try again later",
            null
        );
    }
    return resp;
}

async function doUpdate(content) {
    let resp;
    if (!(content instanceof MenuItem)) {
        resp = createResponseObject(400, "unrecognized entity", null);
        return resp;
    }

    try {
        let ok = await mia.updateItem(content);
        if (ok) {
            resp = createResponseObject(200, null, true);
        } else {
            resp = createResponseObject(
                404,
                "entity does not exist - could not update",
                null
            );
        }
    } catch (err) {
        resp = createResponseObject(
            500,
            "server error - please try again later",
            null
        );
    }
    return resp;
}

function createResponseObject(statusCode, err, data) {
    return {
        statusCode: statusCode,
        err: err,
        data: data,
    };
}


export { processRequest };
