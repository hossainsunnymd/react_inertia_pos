<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerSaveRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {

        $customers = Customer::paginate(10);
        return Inertia::render('customers/Customers', compact('customers'));
    }

    public function customerSavePage(Request $request): Response
    {

        $customer = Customer::find($request->id);
        return Inertia::render('customers/CustomerSave', compact('customer'));
    }

    public function store(CustomerSaveRequest $request): RedirectResponse
    {
        Customer::create($request->validated());
        return back()->with(['status' => true, 'message' => 'Customer created successfully']);
    }

    public function update(CustomerSaveRequest $request, Customer $customer): RedirectResponse
    {

        $customer->update($request->validated());
        return back()->with(['status' => true, 'message' => 'Customer updated successfully']);
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();
        return back()->with(['status' => true, 'message' => 'Customer deleted successfully']);
    }
}
