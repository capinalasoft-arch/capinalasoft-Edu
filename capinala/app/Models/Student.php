<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Crypt;

class Student extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'school_id',
        'student_number',
        'process_number',
        'first_name',
        'last_name',
        'birth_date',
        'gender',
        'bi_number',
        'bi_hash',
        'passport_number',
        'passport_hash',
        'phone',
        'email',
        'address_province',
        'address_municipality',
        'church',
        'academic_period',
        'metadata',
        'consent_logged_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'metadata' => 'array',
        'birth_date' => 'date',
        'consent_logged_at' => 'datetime',
    ];

    protected $hidden = [
        'bi_number',
        'passport_number',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function classes()
    {
        return $this->belongsToMany(SchoolClass::class, 'enrollments', 'student_id', 'class_id')
            ->withTimestamps();
    }

    public function setBiNumberAttribute(?string $value): void
    {
        if (blank($value)) {
            $this->attributes['bi_number'] = null;
            $this->attributes['bi_hash'] = null;

            return;
        }

        $this->attributes['bi_number'] = Crypt::encryptString($value);
        $this->attributes['bi_hash'] = hash('sha256', $value);
    }

    public function getBiNumberAttribute(?string $value): ?string
    {
        return $value ? Crypt::decryptString($value) : null;
    }

    public function setPassportNumberAttribute(?string $value): void
    {
        if (blank($value)) {
            $this->attributes['passport_number'] = null;
            $this->attributes['passport_hash'] = null;

            return;
        }

        $this->attributes['passport_number'] = Crypt::encryptString($value);
        $this->attributes['passport_hash'] = hash('sha256', $value);
    }

    public function getPassportNumberAttribute(?string $value): ?string
    {
        return $value ? Crypt::decryptString($value) : null;
    }
}
