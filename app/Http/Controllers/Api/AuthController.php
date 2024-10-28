<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function auth(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if ($token = Auth::guard()->attempt($credentials)) {
            return response()->json([
                'error' => false,
                'user' => User::where('email', $request->email)->first(),
            ], 200)
                ->header('Authorization', $token);
        }

        return response()->json(['error' => true, 'error_message' => 'User not found'], 200);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['error' => false, 'message' => 'User is logout'], 200);
    }

    public function user(Request $request)
    {
        if (Auth::check()) {
            return response()->json(Auth::user());
        }

        return response()->json(null, 401);
    }
}
