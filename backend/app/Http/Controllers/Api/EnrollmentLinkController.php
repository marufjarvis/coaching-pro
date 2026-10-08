<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EnrollmentLink;
use Illuminate\Http\Request;

class EnrollmentLinkController extends Controller
{
    public function index()
    {
        $links = EnrollmentLink::orderBy('id', 'asc')->get();
        return response()->json($links);
    }

    public function store(Request $request)
    {
        $request->validate([
            'batch' => 'required|string',
            'url' => 'required|string'
        ]);

        $link = EnrollmentLink::updateOrCreate(
            ['batch' => $request->input('batch')],
            ['url' => $request->input('url')]
        );

        return response()->json($link, 201);
    }

    public function destroy($id)
    {
        $link = EnrollmentLink::find($id);
        if ($link) {
            $link->delete();
        }

        return response()->json(['message' => 'Link deleted successfully']);
    }
}
