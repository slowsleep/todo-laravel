import { appState } from "../app";
import { isExists, getUserById } from "../controllers/UserController";

export const authUser = function (login, password) {
    const userId = isExists(login, password);
    if (!userId) return false;
    const currentUser = getUserById(userId);
    appState.currentUser = currentUser;
    return true;
};
