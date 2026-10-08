<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }
}
