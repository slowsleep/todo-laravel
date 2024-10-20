import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";

export class User extends BaseModel {
    constructor(login, password, role = "user") {
        super();
        this.login = login;
        this.password = password;
        this.role = role;
        this.storageKey = "users";
    }

    static save(user) {
        try {
            addToStorage(user, user.storageKey);
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }
}
