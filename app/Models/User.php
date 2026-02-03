<?php

namespace App\Models;

// 1. TAMBAHKAN BARIS INI
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    // 2. TAMBAHKAN 'HasApiTokens' DI DALAM SINI
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'password',
        'email',
        'role',
        'unit_kerja_id', // Ini kunci agar admin terikat ke divisinya
        'sso',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // 3. Tambahkan Relasi ke Unit Kerja (Opsional tapi berguna nanti)
    public function unitKerja()
    {
        return $this->belongsTo(UnitKerja::class, 'unit_kerja_id');
    }
}