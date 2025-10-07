<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PromptResource\Pages;
use App\Models\Prompt;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PromptResource extends Resource
{
    protected static ?string $model = Prompt::class;

    protected static ?string $navigationIcon = 'heroicon-o-light-bulb';
    
    protected static ?string $recordTitleAttribute = 'id'; // Placeholder, we use global search

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Core Information')
                    ->columns(2)
                    ->schema([
                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->required(),
                        Forms\Components\FileUpload::make('cover_image_path')
                            ->label('Cover Image')
                            ->directory('prompts')
                            ->image()
                            ->imageEditor(),
                        Forms\Components\TextInput::make('model')
                            ->required()
                            ->maxLength(255)
                            ->default('General'),
                        Forms\Components\Select::make('difficulty')
                            ->options([
                                'easy' => 'Easy',
                                'medium' => 'Medium',
                                'hard' => 'Hard',
                            ])
                            ->required()
                            ->default('medium'),
                        Forms\Components\Select::make('tags')
                            ->relationship('tags', 'name')
                            ->multiple()
                            ->preload()
                            ->columnSpanFull(),
                    ]),
                Forms\Components\Section::make('Translations')
                    ->schema([
                        Forms\Components\Repeater::make('translations')
                            ->relationship()
                            ->schema([
                                Forms\Components\Select::make('lang')
                                    ->options([
                                        'en' => 'English',
                                        'ar' => 'Arabic',
                                    ])
                                    ->required(),
                                Forms\Components\TextInput::make('title')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('subtitle')
                                    ->maxLength(255),
                                Forms\Components\Textarea::make('prompt_text')
                                    ->required()
                                    ->columnSpanFull(),
                            ])
                            ->columns(2)
                            ->defaultItems(2) // Start with empty fields for EN and AR
                            ->cloneable(false)
                            ->deletable(false)
                            ->reorderable(false)
                            ->grid(1),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image_path')->label('Cover'),
                Tables\Columns\TextColumn::make('category.name')
                    ->sortable(),
                // Display title from the English translation for easier management in the table
                Tables\Columns\TextColumn::make('translations.title')
                    ->label('Title (EN)')
                    ->getStateUsing(function (Prompt $record) {
                        return $record->translations->where('lang', 'en')->first()?->title ?? 'N/A';
                    })
                    ->searchable(query: function ($query, $search) {
                        $query->whereHas('translations', function ($q) use ($search) {
                            $q->where('title', 'like', "%{$search}%");
                        });
                    }),
                Tables\Columns\TextColumn::make('model')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('difficulty')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')->relationship('category', 'name'),
                Tables\Filters\SelectFilter::make('difficulty')->options([
                    'easy' => 'Easy',
                    'medium' => 'Medium',
                    'hard' => 'Hard',
                ]),
                Tables\Filters\SelectFilter::make('model')->options(Prompt::select('model')->distinct()->pluck('model', 'model')),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
    
    public static function getGloballySearchableAttributes(): array
    {
        return ['translations.title', 'translations.subtitle'];
    }


    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPrompts::route('/'),
            'create' => Pages\CreatePrompt::route('/create'),
            'edit' => Pages\EditPrompt::route('/{record}/edit'),
        ];
    }
}