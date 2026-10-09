<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle Admin and Manager login verification
     * Accounts cannot be registered from UI; credentials are stored in database.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $email = trim(strtolower($request->input('email')));
        $password = $request->input('password');

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'ভুল ইমেইল অথবা পাসওয়ার্ড! সঠিক এডমিন বা ম্যানেজার তথ্য দিন।'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'লগইন সফল হয়েছে!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'admin',
            ]
        ]);
    }
}
