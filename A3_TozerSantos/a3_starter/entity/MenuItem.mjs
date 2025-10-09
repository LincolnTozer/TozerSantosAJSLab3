class MenuItem {
    #id;
    #category;
    #description;
    #price;
    #vegetarian;

    constructor(id, cat, desc, price, veg) {
        this.#id = id;
        this.#category = cat;
        this.#description = desc;
        this.#price = price;
        this.#vegetarian = veg;
    }

    get id() {
        return this.#id;
    }
    get category() {
        return this.#category;
    }
    get description() {
        return this.#description;
    }
    get price() {
        return this.#price;
    }
    get vegetarian() {
        return this.#vegetarian;
    }

    // need this so that JSON.stringify knows what to include
    toJSON() {
        return {
            id: this.#id,
            category: this.#category,
            description: this.#description,
            price: this.#price,
            vegetarian: this.#vegetarian,
        };
    }

    // id (cat): desc ... price (veg)
    formatItem() {
        let res = "";

        res += `${this.#id} (${this.#category}): ${this.#description} ... ${
            this.#price
        }`;
        if (this.#vegetarian && this.#category !== "DES") {
            res += " (veg)";
        }

        return res;
    }
}

export { MenuItem };
