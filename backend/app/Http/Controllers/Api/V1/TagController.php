<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\TagResource;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index(Request $request)
    {
        $query = Tag::query();

        if ($request->has('q')) {
            $query->where('name', 'like', '%' . $request->input('q') . '%');
        }

        if ($request->has('lang')) {
            $query->where('lang', $request->input('lang'));
        }
        
        $perPage = (int) $request->input('per_page', 20);

        return TagResource::collection($query->paginate(min($perPage, 50)));
    }
}