<?php

namespace App\Models\Concerns;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToUser
{
    protected static function booted(): void
    {

        static::creating(function (self $model) :void{
            $model->user_id = auth()->user()->id;
        });
    }
}
