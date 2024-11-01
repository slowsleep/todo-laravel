import { authUser, logoutUser } from "./auth";
import { appState } from "../app";
import { Task } from "../models/Task";
import * as TaskController from "../controllers/TaskController";
import * as UserController from "../controllers/UserController";
import { addTaskToList, renderCount } from "./render";
import * as ApiTaskController from "../controllers/ApiTaskController";

export function loginForm() {
    const loginForm = document.querySelector("#app-login-form");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const isAuth = await authUser(formData);

        if (isAuth) {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: appState.currentUser.id,
                    name: appState.currentUser.name,
                    role: appState.currentUser.role,
                })
            );
        } else {
            alert("Доступ запрещен");
        }

        window.location.reload();
    });
}

export function logout() {
    const logoutBtn = document.querySelector("#app-logout-btn");

    logoutBtn.addEventListener("click", async function (e) {
        e.preventDefault();
        const isLogout = await logoutUser();

        if (isLogout) {
            localStorage.removeItem("user");
            window.location.reload();
        } else {
            alert("Произошла ошибка выхода");
        }
    });
}

export function addTaskBacklog() {
    const btnAddTaskBacklog = document.querySelector("#app-add-task-backlog");

    btnAddTaskBacklog.addEventListener("click", function (e) {
        const taskBacklogList = document.querySelector(
            "#app-tasks-list-backlog"
        );
        const btnSubmitAddTaskBacklog = document.querySelector(
            "#app-submit-add-task-backlog"
        );
        const textArea = document.createElement("textarea");
        textArea.classList = "form-control rounded";
        textArea.id = "app-textarea-add-backlog";
        taskBacklogList.appendChild(textArea);
        e.target.style.display = "none";

        if (btnSubmitAddTaskBacklog.style.display == "none") {
            btnSubmitAddTaskBacklog.style.display = "block";
        }

        btnSubmitAddTaskBacklog.addEventListener("click", async function (e) {
            e.stopImmediatePropagation();
            e.target.style.display = "none";

            let textareaAddBacklog = document.querySelector(
                "#app-textarea-add-backlog"
            );

            if (textareaAddBacklog.value) {
                let taskEntity = await ApiTaskController.storeTask({
                    title: textareaAddBacklog.value,
                    status: "backlog",
                });

                let task = {
                    id: taskEntity.task.id,
                    title: textareaAddBacklog.value,
                    userId: appState.currentUser.id,
                    status: "backlog",
                };

                taskBacklogList.removeChild(taskBacklogList.lastChild);
                let isAdmin = appState.currentUser.role == "admin" ? true : false;
                addTaskToList(taskBacklogList, task, isAdmin);
                // update count active
                renderCount(appState.currentUser, "backlog");

                const btnAddTaskReady = document.querySelector(
                    "#app-add-task-ready"
                );

                if (btnAddTaskReady.getAttribute("disabled")) {
                    btnAddTaskReady.removeAttribute("disabled");
                }

                changeModalOnClickTaskById(task.id);
                taskDrag({taskId: task.id, taskStatus: task.status});
            } else {
                taskBacklogList.removeChild(taskBacklogList.lastChild);
            }

            btnAddTaskBacklog.style.display = "block";
        });
    });
}

export function addTaskFromTo(oldStatus, newStatus, nextStatus = false) {
    const btnAddTaskNewStatus = document.querySelector(
        `#app-add-task-${newStatus}`
    );

    btnAddTaskNewStatus.addEventListener("click", async function (e) {
        e.stopImmediatePropagation();

        let tasksOldStatus;
        let tasks = await ApiTaskController.getTasks();
        tasksOldStatus = tasks.filter((task) => task.status == oldStatus);
        let selectNewStatus = document.querySelector(
            `#app-select-${newStatus}`
        );
        selectNewStatus.innerHTML = "";
        let defaultOption = document.createElement("option");
        defaultOption.textContent = "Выберите задачу";
        selectNewStatus.appendChild(defaultOption);

        if (tasksOldStatus.length) {
            let taskListNewStatus = document.querySelector(
                `#app-tasks-list-${newStatus}`
            );

            for (let task of tasksOldStatus) {
                let option = document.createElement("option");
                option.textContent = task.title;
                option.dataset.id = task.id;
                selectNewStatus.appendChild(option);
            }

            if (selectNewStatus.style.display == "none") {
                selectNewStatus.style.display = "block";
            }

            selectNewStatus.addEventListener("change", async function (e) {
                e.stopImmediatePropagation();
                let selectedTask = {
                    id: e.target.options[e.target.selectedIndex].dataset.id,
                    title: selectNewStatus.value,
                    userId: await ApiTaskController.getTask(e.target.options[e.target.selectedIndex].dataset.id).userId,
                    status: newStatus,
                };
                let taskListOldStatus = document.querySelector(
                    `#app-tasks-list-${oldStatus}`
                );
                let oldTaskFromOldStatus = document.querySelector(
                    `li[data-id="${selectedTask.id}"]`
                );
                taskListOldStatus.removeChild(oldTaskFromOldStatus);
                await ApiTaskController.updateTask({id: selectedTask.id, status: newStatus});

                let isAdmin = appState.currentUser.role == "admin";
                addTaskToList(taskListNewStatus, selectedTask, isAdmin);
                e.target.style.display = "none";

                if (!taskListOldStatus.childNodes.length) {
                    btnAddTaskNewStatus.setAttribute("disabled", true);
                }

                if (nextStatus) {
                    if (
                        document
                            .querySelector(`#app-add-task-${nextStatus}`)
                            .getAttribute("disabled")
                    ) {
                        document
                            .querySelector(`#app-add-task-${nextStatus}`)
                            .removeAttribute("disabled");
                    }
                }

                // update active task count
                if (newStatus == "ready") {
                    renderCount(appState.currentUser, "backlog");
                }

                // update finished task count
                if (newStatus == "finished") {
                    renderCount(appState.currentUser, "finished");
                }

                changeModalOnClickTaskById(selectedTask.id);
                taskDrag({taskId: selectedTask.id, taskStatus: selectedTask.status});
            });
        }
    });
}

