<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'invoice_id',
    'product_id',
    'qty',
    'sale_price',
])]
class InvoiceProduct extends Model
{
    //
}
