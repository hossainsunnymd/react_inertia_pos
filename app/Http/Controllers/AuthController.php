<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    //login page
    public function loginPage(): Response
    {
        return Inertia::render('auth/Login');
    }

    //login

    public function login(LoginRequest $request): RedirectResponse
    {
        if (Auth::attempt($request->validated())) {
            $request->session()->regenerate();
            return redirect()->intended('/users');
        }

        return back()->with([
            'status' => false,
            'message' => 'Invalid credentials'
        ]);

    }


}
