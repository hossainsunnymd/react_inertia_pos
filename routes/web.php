<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/',[AuthController::class,'loginPage'])->name('login');

Route::post('/login',[AuthController::class,'login'])->name('login.post');
Route::get('/logout',[AuthController::class,'logout'])->name('logout');

//users

Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/user-save', [UserController::class, 'userSavePage'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

//customers

Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
Route::get('/customer-list', [CustomerController::class, 'getCustomers']);
Route::get('/customer-save', [CustomerController::class, 'customerSavePage'])->name('customers.create');
Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
Route::put('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

//categories

Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/category-save', [CategoryController::class, 'categorySavePage'])->name('categories.create');
Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

//products

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/product-list', [ProductController::class, 'getProducts']);
Route::get('/product-save', [ProductController::class, 'categorySavePage'])->name('products.create');
Route::post('/products', [ProductController::class, 'store'])->name('products.store');
Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');


//invoices

Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
Route::get('/invoice-save', [InvoiceController::class, 'invoiceSavePage'])->name('invoices.create');
Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');

