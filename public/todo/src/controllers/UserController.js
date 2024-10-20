import { getFromStorage, addToStorage, updateStorage } from "../utils";
import { User } from "../models/User";

export function getUsers() {
    let users = getFromStorage("users");
    return users.length ? users : false;
}

export function getUserById(id) {
    let users = getUsers();
    if (!users) return false;
    for (let user of users) {
        if (user.id == id) {
            let curUs = new User();
            curUs.id = user.id;
            curUs.login = user.login;
            curUs.password = user.password;
            curUs.role = user.role;
            return curUs;
        }
    }
    return false;
}

export function isExists(login, password) {
    let users = getUsers();
    if (!users) return false;
    for (let user of users) {
        if (user.login == login && user.password == password) return user.id;
    }
    return false;
}

export function addUser(login, password, role) {
    let newUser = new User(login, password, role);
    addToStorage(newUser, "users");
}

export function updateUser(user) {
    let users = getUsers();

    for (let tempUser of users) {
        if (tempUser.id == user.id) {
            tempUser.login = user.login;
        }
    }
    
    updateStorage(users, "users");
}

export function deleteUser(id) {
    let users = getUsers();
    let newUsers = [];

    for (let user of users) {
        if (user.id != id) {
            newUsers.push(user);
        }
    }

    updateStorage(newUsers, "users");
}

