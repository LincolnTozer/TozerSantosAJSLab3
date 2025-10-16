// your code here
import { assert } from "chai";
import { ConnectionManager } from "../db/ConnectionManager.mjs";
import { rebuild } from "../db/DatabaseBuilder.mjs";
import { processRequest } from "../api/restaurantService.mjs";
import { MenuItem } from "../entity/MenuItem.mjs";
import * as Constants from "../utils/constants.mjs";
import { getAllItems, getItemByID, itemExists } from "../db/menuItemAccessor.mjs";
let testItems;

describe("RestaurantService Tests", function () {
    // Before running any of the tests, ensure that the database
    // has been restored to its original state.
    before("Setup", async function () {
        testItems = await defineTestItems();
        await ConnectionManager.getConnection(); // open a connection to be shared
        await rebuild();
        console.log("   <<SETUP: Database restored to original state.>>");
    });

    after("Teardown", async function () {
        await ConnectionManager.closeConnection(); // close the shared connection
    });

    describe("Good Requests (200 series)", function () {
        it("LIST returns status 200, null error, and correct list of items.", async function () {
            let result = await processRequest("LIST");
            assert.equal(result.statusCode,200);
            assert.isNull(result.err);

            // Verifying that array is correct length, and objects are of type MenuItem
            assert.equal(result.data.length,Constants.NUM_MENUITEMS);
            assert.isTrue(
                result.data[0] instanceof MenuItem && result.data[Constants.NUM_MENUITEMS-1] instanceof MenuItem,
                "items should be instances of MenuItem"
            );
        });
        it("ADD adds a new item, returns status 201, null error, and data true, if item does not already exist.", async function () {
            let result = await processRequest("ADD",testItems.itemToAdd);
            assert.equal(result.statusCode,201);
            assert.isNull(result.err);
            assert.isTrue(result.data);

            // Verifying that entity has been added.
            assert.isTrue(await itemExists(testItems.itemToAdd));
        });
        it("DELETE deletes an item, returns status 200, null error, and data true, if item exists.", async function () {
            let result = await processRequest("DELETE",testItems.itemToDelete);
            assert.equal(result.statusCode,200);
            assert.isNull(result.err);
            assert.isTrue(result.data);

            // Verifying that entity has been deleted.
            assert.isFalse(await itemExists(testItems.itemToDelete));
        });
        it("UPDATE updates an item, returns status 200, null error, and data true, if item exists.", async function () {
            let result = await processRequest("UPDATE",testItems.itemToUpdate);
            assert.equal(result.statusCode,200);
            assert.isNull(result.err);
            assert.isTrue(result.data);

            // Verifying that entity has been updated
            let item = await getItemByID(testItems.itemToUpdate.id);
            assert.isTrue(item.category === testItems.itemToUpdate.category);
            assert.isTrue(item.description === testItems.itemToUpdate.description);
            assert.isTrue(item.price === testItems.itemToUpdate.price);
            assert.isTrue(item.vegetarian === testItems.itemToUpdate.vegetarian);
        });
    });

    describe("Bad Requests (400 series)",function() {
        describe("Invalid Commands - expect: status 405, error message, and null data", async function() {
            it("Command is empty: API returns expected response", async function () {
                let result = await processRequest("");
                assert.equal(result.statusCode,405);
                assert.isNotNull(result.err);
                assert.isNull(result.data);
            });
            it("Command is null: API returns expected response", async function () {
                let result = await processRequest(null);
                assert.equal(result.statusCode,405);
                assert.isNotNull(result.err);
                assert.isNull(result.data);
            });
            it("Command is 'foo': API returns expected response", async function () {
                let result = await processRequest("foo");
                assert.equal(result.statusCode,405);
                assert.isNotNull(result.err);
                assert.isNull(result.data);
            });
            it("Command is 'addd': API returns expected response", async function () {
                let result = await processRequest("addd");
                assert.equal(result.statusCode,405);
                assert.isNotNull(result.err);
                assert.isNull(result.data);
            });
            it("Command is 'ad': API returns expected response", async function () {
                let result = await processRequest("ad");
                assert.equal(result.statusCode,405);
                assert.isNotNull(result.err);
                assert.isNull(result.data);
            });
        });
        describe("Content is not an Object - expect: status 400, error message, and null data", async function() {
            it("Content is omitted: DELETE does not change database, and returns expected response", async function () {
                let oldItems = await getAllItems();
                let result = await processRequest("DELETE");
                assert.equal(result.statusCode,400);
                assert.isNotNull(result.err);
                assert.isNull(result.data);
                
                // Verifying that nothing has been deleted from the database.
                let newItems = await getAllItems();
                assert.equal(oldItems.length, newItems.length)
            });
            it("Content is null: DELETE does not change database, and returns expected response", async function () {
                let oldItems = await getAllItems();
                let result = await processRequest("DELETE",null);
                assert.equal(result.statusCode,400);
                assert.isNotNull(result.err);
                assert.isNull(result.data);

                // Verifying that nothing has been deleted from the database.
                let newItems = await getAllItems();
                assert.equal(oldItems.length, newItems.length)
            });
            it("Content is a string: DELETE does not change database, and returns expected response", async function () {
                let oldItems = await getAllItems();
                let result = await processRequest("DELETE","test");
                assert.equal(result.statusCode,400);
                assert.isNotNull(result.err);
                assert.isNull(result.data);

                // Verifying that nothing has been deleted from the database.
                let newItems = await getAllItems();
                assert.equal(oldItems.length, newItems.length)
            });
            it("Content is a valid ID (number): DELETE does not change database, and returns expected response", async function () {
                let oldItems = await getAllItems();
                let result = await processRequest("DELETE",100);
                assert.equal(result.statusCode,400);
                assert.isNotNull(result.err);
                assert.isNull(result.data);

                // Verifying that nothing has been deleted from the database.
                let newItems = await getAllItems();
                assert.equal(oldItems.length, newItems.length)
            });
        });
        describe("Content is an Object but not a MenuItem - expect: status 400, error message, and null data", async function() {
            it("ADD returns expected response", async function () {
                let result = await processRequest("ADD",testItems.badItem14);
                assert.equal(result.statusCode,400);
                assert.isNotNull(result.err);
                assert.isNull(result.data);

                // Verifying that nothing has been added to the database.
                assert.isFalse(await itemExists(testItems.badItem14));
            });
            it("DELETE returns expected response", async function () {
                let result = await processRequest("DELETE",testItems.badItem15);
                assert.equal(result.statusCode,400);
                assert.isNotNull(result.err);
                assert.isNull(result.data);

                // Verifying that the real entity has not been deleted from the database.
                assert.isTrue(await itemExists(testItems.badItem15));
            });
            it("UPDATE returns expected response", async function () {
                let result = await processRequest("UPDATE",testItems.badItem16);
                assert.equal(result.statusCode,400);
                assert.isNotNull(result.err);
                assert.isNull(result.data);

                // Verifying that the real entity has not been changed in the database. 
                let item = await getItemByID(testItems.badItem16.id);
                assert.isFalse(item.category === testItems.badItem16.category);
                assert.isFalse(item.description === testItems.badItem16.description);
                assert.isFalse(item.price === testItems.badItem16.price);
                assert.isFalse(item.vegetarian === testItems.badItem16.vegetarian);
            });
        });
        describe("Content is a MenuItem, but the operation cannot be performed", async function() {
            it("ADD does not change database, returns status 409, error message, and null data, if item already exists", async function () {
                let oldItems = await getAllItems();
                let result = await processRequest("ADD",testItems.goodItem);
                assert.equal(result.statusCode,409);
                assert.isNotNull(result.err);
                assert.isNull(result.data);

                // Verifying that the database has not changed.
                let newItems = await getAllItems();
                assert.equal(oldItems.length, newItems.length)
            });
            it("DELETE does not change database, returns status 404, error message, and null data, if item does not exist", async function () {
                let oldItems = await getAllItems();
                let result = await processRequest("DELETE",testItems.badItem);
                assert.equal(result.statusCode,404);
                assert.isNotNull(result.err);
                assert.isNull(result.data);

                // Verifying that the database has not changed.
                let newItems = await getAllItems();
                assert.equal(oldItems.length, newItems.length)
            });
            it("UPDATE does not change database, returns status 404, error message, and null data, if item does not exist", async function () {
                let oldItems = await getAllItems();
                let result = await processRequest("UPDATE",testItems.badItem);
                assert.equal(result.statusCode,404);
                assert.isNotNull(result.err);
                assert.isNull(result.data);

                // Verifying that the database has not changed.
                let newItems = await getAllItems();
                assert.equal(oldItems.length, newItems.length)
            });
        });
    });
    describe("Server Errors (500 series) - expect: status 500, error message, and null data",function() { 
        before("Setup - corrupt connection string", async function() {
            Constants.setConnectionString("mongodb://127.0.0.1:99999");
            console.log("       <<SETUP: Connection string corrupted.>>");
        });
        after("Teardown - restore valid connection string", async function() {
            Constants.setConnectionString("mongodb://127.0.0.1:27017");
            console.log("       <<TEARDOWN: Connection string repaired.>>");
        });

        it("LIST returns expected response, if there is a server-side error", async function () {
            let result = await processRequest("LIST");
            assert.equal(result.statusCode,500);
            assert.isNotNull(result.err);
            assert.isNull(result.data);
        });
        it("ADD returns expected response, if there is a server-side error", async function () {
            let result = await processRequest("ADD",testItems.itemToAdd);
            assert.equal(result.statusCode,500);
            assert.isNotNull(result.err);
            assert.isNull(result.data);
        });
        it("DELETE returns expected response, if there is a server-side error", async function () {
            let result = await processRequest("DELETE",testItems.itemToDelete);
            assert.equal(result.statusCode,500);
            assert.isNotNull(result.err);
            assert.isNull(result.data);
        });
        it("UPDATE returns expected response, if there is a server-side error", async function () {
            let result = await processRequest("UPDATE",testItems.itemToUpdate);
            assert.equal(result.statusCode,500);
            assert.isNotNull(result.err);
            assert.isNull(result.data);
        });
    });
});

/* helper function */
async function defineTestItems() {
    return {
        goodItem: new MenuItem(107, "", "", 0, false),
        badItem: new MenuItem(777, "", "", 0, false),
        itemToAdd: new MenuItem(888, "ENT", "poutine", 11, false),
        itemToDelete: new MenuItem(202, "", "", 30, false),
        itemToUpdate: new MenuItem(303, "ENT", "after update", 11, false),
        wrongTypeItem: {
            id: 107,
            category: "",
            description: "",
            price: 0,
            vegetarian: false,
        },
        badItem14: {
            id: 999,
            category: "DES",
            description: "apple crisp",
            price: 12,
            vegetarian: true,
        },
        badItem15: {
            id: 201,
            category: "ENT",
            description: "black cod",
            price: 21,
            vegetarian: false,
        },
        badItem16: {
            id: 301,
            category: "DES",
            description: "wrong",
            price: -1,
            vegetarian: false,
        }
    };
}
