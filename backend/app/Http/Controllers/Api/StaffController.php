<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function index()
    {
        $staff = Staff::orderBy('id', 'asc')->get();
        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
        ]);

        $member = Staff::create([
            'name' => trim($request->input('name')),
            'phone' => trim($request->input('phone')),
            'role' => $request->input('role', 'Manager'),
            'status' => $request->input('status', 'Active')
        ]);

        return response()->json($member, 201);
    }

    public function destroy($id)
    {
        $member = Staff::find($id);
        if ($member) {
            $member->delete();
        }

        return response()->json(['message' => 'Staff member deleted successfully']);
    }
}
