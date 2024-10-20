/**
 * Get object from localStorage or empty Array
 * @param {*} key
 * @returns {(Object | Array)}
 */
export const getFromStorage = function (key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
};

/**
 * Add new item to localSrotage by key
 * @param {Object} obj
 * @param {String} key
 */
export const addToStorage = function (obj, key) {
    const storageData = getFromStorage(key);
    storageData.push(obj);
    localStorage.setItem(key, JSON.stringify(storageData));
};

/**
 * Set object by key to localStorage
 * @param {Object} obj
 * @param {String} key
 */
export const updateStorage = function (obj, key) {
    localStorage.setItem(key, JSON.stringify(obj));
};

export const generateTestUser = function (User) {
    if (!localStorage.users) {
        const testUser = new User("test", "qwerty123");
        User.save(testUser);

        const testAdmin = new User("admin", "admin123", "admin");
        User.save(testAdmin);
    }
};
