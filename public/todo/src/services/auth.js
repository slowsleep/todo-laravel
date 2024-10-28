import { appState } from "../app";
import { isExists, getUserById } from "../controllers/UserController";

export const authUser = async function (form) {
    let response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: form
    }).then(response => {
        return response;
    });

    const result = await response.json();

    if (result.error) {
        return false;
    }

    appState.currentUser = result.user;
    return true;
};

export const logoutUser = async function () {
    let response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
    }).then(response => {
        return response;
    });

    const result = await response.json();

    if (result.error) {
        return false;
    }

    appState.currentUser = null;
    return true;
}
