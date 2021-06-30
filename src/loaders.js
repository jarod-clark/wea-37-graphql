const DataLoader = require('dataloader');
const { API_URL, fetchPromiseJsonOrErr } = require('./utilities');

const groceryLoader = new DataLoader(names => Promise.all(names.map(groceryNameToPromise)));
/**
 * Promises the grocery with a given name
 * @param {string} name 
 * @returns {Promise}
 */
function groceryNameToPromise(name) {
    return fetchPromiseJsonOrErr(`${API_URL}/groceries/name/${name}`);
}

const categoryLoader = new DataLoader(categories => Promise.all(categories.map(groceriesCategoryToPromise)));
/**
 * Promises an array of all the groceries with a given category
 * @param {string} category 
 * @returns {Promise}
 */
function groceriesCategoryToPromise(category) {
    return fetchPromiseJsonOrErr(`${API_URL}/groceries/category/${category}`);
}


const allGroceriesLoader = new DataLoader(requests => Promise.all(requests.map(promiseAllGroceries)));
/**
 * Promises an array of all groceries
 * @returns {Promise}
 */
function promiseAllGroceries() {
    return fetchPromiseJsonOrErr(`${API_URL}/groceries`);
}

module.exports = {
    getDataLoaders: () => ({
        groceryLoader,
        categoryLoader,
        allGroceriesLoader
    }),
};