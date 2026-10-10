<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DatabaseController extends Controller
{
    public function export()
    {
        $tables = [
            'batches', 'students', 'payments', 'attendances', 
            'exams', 'exam_marks', 'expenses', 'staff', 
            'coaching_settings', 'online_admissions', 'enrollment_links'
        ];

        $data = [];
        foreach ($tables as $table) {
            $data[$table] = DB::table($table)->get();
        }

        return response()->json($data);
    }

    public function import(Request $request)
    {
        $data = $request->all();
        $tables = [
            'enrollment_links', 'online_admissions', 'coaching_settings', 
            'staff', 'expenses', 'exam_marks', 'exams', 
            'attendances', 'payments', 'students', 'batches'
        ]; // Reverse order or independent to avoid foreign key issues (though we have cascading)

        DB::beginTransaction();
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            foreach ($tables as $table) {
                if (isset($data[$table]) && is_array($data[$table])) {
                    DB::table($table)->truncate();
                    
                    // Insert in chunks to avoid memory/query size limits
                    $chunks = array_chunk($data[$table], 500);
                    foreach ($chunks as $chunk) {
                        // convert stdClass to array if needed
                        $insertData = array_map(function ($item) {
                            return (array) $item;
                        }, $chunk);
                        DB::table($table)->insert($insertData);
                    }
                }
            }

            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            DB::commit();

            return response()->json(['message' => 'Database imported successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            return response()->json(['message' => 'Failed to import database.', 'error' => $e->getMessage()], 500);
        }
    }
}
