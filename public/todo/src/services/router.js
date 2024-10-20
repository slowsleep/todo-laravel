import * as render from "./render";

export function route(appState) {
    let curPath;
    let path = window.location.pathname;
    let arrPath = path.split("/");

    if (arrPath.length) {
        curPath = arrPath[arrPath.length - 1]
    }

    // for github
    let search = window.location.search;

    if (search && search.startsWith("?p=")) {
        curPath = search.replace("?p=/", "");
    }

    switch (curPath) {
        case "":
            return render.content(appState);
        case "profile":
            return render.profile(appState);
        case "users":
            if (appState.currentUser.role == "admin") {
                return render.adminUsers(appState);
            }
        default:
            return render.notFound();
    }

}
