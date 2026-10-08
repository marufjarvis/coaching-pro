<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    protected $guarded = [];

    public function students()
    {
        return $this->hasMany(Student::class, 'batch', 'name');
    }
}
