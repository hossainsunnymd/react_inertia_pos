<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UserSaveRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => $this->isMethod('PUT')?'required|string|email|max:255|unique:users,email,'.$this->route('user')->id:'required|string|email|max:255',
              'password' => $this->isMethod('POST')
            ? 'required|string|min:6|confirmed'
            : 'nullable|string|min:6|confirmed',
        ];
    }
}
