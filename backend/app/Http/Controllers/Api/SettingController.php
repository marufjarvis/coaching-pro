<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CoachingSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    private function formatSettings(CoachingSetting $s)
    {
        return [
            'coachingName' => $s->coaching_name,
            'phone' => $s->phone,
            'address' => $s->address,
            'tagline' => $s->tagline,
            'logoUrl' => $s->logo_url,
            'currency' => '৳',
            'adminPassword' => $s->admin_password ?? 'admin'
        ];
    }

    public function show()
    {
        $setting = CoachingSetting::firstOrCreate(
            ['id' => 1],
            [
                'coaching_name' => "Maruf's ICT Care",
                'phone' => '01723619524',
                'address' => 'Kushtia Govt. College Gate, Kushtia',
                'tagline' => "Don't Memorise, Come To Learn",
                'admin_password' => 'admin'
            ]
        );

        return response()->json($this->formatSettings($setting));
    }

    public function update(Request $request)
    {
        $setting = CoachingSetting::firstOrCreate(['id' => 1]);

        if ($request->has('coachingName')) $setting->coaching_name = $request->input('coachingName');
        if ($request->has('coaching_name')) $setting->coaching_name = $request->input('coaching_name');
        if ($request->has('phone')) $setting->phone = $request->input('phone');
        if ($request->has('address')) $setting->address = $request->input('address');
        if ($request->has('tagline')) $setting->tagline = $request->input('tagline');
        if ($request->has('logoUrl')) $setting->logo_url = $request->input('logoUrl');
        if ($request->has('logo_url')) $setting->logo_url = $request->input('logo_url');
        if ($request->has('adminPassword')) $setting->admin_password = $request->input('adminPassword');
        if ($request->has('admin_password')) $setting->admin_password = $request->input('admin_password');

        $setting->save();

        return response()->json($this->formatSettings($setting));
    }
}
