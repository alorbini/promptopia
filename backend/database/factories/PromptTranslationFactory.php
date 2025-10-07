<?php

namespace Database\Factories;

use App\Models\Prompt;
use Illuminate\Database\Eloquent\Factories\Factory;

class PromptTranslationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'prompt_id' => Prompt::factory(),
            'lang' => 'en',
            'title' => $this->faker->unique()->sentence(4),
            'subtitle' => $this->faker->sentence(8),
            'prompt_text' => $this->faker->paragraph(5),
        ];
    }
}