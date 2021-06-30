const fetch = require('node-fetch');

const API_URL = 'http://localhost:4000/api/v1';

/**
 * Fetches from a URL and promises the result as a JSON or Error object
 * @param {string} url
 * @param {string} [method] - ignored if body is absent
 * @param {Object} [body] - ignored if method is absent
 * @returns {Promise}
 */
function fetchPromiseJsonOrErr(url, method, body) {
    let fetchArgs = [url];
    if (method && body) {
        fetchArgs.push({
            method,
            body: JSON.stringify(body),
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        })
    }
    let fetchStatus = 0;
    const response = fetch(...fetchArgs)
        .then(res => {
            fetchStatus = res.status;
            return res.json();
        })
        .catch(err => err);
    response.then(json => {
        if (isGoodStatusCode(fetchStatus)) {
            return json;
        } else {
            json.isAnError = true; // needed since instanceOf Error doesn't work between files
            return createNewError(json);
        }
    });
    return response;
}

/**
 * Checks if an HTTP status code is in the 200s
 * @param {number} status
 * @returns {boolean}
 */
function isGoodStatusCode(status) {
    return (200 <= status && status < 300);
}

/**
 * Creates a new error from the argument, giving it property isAnError: true
 * This is needed because instanceOf Error does not work between files
 * @param {Any} error 
 * @returns {Error}
 */
function createNewError(error) {
    error.isAnError = true;
    return new Error(error);
}

/**
 * Returns the desired value unless given an error, in which case returns a
 * new Error object made from the error.
 * Errors must have property isAnError: true, since instanceOf Error does not
 * work between files.
 * @param {Any} value - the value that might be an error
 * @param {Any} [desired = value] - the desired value we hope to return
 * @returns {Any}
 */
function checkIfError(value, desired) {
    if (value.isAnError) {
        return createNewError(value.error);
    }
    if (!desired) {
        desired = value;
    }
    return desired;
}

module.exports = {
    API_URL,
    fetchPromiseJsonOrErr,
    createNewError,
    checkIfError
};