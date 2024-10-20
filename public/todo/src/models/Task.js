import { BaseModel } from "./BaseModel";
import { addToStorage } from "../utils";

export class Task extends BaseModel {
    constructor(title, userId, status) {
        super();
        this.title = title;
        this.userId = userId;
        this.status = status;
        this.description = "";
        this.storageKey = "tasks";
    }

    static save(task) {
        try {
            addToStorage(task, task.storageKey);
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }
}
