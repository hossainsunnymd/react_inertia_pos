<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategorySaveRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {

        $categories = Category::paginate(10);
        return Inertia::render('categories/Categories', compact('categories'));
    }

    public function categorySavePage(Request $request): Response
    {

        $category = Category::find($request->id);
        return Inertia::render('categories/CategorySave', compact('category'));
    }

    public function store(CategorySaveRequest $request): RedirectResponse
    {

        Category::create($request->validated());
        return back()->with(['status' => true, 'message' => 'Category created successfully']);
    }

    public function update(CategorySaveRequest $request, Category $category): RedirectResponse
    {

        $category->update($request->validated());
        return back()->with(['status' => true, 'message' => 'Category updated successfully']);
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();
        return back()->with(['status' => true, 'message' => 'Category deleted successfully']);
    }

}
