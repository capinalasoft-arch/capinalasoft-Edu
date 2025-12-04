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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('teacher_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('bi_number')->nullable();
            $table->string('bi_hash')->nullable()->index();
            $table->string('passport_number')->nullable();
            $table->string('passport_hash')->nullable()->index();
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable();
            $table->string('address_province')->nullable();
            $table->string('address_municipality')->nullable();
            $table->string('church')->nullable();
            $table->string('position')->nullable();
            $table->string('academic_period')->nullable();
            $table->json('metadata')->nullable();
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
        Schema::dropIfExists('teachers');
    }
};
