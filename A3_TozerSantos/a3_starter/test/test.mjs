// your code here

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
    };
}
