import taskFieldTemplate from "../templates/taskField.html";
import profileTemplate from "../templates/pages/profile.html";
import adminUsersTemplate from "../templates/pages/admin/users.html";
import formLoginned from "../templates/nav/right/formLoginned.html";
import formUnloginned from "../templates/nav/right/formUnloginned.html";
import adminMenuTemplate from "../templates/nav/menu/adminMenu.html";
import userMenuTemplate from "../templates/nav/menu/userMenu.html";
import tasksCounters from "../templates/footer/tasksCounters.html";
import { appState } from "../app";
import * as TaskController from "../controllers/TaskController";
import * as UserController from "../controllers/UserController";
import * as listener from "./listener";
import {getFromStorage} from "../utils";

export function baseTemplate(appState, isAdmin) {
    navRight(true);
    menu(isAdmin);
    footer(appState);
}

export function content(appState) {
    document.querySelector("#content").innerHTML = taskFieldTemplate;

    ["backlog", "ready", "in-progress", "finished"].map((status) => {
        document.querySelector(`#app-submit-add-task-${status}`).style.display =
            "none";
    });

    ["ready", "in-progress", "finished"].map((status) => {
        document
            .querySelector(`#app-add-task-${status}`)
            .setAttribute("disabled", true);
    });

    document.querySelector("#app-select-ready").style.display = "none";
    document.querySelector("#app-select-in-progress").style.display = "none";
    document.querySelector("#app-select-finished").style.display = "none";

    let tasksListBacklog = document.querySelector("#app-tasks-list-backlog");
    let tasksListReady = document.querySelector("#app-tasks-list-ready");
    let tasksListInProgress = document.querySelector(
        "#app-tasks-list-in-progress"
    );
    let tasksListFinished = document.querySelector("#app-tasks-list-finished");

    let user = appState.currentUser;

    // Adding users task to page in blocks by status
    if (user) {
        let isAdmin = false;
        let backlogTasks, readyTasks, inProgressTasks, finishedTasks;
        const status = ["backlog", "ready", "in-progress", "finished"];
        if (user.role == "admin") {
            isAdmin = true;
            backlogTasks = [];
            readyTasks = [];
            inProgressTasks = [];
            finishedTasks = [];
            let tasks = getFromStorage("tasks");
            for (let task of tasks) {
                if (task.status == status[0]) backlogTasks.push(task)
                if (task.status == status[1]) readyTasks.push(task)
                if (task.status == status[2]) inProgressTasks.push(task)
                if (task.status == status[3]) finishedTasks.push(task)
            }
        } else {
            backlogTasks = TaskController.getUsersTasksByStatus(
                user.id,
                "backlog"
            );
            readyTasks = TaskController.getUsersTasksByStatus(user.id, "ready");
            inProgressTasks = TaskController.getUsersTasksByStatus(
                user.id,
                "in-progress"
            );
            finishedTasks = TaskController.getUsersTasksByStatus(
                user.id,
                "finished"
            );
        }

        if (backlogTasks && backlogTasks.length > 0) {
            document
                .querySelector("#app-add-task-ready")
                .removeAttribute("disabled");
            backlogTasks.map((taskBacklog) => {
                addTaskToList(tasksListBacklog, taskBacklog, isAdmin);
                listener.changeModalOnClickTaskById(taskBacklog.id);
                listener.taskDrag(taskBacklog.id);
            });
        }
        if (readyTasks && readyTasks.length > 0) {
            document
                .querySelector("#app-add-task-in-progress")
                .removeAttribute("disabled");
            readyTasks.map((readyTask) => {
                addTaskToList(tasksListReady, readyTask, isAdmin);
                listener.changeModalOnClickTaskById(readyTask.id);
                listener.taskDrag(readyTask.id);
            });
        }
        if (inProgressTasks && inProgressTasks.length > 0) {
            document
                .querySelector("#app-add-task-finished")
                .removeAttribute("disabled");
            inProgressTasks.map((inProgressTask) => {
                addTaskToList(tasksListInProgress, inProgressTask, isAdmin);
                listener.changeModalOnClickTaskById(inProgressTask.id);
                listener.taskDrag(inProgressTask.id);
            });
        }
        if (finishedTasks && finishedTasks.length > 0) {
            finishedTasks.map((finishedTask) => {
                addTaskToList(tasksListFinished, finishedTask, isAdmin);
                listener.changeModalOnClickTaskById(finishedTask.id);
            });
        }

        // Adding count task in footer
        renderCount(user, "backlog");
        renderCount(user, "finished");
    }

    listener.addTaskBacklog();
    listener.addTaskFromTo("backlog", "ready", "in-progress");
    listener.addTaskFromTo("ready", "in-progress", "finished");
    listener.addTaskFromTo("in-progress", "finished");
}