export function btnAddUser(role) {
    let btn = document.querySelector(`#app-create-${role}`);

    btn.addEventListener("click", function () {
        let login = prompt("Enter login:");
        if (!login) return false;
        let password = prompt("Enter password:");
        if (!password) return false;
        UserController.addUser(login, password, role);
        window.location.reload();
    });
}

export function btnUserDelete() {
    let deleteBtns = document.querySelectorAll(".app-btn-user-delete");

    deleteBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            let userId = e.target.parentNode.dataset.id;
            UserController.deleteUser(userId);
            TaskController.deleteAllUserTask(userId);
            window.location.reload();
        });
    });
}

function listenModal() {
    let modal = document.querySelector("#modalTask");
    let modalLabel = document.querySelector("#exampleModalLabel");
    let contentModalShowTask = document.querySelector(
        "#app-modal-content-task-show"
    );
    let contentModalEditTask = document.querySelector(
        "#app-modal-content-task-edit"
    );
    let btnEditTask = document.querySelector("#app-modal-btn-edit-task");
    let btnSaveTask = document.querySelector("#app-modal-btn-save-task");
    let btnDeleteTask = document.querySelector("#app-modal-btn-delete-task");

    modal.addEventListener("shown.bs.modal", async function (e) {
        e.stopImmediatePropagation();
        let task = await ApiTaskController.getTask(e.target.dataset.taskId);
        modalLabel.textContent = task.title;

        if (contentModalShowTask.style.display == "none") {
            contentModalShowTask.style.display = "block";
        }

        contentModalEditTask.style.display = "none";
        btnSaveTask.style.display = "none";

        if (btnEditTask.style.display == "none") {
            btnEditTask.style.display = "block";
        }

        document.querySelector("#app-task-title").textContent = task.title;
        document.querySelector("#app-task-description").textContent =
            task.description ? task.description : "";
        btnEditTask.dataset.forTaskId = task.id;
        btnEditTask.addEventListener("click", clickEditBtnModalTask);
        btnSaveTask.dataset.forTaskId = task.id;
        btnSaveTask.addEventListener("click", clickSaveBtnModalTask);
        btnDeleteTask.dataset.forTaskId = task.id;
        btnDeleteTask.addEventListener("click", clickDeleteBtnModalTask);
    });

    modal.addEventListener("hide.bs.modal", function (e) {
        e.stopImmediatePropagation();
        btnEditTask.removeEventListener("click", clickEditBtnModalTask);
        btnSaveTask.removeEventListener("click", clickSaveBtnModalTask);
        btnDeleteTask.removeEventListener("click", clickDeleteBtnModalTask);
        modalLabel.textContent = "";
        contentModalShowTask.style.display = "none";
        contentModalEditTask.style.display = "none";
    });

    async function clickEditBtnModalTask(e) {
        let task = await ApiTaskController.getTask(e.target.dataset.forTaskId);
        e.target.style.display = "none";
        contentModalShowTask.style.display = "none";
        contentModalEditTask.style.display = "block";
        document.querySelector("#task-title").value = task.title;
        document.querySelector("#task-description").value = task.description
            ? task.description
            : "";

        if ((btnSaveTask.style.display = "none")) {
            btnSaveTask.style.display = "block";
        }
    }

    async function clickSaveBtnModalTask(e) {
        e.target.style.display = "none";
        let taskId = e.target.dataset.forTaskId;
        let title = document.querySelector("#task-title").value;
        let description = document.querySelector("#task-description").value;
        let updatedTask = {
            id: taskId,
            title,
            description
        };
        let updateTask = await ApiTaskController.updateTask(updatedTask);

        if (updateTask) {
            btnEditTask.style.display = "block";
            contentModalEditTask.style.display = "none";
            contentModalShowTask.style.display = "block";
            modalLabel.textContent = updatedTask.title;
            document.querySelector("#app-task-title").textContent = updatedTask.title;
            document.querySelector("#app-task-description").textContent =
            updatedTask.description ? updatedTask.description : "";
            let isAdmin = appState.currentUser.role == "admin";
            updateTaskInList(taskId, isAdmin);
        } else {
            alert('Произошла ошибка обновления задачи');
        }

    }

    async function clickDeleteBtnModalTask(e) {
        let taskId = e.target.dataset.forTaskId;
        deleteTaskFromList(taskId);
        let task = await ApiTaskController.getTask(taskId);
        await ApiTaskController.destroyTask(taskId);
        changeAddButton(task.status);
        document.querySelector(`button[data-bs-dismiss="modal"]`).dispatchEvent(new Event("click"));
    }
}

