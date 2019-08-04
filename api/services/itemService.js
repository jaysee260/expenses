var plaidClient = require("../utils/plaid/client");

function ItemService(ACCESS_TOKEN) {
    /** Gets item associated with access token */
    this.getItem = () =>
        new Promise((resolve, reject) => {
            plaidClient.getItem(this.ACCESS_TOKEN)
                .then(itemResponse => {
                    let { item_id, institution_id } = itemResponse.item;
                    resolve({item_id, institution_id});
                })
                .catch(error => reject(error));
        });
}

module.exports = (access_token) => new ItemService(access_token);
