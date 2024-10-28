import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./styles/style.sass";
import * as render from "./services/render";
import * as listener from "./services/listener";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { getFromStorage } from "./utils";
import { route } from "./services/router";

export const appState = new State();

async function checkUserAuth() {
    const response = await fetch('/api/auth/user', {
        method: 'GET',
    });

    if (response.status === 401) {
        return null;
    }

    const result = await response.json();
    return result;
}

async function initApp() {

    let user = await checkUserAuth();

    if (user) {
        appState.currentUser = user;
        let isAdmin = user.role == "admin" ? true : false;
        render.baseTemplate(appState, isAdmin);
        route(appState);
        listener.logout();
    } else {
        render.navRight(false);
        listener.loginForm();
    }

    setupLinkNavigation();
}

function setupLinkNavigation() {
    let links = document.querySelectorAll("a[href]");
    links.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            let href = this.getAttribute('href');
            let url = new URL(window.location.href);
            let newUrl = url.origin + href;

            window.history.pushState({}, "", newUrl)
            route(appState);
        });
    });
    window.addEventListener('popstate', () => {
        route(appState);
    });

}

initApp();
