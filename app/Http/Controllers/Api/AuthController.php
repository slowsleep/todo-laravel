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
}
