<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicTracking extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'document_type'];
}
