<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getProgressByProcess($processId, Request $request)
    {
        error_log('getProgressByProcess');
        error_log('User Role: ' . $request->query('user_role'));
        
        // Resto del código...
    }
} 