/**
 * Change modal on click only one task in list
 */
export function changeModalOnClickTaskById(id) {
    let liTask = document.querySelector(`li[data-id="${id}"]`);

    liTask.addEventListener("click", function (e) {
        e.stopImmediatePropagation();
        let modal = document.querySelector("#modalTask");
        modal.dataset.taskId = id;
        listenModal();
    });
}

/**
 * Update task in list (li element in ul) on task page
 * @param {Task.id} id
 */
async function updateTaskInList(id, isAdmin=false) {
    let taskInList = document.querySelector(`li[data-id="${id}"]`);
    let task = await ApiTaskController.getTask(id);
    if (isAdmin) {
        let ownreTask = UserController.getUserById(task.userId);
        taskInList.textContent = `${ownreTask.login}: `;
        taskInList.textContent += task.title;
    } else {
        taskInList.textContent = task.title;
    }
}

function deleteTaskFromList(id) {
    let taskInList = document.querySelector(`li[data-id="${id}"]`);
    taskInList.remove();
}

async function changeAddButton(status) {
    const statuses = ["backlog", "ready", "in-progress", "finished"];

    if (status !== statuses[3]) {
        let tasksByStatus;
        let tasks = await ApiTaskController.getTasks();
        tasksByStatus = tasks.filter(task => task.status == status);

        let indexStatus = statuses.indexOf(status);
        let nextStatus = statuses[indexStatus+1];
        let addBtnNextStatus = document.querySelector(`#app-add-task-${nextStatus}`);

        if (tasksByStatus.length == 0) {
            addBtnNextStatus.setAttribute("disabled", true);
        } else {
            addBtnNextStatus.removeAttribute("disabled");
        }
    }
}

export function taskDrag({taskId, taskStatus}) {
    let task = document.querySelector(`.app-task-list-item[data-id="${taskId}"]`);
    const statuses = ["backlog", "ready", "in-progress", "finished"];

    task.addEventListener("dragstart", function(e) {
        let status = taskStatus;
        let indexStatus = statuses.indexOf(status);
        let nextStatus = statuses[indexStatus+1];

        if (nextStatus && status != statuses[3] ) {
            e.dataTransfer.effectAllowed='move';
            e.dataTransfer.setData("taskId", taskId);
            // Устанавливаем допустимый для перетаскивания статус
            task.dataset.allowedStatus = nextStatus;
            let blockNextStatus = document.querySelector(`#app-taskblock-${nextStatus}`);
            blockNextStatus.addEventListener('dragenter',nextStatusDragenter);
            blockNextStatus.addEventListener('dragover', nextStatusDragover);
            blockNextStatus.addEventListener('drop', nextStatusDrop);
            blockNextStatus.currentStatus = status;
            blockNextStatus.nextStatus = nextStatus;
        }
    });

    task.addEventListener("dragend", function() {
        let status = taskStatus;
        let indexStatus = statuses.indexOf(status);
        let nextStatus = statuses[indexStatus+1];

        if (nextStatus) {
            removeListeners(nextStatus);
        }
    });

    function removeListeners(status) {
        let blockNextStatus = document.querySelector(`#app-taskblock-${status}`);
        blockNextStatus.removeEventListener('dragenter',nextStatusDragenter);
        blockNextStatus.removeEventListener('dragover', nextStatusDragover);
        blockNextStatus.removeEventListener('drop', nextStatusDrop);
    }

    function nextStatusDragenter(event){
        event.preventDefault();
        return true;
    }

    function nextStatusDragover(event){
        event.preventDefault();
    }

    async function nextStatusDrop(event) {
        event.stopPropagation();

        // Получаем текущий и допустимый для перетаскивания статус
        let taskId = event.dataTransfer.getData("taskId");
        let targetStatus = event.currentTarget.id.replace("app-taskblock-", "");
        let allowedStatus = task.dataset.allowedStatus;

        // Проверка, что перетаскивание разрешено в этот блок
        if (targetStatus === allowedStatus) {
            let list = document.querySelector(`#app-tasks-list-${targetStatus}`);
            let user = UserController.getUserById(appState.currentUser.id);

            list.appendChild(document.querySelector(`li[data-id="${taskId}"]`));

            await ApiTaskController.updateTask({
                id: taskId,
                status: targetStatus,
            });

            changeAddButton(targetStatus);
            changeAddButton(taskStatus);  // предыдущий статус
            taskStatus = targetStatus;    // обновляем текущий статус задачи

            if (taskStatus == "backlog") {
                renderCount(user, taskStatus);
            } else if (targetStatus == "finished") {
                renderCount(user, targetStatus);
            }
        }
    }
}
