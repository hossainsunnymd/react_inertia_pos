<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
#[Fillable([
    'customer_id',
    'total',
    'discount',
    'vat',
    'payable'
])]
class Invoice extends Model
{
    //
}
