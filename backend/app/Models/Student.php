<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    public function payments()
    {
        return $this->hasMany(Payment::class, 'student_id', 'id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_id', 'id');
    }

    public function examMarks()
    {
        return $this->hasMany(ExamMark::class, 'student_id', 'id');
    }
}
