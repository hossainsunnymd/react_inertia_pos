<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserSaveRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::paginate(10);
        return Inertia::render('users/Users', compact('users'));
    }

    public function userSavePage(Request $request): Response
    {

        $user = User::find($request->id);
        return Inertia::render('users/UserSave', compact('user'));

    }

    public function store(UserSaveRequest $request): RedirectResponse
    {
        User::create($request->validated());
        return back()->with([
            'status' => true,
            'message' => 'User created successfully'
        ]);
    }

    public function update(User $user, UserSaveRequest $request) : RedirectResponse
    {
        $data=$request->validated();
        if(isset($data['password']) && !empty($data['password'])){
         $data['password']=Hash::make($data['password']);
        }else{
            unset($data['password']);
        }

        $user->update($data);
        return back()->with([
            'status' => true,
            'message' => 'User updated successfully'
        ]);
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();
        return back()->with([
            'status' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}
