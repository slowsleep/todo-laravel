export async function getTask(id) {
    let response = await fetch('/api/tasks/' + id, {
        method: 'GET',
    }).then(response => {
        return response.json();
    });

    if (!response.error) {
        return response.task;
    }

    return false;
}


export async function getTasks() {
    let response = await fetch('/api/tasks', {
        method: 'GET',
    }).then(response => {
        return response.json();
    });

    if (!response.error) {
        return response.tasks;
    }

    return false;
}
export async function storeTask(task)
{
    let response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(task)
    }).then(response => {
        return response.json();
    });

    if (!response.error) {
        return response;
    }

    return false;
}

export async function updateTask(task)
{
    let response = await fetch('/api/tasks/' + task.id, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(task)
    }).then(response => {
        return response.json();
    });

    if (!response.error) {
        return response;
    }

    return false;
}

export async function destroyTask(id)
{
    let response = await fetch('/api/tasks/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
    }).then(response => {
        return response.json();
    });

    if (!response.error) {
        return response;
    }

    return false;
}
