<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductSaveRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {

        $products = Product::with('category')->paginate(10);
        return Inertia::render('products/Products', compact('products'));
    }

    public function categorySavePage(Request $request): Response
    {

        $product = Product::find($request->id);
        $categories=Category::all();
        return Inertia::render('products/ProductSave', compact('product','categories'));
    }

    public function store(ProductSaveRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (isset($data['image']) && !empty($data['image'])) {

            $file = $request->file('image');

            $fileExt = $file->getClientOriginalExtension();

            $fileName = time() . '.' . $fileExt;

            $path = $file->storeAs('products', $fileName, 'public');

            $data['image'] = $path;
        }

        Product::create($data);

        return back()->with([
            'status' => true,
            'message' => 'Product created successfully'
        ]);
    }

    public function update(ProductSaveRequest $request, Product $product): RedirectResponse
    {

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $file = $request->file('image');
            $fileExt = $file->getClientOriginalExtension();
            $fileName = time() . '.' . $fileExt;
            $path = $file->storeAs('products', $fileName, 'public');
            $data['image'] = $path;
        }

        $product->update($data);
        return back()->with(['status' => true, 'message' => 'Product updated successfully']);
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
        return back()->with(['status' => true, 'message' => 'Product deleted successfully']);
    }
}
