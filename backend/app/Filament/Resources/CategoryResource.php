<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;
    protected static ?string $navigationIcon = 'heroicon-o-tag';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make()->schema([
                Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
                Forms\Components\TextInput::make('icon')->maxLength(255)->helperText('You can use an emoji here.'),
            ])->columns(2),
            
            // THE FIX: Replaced single name field with a Repeater for translations
            Forms\Components\Section::make('Translations')->schema([
                Forms\Components\Repeater::make('translations')
                    ->relationship()
                    ->schema([
                        Forms\Components\Select::make('lang')->options(['en' => 'English', 'ar' => 'Arabic'])->required(),
                        Forms\Components\TextInput::make('name')->required(),
                    ])
                    ->defaultItems(2)
                    ->cloneable(false)
                    ->deletable(false)
                    ->reorderable(false)
                    ->columns(2),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            // THE FIX: Get the name from the English translation for the admin table
            Tables\Columns\TextColumn::make('translations.name')
                ->label('Name (EN)')
                ->getStateUsing(function (Category $record) {
                    return $record->translations->where('lang', 'en')->first()?->name ?? 'N/A';
                })
                ->searchable(query: function ($query, $search) {
                    $query->whereHas('translations', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
                }),
            Tables\Columns\TextColumn::make('slug'),
            Tables\Columns\TextColumn::make('icon'),
        ])->actions([
            Tables\Actions\EditAction::make(),
        ])->bulkActions([
            Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()]),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
