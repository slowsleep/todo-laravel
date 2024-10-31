<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{

    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            $tasks = $user->role == "admin" ?
                Task::all() :
                Task::where('user_id', $user->id)->get();

            return response()->json(['error' => false, 'tasks' => $tasks], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            $request->validate([
                'title' => 'required',
                'status' => 'required',
            ]);

            $task = new Task([
                'title' => $request->title,
                'user_id' => $user->id,
                'status' => $request->status,
            ]);
            $task->save();

            return response()->json(['error' => false, 'message' => 'Task created', 'task' => $task], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $task = Task::find($id);
            Log::info($id);
            Log::info($task);
            return response()->json(['error' => false, 'task' => $task], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $task = Task::find($request->id);
            $task->update($request->all());
            return response()->json(['error' => false, 'message' => 'Task updated', 'task' => $task], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $task = Task::find($id);
            $task->delete();
            return response()->json(['error' => false, 'message' => 'Task deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 500);
        }
    }
}
