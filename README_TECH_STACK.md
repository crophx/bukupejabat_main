# Tech Stack Project Buku Pejabat

Dokumen ini menjelaskan secara detail mengenai teknologi, *framework*, *library*, dan *tools* yang digunakan dalam pengembangan aplikasi web **Buku Pejabat**. Arsitektur aplikasi ini menggunakan pendekatan **API-driven Single Page Application (SPA)**, di mana backend berjalan sebagai API server menggunakan Laravel, dan frontend dibangun menggunakan React yang di-serve oleh Laravel via integrasi Vite.

---

## 1. Backend (Server-side & API)
Backend dari aplikasi ini dibangun menggunakan bahasa pemrograman **PHP** dengan framework **Laravel**. Backend bertugas untuk mengelola logika bisnis, koneksi ke database, dan menyediakan RESTful API untuk frontend.

- **PHP**: Versi `^8.2` (Versi minimum yang dibutuhkan Laravel 12).
- **Laravel Framework**: Versi `^12.0` - Framework utama untuk mengatur routing API, logika server, ORM database, dan layanan (services) backend lainnya.
- **Laravel Sanctum**: Versi `^4.0` - Digunakan untuk sistem autentikasi (berbasis token) yang ringan untuk SPA atau API.
- **Eloquent ORM**: Fitur bawaan Laravel yang digunakan untuk berinteraksi dengan database secara mudah menggunakan pendekatan Object-Relational Mapping (berbasis kelas model).
- **Database**: Secara fungsional didukung oleh relasional database modern (seperti MySQL, PostgreSQL, atau SQLite) bergantung pada konfigurasi `.env`.

### Tools Pengembangan Backend:
- **Pest / PHPUnit** (`^11.5.3`): Framework untuk *automated testing* pada aplikasi PHP.
- **Laravel Pint** (`^1.24`): *Opinionated PHP code style fixer* (berbasis PHP-CS-Fixer) untuk menjaga kerapian kode dan memastikan standar penulisan kode PHP tetap konsisten.
- **Laravel Sail** (`^1.41`): *Command-line interface* ringan untuk menjalankan environment development Laravel secara terisolasi menggunakan Docker.
- **Laravel Tinker** (`^2.10.1`): REPL (Read-Eval-Print Loop) yang memungkinkan developer berinteraksi langsung dengan aplikasi Laravel melalui command line.

---

## 2. Frontend (Client-side & UI)
Frontend aplikasi ini adalah antarmuka interaktif yang berjalan di browser pengguna. Dibangun secara modular berbasis komponen menggunakan ekosistem **React**.

- **React & React DOM**: Versi `^19.2.0` - Library JavaScript modern dari Meta (Facebook) untuk membangun antarmuka pengguna berbasis komponen yang reaktif.
- **Vite**: Versi `^7.2.4` - *Build tool* dan *development server* super cepat yang secara instan merespons perubahan kode (*Hot Module Replacement*). Diintegrasikan ke aplikasi ini dengan `laravel-vite-plugin` (`^2.0.1`).
- **React Router DOM**: Versi `^6.30.2` - Library standar untuk menangani *routing* secara klien (Single Page Application), memungkinkan pergantian halaman yang mulus tanpa memuat ulang halaman (reload).

### Styling & Desain UI:
- **Tailwind CSS**: Versi `^4.1.18` - Framework CSS dengan paradigma *utility-first* yang memungkinkan penyusunan desain secara fleksibel dan cepat langsung di dalam kode komponen (JSX).
- **DaisyUI**: Versi `^5.5.14` - Plugin dan koleksi komponen UI untuk Tailwind CSS yang menyediakan blok-blok UI siap pakai (seperti tabel, tombol, modal, dropdown) dengan desain bersih dan modern.
- **Headless UI (`@headlessui/react`)**: Versi `^2.2.9` - Library komponen fungsional yang *unstyled* (tanpa gaya bawaan). Digunakan khusus untuk interaksi yang kompleks dan *accessible* seperti *Dropdown*, *Dialog/Modal*, dan *Transition*.
- **Heroicons (`@heroicons/react`)**: Versi `^2.2.0` - Pustaka ikon resmi dari pembuat Tailwind, digunakan sebagai visual ikon (berbasis SVG) di dalam aplikasi.

### Utilitas & Pengolahan Data Frontend:
- **Axios**: Versi `^1.13.3` - *HTTP client* berbasis Promise untuk melakukan koneksi dan pemanggilan API ke sisi backend Laravel.
- **SweetAlert2**: Versi `^11.26.24` - Library untuk membuat modal, pop-up peringatan, dan notifikasi konfirmasi yang elegan, interaktif, dan mudah dimodifikasi untuk memberikan umpan balik (feedback) pengguna.
- **jsPDF** (`^4.2.0`) & **jsPDF-AutoTable** (`^5.0.7`): Digunakan untuk melakukan kompilasi, *formatting*, dan mengunduh laporan PDF yang berisi data berbentuk tabel (seperti data Pejabat/Pegawai) secara instan langsung dari *browser*.
- **XLSX (SheetJS)**: Versi `^0.18.5` - Ekstensi untuk mengurai (parsing) serta mengekspor (export) daftar data aplikasi ke dalam format *spreadsheet* Excel (`.xlsx`).
- **React Pageflip**: Versi `^2.0.3` - Komponen khusus untuk merender buku elektronik atau penampil dokumen dengan efek animasi 3D "membalik halaman" secara realistis (flipbook view).

### Tools Pengembangan Frontend:
- **ESLint**: Versi `^9.39.1` - Program linter untuk JavaScript yang berfungsi menemukan kesalahan/bug potensial dan menegakkan aturan struktur kode.
- **PostCSS & Autoprefixer**: Memproses kode CSS sebelum di-_compile_ dan menambahkan awalan vendor (vendor prefixes) agar memastikan kompatibilitas tampilan lintas peramban (*cross-browser*).

---

## 3. Komunikasi & Arsitektur
- **REST API Middleware**: Integrasi frontend React dan backend Laravel dilakukan via titik akhir (endpoints) API di `routes/api.php` dan dilindungi oleh *middleware*.
- **Keamanan (CORS & CSRF)**: Konfigurasi perizinan akses sumber daya (Cross-Origin Resource Sharing) dan proteksi token (Cross-Site Request Forgery) dikelola secara ketat melalui sisi backend (Laravel middleware).