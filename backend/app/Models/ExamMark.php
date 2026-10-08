<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamMark extends Model
{
    protected $guarded = [];

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id', 'id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }
}
