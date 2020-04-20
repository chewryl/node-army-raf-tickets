const db = require('../util/database');

module.exports = class Address {
    constructor(id, address1, address2, townCity, county, postalCode) {
        this.id = id;
        this.address1 = address1;
        this.address2 = address2;
        this.townCity = townCity;
        this.county = county;
        this.postalCode = postalCode;
    }

    async save() {
        return db.execute(
            'INSERT INTO addresses (address1, address2, townCity, county, postalCode) VALUES (?, ?, ?, ?, ?)', 
            [this.address1, this.address2, this.townCity, this.county, this.postalCode]
        );
    }

}