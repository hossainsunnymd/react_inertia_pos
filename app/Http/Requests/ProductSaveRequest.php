<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProductSaveRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id'=>'required|number|exists:categories,id',
            'name'=>'required|string|max:255',
            'description'=>'nullable|string|max:255',
            'price'=>'required|number',
            'qty'=>'required|integer',
            'image'=>'nullable|string'
        ];
    }
}
