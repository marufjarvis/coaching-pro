<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $guarded = [];

    public function marks()
    {
        return $this->hasMany(ExamMark::class, 'exam_id', 'id');
    }
}
