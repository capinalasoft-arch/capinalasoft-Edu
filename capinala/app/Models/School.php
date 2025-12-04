<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'nif',
        'process_number',
        'province',
        'municipality',
        'church',
        'church_headquarter',
        'address',
        'phone',
        'email',
        'timezone',
        'logo_path',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }

    public function classes()
    {
        return $this->hasMany(SchoolClass::class, 'school_id');
    }
}
