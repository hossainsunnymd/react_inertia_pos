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
            'category_id'=>'required|exists:categories,id',
            'name'=>'required|string|max:255',
            'description'=>'nullable|string|max:255',
            'price'=>'required|numeric',
            'qty'=>'required|integer',
            'image'=>$this->hasFile('image')? 'nullable|image|mimes:jpes,jpg,png,gif,svg|max:2048':'nullable|string|max:255'
        ];
    }
}
