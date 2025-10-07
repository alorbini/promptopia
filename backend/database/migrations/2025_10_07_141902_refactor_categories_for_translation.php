<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Category;
use App\Models\CategoryTranslation;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create the new translations table
        Schema::create('category_translations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained()->cascadeOnDelete();
            $table->string('lang', 2);
            $table->string('name');
            $table->timestamps();
            $table->unique(['category_id', 'lang']);
        });

        // 2. Move existing data to the new table
        $categories = Category::all();
        foreach ($categories as $category) {
            CategoryTranslation::create([
                'category_id' => $category->id,
                'lang' => 'en', // Assume existing names are English
                'name' => $category->name,
            ]);
             // You can add a placeholder for Arabic here if you want
            CategoryTranslation::create([
                'category_id' => $category->id,
                'lang' => 'ar',
                'name' => 'الاسم باللغة العربية', // Placeholder
            ]);
        }

        // 3. Drop the old name column from the categories table
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }

    public function down(): void
    {
        // Logic to reverse the changes if needed
        Schema::table('categories', function (Blueprint $table) {
            $table->string('name')->after('slug')->nullable();
        });
        
        // This is a simple reversal, might not be perfect for all data
        $translations = CategoryTranslation::where('lang', 'en')->get();
        foreach($translations as $translation) {
            Category::where('id', $translation->category_id)->update(['name' => $translation->name]);
        }

        Schema::dropIfExists('category_translations');
    }
};