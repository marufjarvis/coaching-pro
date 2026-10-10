<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'online', 'app' => "Maruf's ICT Care API"]);
});

// Also register API routes at root so accessing via symlink (/api/batches) or direct (/batches) works seamlessly
Route::middleware('api')->group(base_path('routes/api.php'));