// Adding count task in footer
export function renderCount(user, status) {
    let tasksByStatus
    if (user.role == "admin") {
        tasksByStatus = TaskController.getTasksByStatus(status);
    } else {
        tasksByStatus = TaskController.getUsersTasksByStatus(user.id, status);
    }
    let countTask;
    if (status == "backlog") {
        countTask = document.querySelector(`#count-active`);
    } else {
        countTask = document.querySelector(`#count-${status}`);
    }
    countTask.textContent = tasksByStatus.length ? tasksByStatus.length : 0;
}

export function addTaskToList(taskList, task, isAdmin=false) {
    let li = document.createElement("li");
    li.classList = "app-task-list-item";
    li.draggable = true;
    li.dataset.id = task.id;
    li.dataset.bsToggle = "modal";
    li.dataset.bsTarget = "#modalTask";
    if (isAdmin) {
        let ownerTask = UserController.getUserById(task.userId);
        li.textContent = `${ownerTask.login}: `;
    }
    li.textContent += task.title;
    taskList.appendChild(li);
}

export function menu(isAdmin = false) {
    document.querySelector("#app-user-menu").innerHTML = userMenuTemplate;
    if (isAdmin) {
        document.querySelector("#app-admin-menu").innerHTML = adminMenuTemplate;
    }
}

export function navRight(isAuth) {
    let fieldHTMLContent = isAuth ? formLoginned : formUnloginned;
    document.querySelector("#app-nav-right").innerHTML = fieldHTMLContent;

    if (appState.currentUser) {
        let user = UserController.getUser();
        if (user) {
            document.querySelector("#app-menu-login").innerHTML = user.name;
            let userAvatar = document.querySelector("#app-user-avatar");
            if (user.avatar) {
                userAvatar = user.avatar;
            }
        }
    }
}

export function footer(appState=false) {
    document.querySelector("#app-footer-counters").innerHTML = tasksCounters;
    if (appState) {
        renderCount(appState.currentUser, "backlog")
        renderCount(appState.currentUser, "finished")
    }
}

export function notFound() {
    document.querySelector("#content").innerHTML = "404 <br> Page not Found";
}

export function profile(appState) {
    document.querySelector("#content").innerHTML = profileTemplate;
    let user = UserController.getUser();
    let profileLogin = document.querySelector("#app-profile-login");
    profileLogin.textContent = user.name;

    let profileContent = document.querySelector("#app-profile-content");
    let formChange = document.querySelector("#app-form-profile-change");
    formChange.style.display = "none";

    let btnChange = document.querySelector("#app-btn-change-profile");

    btnChange.addEventListener("click", function(e) {
        e.target.style.display = "none";
        formChange.style.display = "block";
        profileContent.style.display = "none";

        document.querySelector("#app-form-change-login").value = user.name;

        let btnCancel = document.querySelector("#app-btn-cancel-change-profile");
        btnCancel.addEventListener("click", function() {
            profileContent.style.display = "block";
            formChange.style.display = "none";
            btnChange.style.display = "block";
        });

        let btnSave = document.querySelector("#app-btn-save-change-profile");
        btnSave.addEventListener("click", function() {
            let newLogin = document.querySelector("#app-form-change-login").value;
            if (newLogin) {
                user.name = newLogin;
                UserController.updateUser(user);

                profileLogin.textContent = user.name;
                let menuLogin = document.querySelector("#app-menu-login");
                menuLogin.textContent = user.name;

                profileContent.style.display = "block";
                formChange.style.display = "none";
                btnChange.style.display = "block";
            }

        });
    })
}

const addUserToList = (user, listTemplate) => {
    let itemListAdmin = document.createElement("li");
    itemListAdmin.dataset.id = user.id;
    itemListAdmin.classList =
        "d-flex justify-content-between align-items-center border-bottom p-2 m-1 border-primary-subtle";

    let loginItemListAdmin = document.createElement("p");
    loginItemListAdmin.classList = "m-0";
    loginItemListAdmin.textContent = user.login;

    itemListAdmin.appendChild(loginItemListAdmin);

    if (user.id == appState.currentUser.id) {
        let youTextItemListAdmin = document.createElement("p");
        youTextItemListAdmin.textContent = "(you)";
        youTextItemListAdmin.classList += "m-0 me-3";
        itemListAdmin.appendChild(youTextItemListAdmin);
    } else {
        let deleteBtnItemListAdmin = document.createElement("button");
        deleteBtnItemListAdmin.classList = "app-btn-user-delete btn btn-danger";
        deleteBtnItemListAdmin.textContent = "delete";
        itemListAdmin.appendChild(deleteBtnItemListAdmin);
    }

    listTemplate.appendChild(itemListAdmin);
};

export function adminUsers(appState) {
    document.querySelector("#content").innerHTML = adminUsersTemplate;

    let adminList = document.querySelector("#app-admin-list");
    let userList = document.querySelector("#app-user-list");

    let users = UserController.getUsers();

    for (let user of users) {
        if (user.role == "admin") {
            addUserToList(user, adminList);
        } else if (user.role == "user") {
            addUserToList(user, userList);
        }
    }

    listener.btnAddUser("user");
    listener.btnAddUser("admin");
    listener.btnUserDelete();
}
