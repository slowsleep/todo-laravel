import * as render from "./render";

export function route(appState) {
    let path = window.location.pathname;

    switch (path) {
        case "/app":
            return render.content(appState);
        case "/app/profile":
            return render.profile(appState);
        case "/app/users":
            if (appState.currentUser.role == "admin") {
                return render.adminUsers(appState);
            }
        default:
            return render.notFound();
    }
}
