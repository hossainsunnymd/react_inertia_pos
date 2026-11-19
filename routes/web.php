<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/',[AuthController::class,'loginPage'])->name('login');

Route::post('/login',[AuthController::class,'login'])->name('login.post');


Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/user-save', [UserController::class, 'userSavePage'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
