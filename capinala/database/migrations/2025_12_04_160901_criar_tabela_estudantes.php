<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('student_number')->unique();
            $table->string('process_number')->nullable()->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birth_date')->nullable();
            $table->string('gender', 15)->nullable();
            $table->string('bi_number');
            $table->string('bi_hash')->index();
            $table->string('passport_number')->nullable();
            $table->string('passport_hash')->nullable()->index();
            $table->string('phone', 30);
            $table->string('email')->nullable();
            $table->string('address_province');
            $table->string('address_municipality');
            $table->string('church')->nullable();
            $table->string('academic_period')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('consent_logged_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
