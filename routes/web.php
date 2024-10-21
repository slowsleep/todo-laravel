<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Todo\IndexController as TodoController;

Route::get('/', function () {
    return view('welcome');
});

Route::group(['prefix' => 'app'], function () {
    Route::get('/', [TodoController::class, 'index']);
    Route::get('/profile', [TodoController::class, 'index']);
    Route::get('/users', [TodoController::class, 'index']);
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
