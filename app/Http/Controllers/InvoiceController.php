<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceProduct;
use App\Models\Product;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {

        $invoices = Invoice::with('invoiceProduct.product', 'customer')->paginate(10);
        return Inertia::render('invoices/Invoices', compact('invoices'));
    }

    public function invoiceSavePage(Request $request): Response
    {

        return Inertia::render('invoices/InvoiceSave');
    }

    public function store(Request $request)
    {

        try {
            DB::transaction(function () use ($request) {

                $invoice = Invoice::create([
                    'customer_id' => $request->customer_id,
                    'vat' => $request->vat,
                    'total' => $request->total,
                    'discount' => $request->discount,
                    'payable' => $request->payable,
                ]);

                foreach ($request->invoiceItems as $item) {
                    InvoiceProduct::create([
                        'invoice_id' => $invoice->id,
                        'product_id' => $item['product_id'],
                        'qty' => $item['qty'],
                        'sale_price' => $item['qty'] * $item['sale_price'],

                    ]);

                    Product::find($item['product_id'])->decrement('qty',$item['qty']);
                }
            });

            return back()->with([
                'status' => true,
                'message' => 'Invoice created successfully'
            ]);

        } catch (Exception $e) {
            return back()->with([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
