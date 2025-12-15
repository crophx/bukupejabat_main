<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
    //
    use HasFactory;

    protected $table = 'pegawai';
    protected $guarded = 'id';

    public function unitKerja()
    {
        return $this->belongsTo(UnitKerja::class, 'unit_kerja_id');
    }

    public function jabatan()
    {
        $this->belongsTo(Jabatan::class, 'jabatan_id');
    }
}
