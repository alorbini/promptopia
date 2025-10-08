<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, check if the old 'name' column still exists in the 'categories' table.
        // If it doesn't exist, we don't need to do anything.
        if (Schema::hasColumn('categories', 'name')) {

            // Step 1: Ensure the category_translations table exists.
            if (!Schema::hasTable('category_translations')) {
                Schema::create('category_translations', function (Blueprint $table) {
                    $table->uuid('id')->primary();
                    $table->foreignUuid('category_id')->constrained()->cascadeOnDelete();
                    $table->string('lang', 2);
                    $table->string('name');
                    $table->timestamps();
                    $table->unique(['category_id', 'lang']);
                });
            }

            // Step 2: Get all existing categories that have a name.
            $categoriesToMigrate = DB::table('categories')->whereNotNull('name')->get();

            foreach ($categoriesToMigrate as $category) {
                // Step 3: For each category, move its 'name' into the translations table as English.
                DB::table('category_translations')->updateOrInsert(
                    ['category_id' => $category->id, 'lang' => 'en'],
                    ['name' => $category->name, 'created_at' => now(), 'updated_at' => now()]
                );

                // Step 4: Add a placeholder for the Arabic translation.
                DB::table('category_translations')->updateOrInsert(
                    ['category_id' => $category->id, 'lang' => 'ar'],
                    ['name' => 'الاسم باللغة العربية', 'created_at' => now(), 'updated_at' => now()]
                );
            }

            // Step 5: After moving all data, safely drop the old 'name' column.
            Schema::table('categories', function (Blueprint $table) {
                $table->dropColumn('name');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is a one-way fix for a specific production issue.
        // A reversal isn't necessary, but we'll add the column back for completeness.
        if (!Schema::hasColumn('categories', 'name')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->string('name')->after('slug')->nullable();
            });
        }
    }
};