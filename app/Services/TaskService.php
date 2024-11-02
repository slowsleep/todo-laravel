<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskService
{
    /**
     * Return all tasks for current user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTasks()
    {
        $user = Auth::user();
        return Task::where('user_id', $user->id)->get();
    }
}

