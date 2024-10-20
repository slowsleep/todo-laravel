import { getFromStorage, updateStorage } from "../utils";

export function getTaskById(id) {
    try {
        const tasks = getFromStorage("tasks");

        for (let task of tasks) {
            if (task.id == id) {
                return task;
            }
        }

        return false;
    } catch (e) {
        throw new Error(e);
    }
}

export function getUsersTasks(userId) {
    let tasks = getFromStorage("tasks");
    let usersTask = [];

    for (let task of tasks) {
        if (task.userId == userId) {
            usersTask.push(task);
        }
    }

    return usersTask.length ? usersTask : false;
}

export function getUsersTasksByStatus(userId, status) {
    let usersTasks = getUsersTasks(userId);
    let tasksByStatus = [];

    if (!usersTasks) return false;

    for (let task of usersTasks) {
        if (task.status == status) {
            tasksByStatus.push(task);
        }
    }

    return tasksByStatus.length ? tasksByStatus : false;
}

export function getTasksByStatus(status) {
    let tasks = getFromStorage("tasks");
    let tasksByStatus = [];

    for (let task of tasks) {
        if (task.status == status) {
            tasksByStatus.push(task);
        }
    }

    return tasksByStatus.length ? tasksByStatus : false;
}

export function setStatus(taskId, status) {
    let tasks = getFromStorage("tasks");

    for (let task of tasks) {
        if (task.id == taskId) {
            task.status = status;
        }
    }

    updateStorage(tasks, "tasks");
}

export function deleteTaskById(id) {
    let tasks = getFromStorage("tasks");
    let newTasks = [];

    for (let task of tasks) {
        if (task.id != id) {
            newTasks.push(task);
        }
    }

    updateStorage(newTasks, "tasks");
}

export function deleteAllUserTask(userId) {
    let tasks = getFromStorage("tasks");
    let newTasks = [];

    for (let task of tasks) {
        if (task.userId != userId) {
            newTasks.push(task);
        }
    }

    updateStorage(newTasks, "tasks");
}

export function updateTask(id, title, description) {
    let tasks = getFromStorage("tasks");

    for (let task of tasks) {
        if (task.id == id) {
            task.title = title;
            task.description = description;
        }
    }

    updateStorage(tasks, "tasks");
}

