/**
 * Assignment 3 - Main program
 */
import { createInterface } from "node:readline/promises";
import { MenuItem } from "./entity/MenuItem.mjs";
import { processRequest } from "./api/restaurantService.mjs";

const input = process.stdin; // stdin is the keyboard
const output = process.stdout; // stdout is the monitor (screen)
const reader = createInterface({ input, output });

main();

async function main() {
    let keepGoing = true;
    while (keepGoing) {
        let command = (
            await reader.question("Enter a command ('help' to see choices): ")
        )
            .trim()
            .toLowerCase();
        switch (command) {
            case "list":
                await doList();
                break;
            case "add":
                await doAdd();
                break;
            case "delete":
                await doDelete();
                break;
            case "update":
                await doUpdate();
                break;
            case "help":
                showCommands();
                break;
            case "quit":
                keepGoing = false;
                break;
            default:
                console.log(`  '${command}' is not a recognized command.`);
                break;
        }
    }
    reader.close();
}

async function doList() {
    let resp = await processRequest("LIST", null);
    console.log("  Status: " + resp.statusCode);
    if (resp.err) {
        console.log("  Response: " + resp.err);
    } else {
        let items = resp.data;
        console.log("  Response:");
        items.forEach((item) => console.log(item.formatItem()));
    }
}

async function doAdd() {
    let obj = await getObjectToAddOrUpdate();
    let resp = await processRequest("ADD", obj);
    console.log("  Status: " + resp.statusCode);
    if (resp.err) {
        console.log("  Response: " + resp.err);
    } else {
        let ok = resp.data;
        console.log(
            "  Response: Add operation " + (ok ? "succeeded" : "failed")
        );
    }
}

async function doDelete() {
    let obj = await getObjectToDelete();
    let resp = await processRequest("DELETE", obj);
    console.log("  Status: " + resp.statusCode);
    if (resp.err) {
        console.log("  Response: " + resp.err);
    } else {
        let ok = resp.data;
        console.log(
            "  Response: Delete operation " + (ok ? "succeeded" : "failed")
        );
    }
}

async function doUpdate() {
    let obj = await getObjectToAddOrUpdate();
    let resp = await processRequest("UPDATE", obj);
    console.log("  Status: " + resp.statusCode);
    if (resp.err) {
        console.log("  Response: " + resp.err);
    } else {
        let ok = resp.data;
        console.log("  Data:");
        console.log(
            "  Response: Update operation " + (ok ? "succeeded" : "failed")
        );
    }
}

function showCommands() {
    console.log();
    console.log("  list");
    console.log("  add");
    console.log("  delete");
    console.log("  update");
    console.log("  help");
    console.log("  quit");
    console.log();
}

async function getObjectToAddOrUpdate() {
    let id = Number(await reader.question("Enter the ID: "));
    let cat = await reader.question("Enter the category: ");
    let desc = await reader.question("Enter the description: ");
    let price = Number(await reader.question("Enter the price: "));
    let vegStr = await reader.question("Is the item vegetarian (Y/N): ");
    let veg = vegStr === "Y" || vegStr === "y";
    return new MenuItem(id, cat, desc, price, veg);
}

async function getObjectToDelete() {
    let id = Number(await reader.question("Enter the ID: "));
    let obj = new MenuItem(id, "", "", 0, true); // dummy object
    return obj;
}
