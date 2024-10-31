<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['middleware' => 'web'], function () {
    Route::post('/login', [AuthController::class, 'auth']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    Route::resource('tasks', TaskController::class)->only(['index', 'store', 'show','update', 'destroy']);
});
