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
        Schema::create('public_trackings', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'preview', 'download'
            $table->string('document_type'); // 'dalam_negeri', 'luar_negeri', 'flipbook_dalam', 'flipbook_luar'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('public_trackings');
    }
};
