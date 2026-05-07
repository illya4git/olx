<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('advertisements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->decimal('price', 10, 2);
            $table->float('area');
            $table->string('address');
            $table->enum('status', ['draft', 'published', 'archived'])->default('published');
            $table->text('description')->nullable();
            $table->string('seller_contact')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advertisements');
    }
};
