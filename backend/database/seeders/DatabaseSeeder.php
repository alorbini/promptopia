<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Prompt;
use App\Models\PromptTranslation;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User for Filament
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        // Prepare dummy images
        $this->prepareDummyImages();

        // Create Tags
        $enTags = collect(['photorealistic', 'fantasy', 'sci-fi', 'logo', 'essay'])->map(fn ($name) => Tag::factory()->create(['name' => $name, 'lang' => 'en']));
        $arTags = collect(['واقعي', 'خيال', 'خيال علمي', 'شعار', 'مقالة'])->map(fn ($name) => Tag::factory()->create(['name' => $name, 'lang' => 'ar']));

        // Create Categories
        $cat1 = Category::factory()->create(['name' => 'AI Art', 'slug' => 'ai-art', 'icon' => '🎨']);
        $cat2 = Category::factory()->create(['name' => 'Creative Writing', 'slug' => 'creative-writing', 'icon' => '✍️']);
        $cat3 = Category::factory()->create(['name' => 'Business Ideas', 'slug' => 'business-ideas', 'icon' => '💡']);

        // --- Create Prompts for Category 1: AI Art ---
        $this->createBilingualPrompt(
            $cat1,
            'prompts/01.webp',
            ['photorealistic', 'fantasy'],
            ['واقعي', 'خيال'],
            [
                'lang' => 'en',
                'title' => 'Enchanted Forest by Night',
                'subtitle' => 'A photorealistic image of a magical forest under a full moon.',
                'prompt_text' => 'cinematic photo, enchanted forest at midnight, glowing mushrooms, moonlight filtering through ancient trees, hyperrealistic, 8k, detailed, Unreal Engine 5 render, octane render.',
            ],
            [
                'lang' => 'ar',
                'title' => 'غابة مسحورة في الليل',
                'subtitle' => 'صورة واقعية لغابة سحرية تحت ضوء القمر الكامل.',
                'prompt_text' => 'صورة سينمائية، غابة مسحورة في منتصف الليل، فطر متوهج، ضوء القمر يتسلل عبر الأشجار القديمة، واقعية فائقة، 8k، مفصلة، عرض Unreal Engine 5، عرض أوكتان.',
            ]
        );

        $this->createBilingualPrompt(
            $cat1,
            'prompts/02.webp',
            ['sci-fi'],
            ['خيال علمي'],
            [
                'lang' => 'en',
                'title' => 'Cyberpunk Cityscape',
                'subtitle' => 'A sprawling futuristic city with flying vehicles and neon signs.',
                'prompt_text' => 'cyberpunk cityscape, neon-drenched streets, flying cars, towering skyscrapers, Blade Runner aesthetic, moody, rain, reflections on wet pavement, detailed architecture.',
            ],
            [
                'lang' => 'ar',
                'title' => 'منظر مدينة سايبربانك',
                'subtitle' => 'مدينة مستقبلية مترامية الأطراف بمركبات طائرة ولافتات نيون.',
                'prompt_text' => 'منظر مدينة سايبربانك، شوارع غارقة في النيون، سيارات طائرة، ناطحات سحاب شاهقة، جمالية بليد رانر، مزاجية، مطر، انعكاسات على الرصيف المبلل، عمارة مفصلة.',
            ]
        );

        // --- Create Prompts for Category 2: Creative Writing ---
        $this->createBilingualPrompt(
            $cat2,
            'prompts/03.webp',
            ['essay'],
            ['مقالة'],
            [
                'lang' => 'en',
                'title' => 'Opening line for a mystery novel',
                'subtitle' => 'Get a compelling first sentence to kickstart your story.',
                'prompt_text' => 'Write a compelling and mysterious opening line for a detective novel set in 1940s New York. The detective should be cynical but brilliant.',
            ],
            [
                'lang' => 'ar',
                'title' => 'سطر افتتاحي لرواية غامضة',
                'subtitle' => 'احصل على جملة أولى جذابة لبدء قصتك.',
                'prompt_text' => 'اكتب سطرًا افتتاحيًا جذابًا وغامضًا لرواية بوليسية تدور أحداثها في نيويورك في الأربعينيات. يجب أن يكون المحقق ساخرًا ولكنه لامع.',
            ]
        );

        $this->createBilingualPrompt(
            $cat2,
            'prompts/04.webp',
            ['fantasy'],
            ['خيال'],
            [
                'lang' => 'en',
                'title' => 'Describe a fantasy creature',
                'subtitle' => 'Generate a detailed description of a unique fantasy beast.',
                'prompt_text' => 'Describe a creature that lives in the clouds, is made of solidified sunlight, and preys on shadows. Include details about its appearance, habits, and sounds.',
            ],
            [
                'lang' => 'ar',
                'title' => 'صف مخلوقًا خياليًا',
                'subtitle' => 'أنشئ وصفًا تفصيليًا لوحش خيالي فريد.',
                'prompt_text' => 'صف مخلوقًا يعيش في السحب، مصنوعًا من ضوء الشمس المتصلب، ويفترس الظلال. قم بتضمين تفاصيل حول مظهره وعاداته وأصواته.',
            ]
        );
        
        // --- Create Prompts for Category 3: Business Ideas ---
         $this->createBilingualPrompt(
            $cat3,
            'prompts/05.webp',
            ['logo'],
            ['شعار'],
            [
                'lang' => 'en',
                'title' => 'Sustainable Packaging Startup',
                'subtitle' => 'Brainstorm names and a mission statement.',
                'prompt_text' => 'Generate 5 unique names and a mission statement for a startup that creates 100% compostable packaging from agricultural waste. The brand should sound modern, eco-friendly, and reliable.',
            ],
            [
                'lang' => 'ar',
                'title' => 'شركة ناشئة للتغليف المستدام',
                'subtitle' => 'تبادل الأفكار للأسماء وبيان المهمة.',
                'prompt_text' => 'أنشئ 5 أسماء فريدة وبيان مهمة لشركة ناشئة تصنع عبوات قابلة للتحلل بنسبة 100٪ من النفايات الزراعية. يجب أن تبدو العلامة التجارية حديثة وصديقة للبيئة وموثوقة.',
            ]
        );
         $this->createBilingualPrompt(
            $cat3,
            'prompts/06.webp',
            [],
            [],
            [
                'lang' => 'en',
                'title' => 'AI-Powered Personal Finance App',
                'subtitle' => 'Outline the key features for the MVP.',
                'prompt_text' => 'Outline the key features for a Minimum Viable Product (MVP) of an AI-powered personal finance app that helps users automate saving, investing, and bill payments based on their spending habits.',
            ],
            [
                'lang' => 'ar',
                'title' => 'تطبيق مالي شخصي مدعوم بالذكاء الاصطناعي',
                'subtitle' => 'حدد الميزات الرئيسية للـ MVP.',
                'prompt_text' => 'حدد الميزات الرئيسية لمنتج قابل للتطبيق (MVP) لتطبيق مالي شخصي مدعوم بالذكاء الاصطناعي يساعد المستخدمين على أتمتة الادخار والاستثمار ودفع الفواتير بناءً على عادات الإنفاق الخاصة بهم.',
            ]
        );
    }

    private function createBilingualPrompt(Category $category, string $imagePath, array $enTagNames, array $arTagNames, array $enData, array $arData): void
    {
        $prompt = Prompt::factory()->create([
            'category_id' => $category->id,
            'cover_image_path' => $imagePath,
        ]);

        PromptTranslation::factory()->create(['prompt_id' => $prompt->id] + $enData);
        PromptTranslation::factory()->create(['prompt_id' => $prompt->id] + $arData);

        $enTags = Tag::whereIn('name', $enTagNames)->where('lang', 'en')->get();
        $arTags = Tag::whereIn('name', $arTagNames)->where('lang', 'ar')->get();
        $prompt->tags()->attach($enTags->pluck('id'));
        $prompt->tags()->attach($arTags->pluck('id'));
    }

    private function prepareDummyImages(): void
    {
        // Ensure the target directory exists and is clean
        Storage::disk('public')->deleteDirectory('prompts');
        Storage::disk('public')->makeDirectory('prompts');

        // Create 6 simple placeholder images
        for ($i = 1; $i <= 6; $i++) {
            $fileName = "0{$i}.webp";
            $path = storage_path("app/public/prompts/{$fileName}");

            // Create a simple colored image using GD
            $image = imagecreatetruecolor(600, 400);
            $backgroundColor = imagecolorallocate($image, rand(100, 255), rand(100, 255), rand(100, 255));
            $textColor = imagecolorallocate($image, 0, 0, 0);
            imagefill($image, 0, 0, $backgroundColor);
            imagettftext(
            $image, 40, 0, 150, 200, $textColor,
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            "Image {$i}"
        );
            imagewebp($image, $path);
            imagedestroy($image);
        }
    }
}