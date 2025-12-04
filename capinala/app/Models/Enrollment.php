<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enrollment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'school_id',
        'student_id',
        'class_id',
        'enrollment_number',
        'periodo_letivo',
        'academic_year',
        'status',
        'metadata',
        'consent_logged_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'metadata' => 'array',
        'consent_logged_at' => 'datetime',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }
}
