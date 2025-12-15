<?php

namespace Database\Seeders;

use App\Models\Jabatan;
use App\Models\UnitKerja;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $unit1 = UnitKerja::create([
            'kode_unit_kerja' => 'UK-001',
            'nama_unit_kerja' => 'Biro Sumber Daya Manusia',
            'deskripsi' => 'Mengelola SDM KemLu',
        ]);

        $unit2 = UnitKerja::create([
            'kode_unit_kerja' => 'UK-002',
            'nama_unit_kerja' => 'Biro Sumber Daya Manusia',
            'deskripsi' => 'Mengelola SDM KemLu',
        ]);

        // jabatan
        $jab1 = Jabatan::create([
            'kode_jabatan' => '0001',
            'nama_jabatan' => 'Kepala Biro',
        ]);

        $jab2 = Jabatan::create([
            'kode_jabatan' => '00002',
            'nama_jabatan' => 'Kepala Bagian Informasi dan Perencanaa Pengembangan',
        ]);

        $jab3 = Jabatan::create([
            'kode_jabatan' => 'JAB-03',
            'nama_jabatan' => 'Kepala Subbagian Sistem Informasi',
        ]);

        // user
        User::create([
            'username' => 'superadmin',
            'password' => bcrypt('password123'), // Passwordnya: password123
            'role' => 'superadmin',
            'unit_kerja_id' => null, // Superadmin bebas unit
        ]);

        User::create([
            'username' => 'admin_disdik',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'unit_kerja_id' => $unit1->id,
        ]);
    }
}