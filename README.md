# Buku Pejabat V2 - Technical Documentation

## 1. Overview
Buku Pejabat V2 is a modernized web application designed for comprehensive personnel and organizational unit management. Tailored for government or diplomatic use (indicated by modules like *Dalam Negeri*, *Luar Negeri*, and *Konsul Kehormatan*), it acts as a centralized directory and management system for employees (`Pegawai`) and their respective work units (`Unit Kerja`).

## 2. Technology Stack
The project uses a modern monolithic architecture with a decoupled React frontend and Laravel backend, connected via REST API.

### Backend (API)
- **Framework:** Laravel 12.0 (PHP 8.2+)
- **Authentication:** Laravel Sanctum (Token-based API auth)
- **Database ORM:** Eloquent ORM
- **Database Engine:** MySQL / PostgreSQL / SQLite (Configurable via `.env`)

### Frontend (SPA)
- **Library:** React 19.2 (using JSX)
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS v4, DaisyUI v5, Headless UI
- **Build Tool:** Vite v7
- **Utilities:** Axios (API Requests), SweetAlert2 (Notifications), jsPDF & XLSX (Export features)

## 3. System Architecture & Directory Structure
The application follows an API-driven SPA (Single Page Application) approach. `routes/web.php` acts as a catch-all to serve the React application, while `routes/api.php` handles all data transactions.

### Key Directories
- `app/Http/Controllers/Api/` - Contains REST API controllers (e.g., `PegawaiController`, `UnitKerjaController`).
- `app/Models/` - Eloquent ORM models defining database table structures and relationships.
- `database/migrations/` - Database schema versions and table creation scripts.
- `routes/api.php` - API endpoint definitions.
- `resources/js/src/` - The root of the React frontend application.
  - `components/` - Reusable UI components.
  - `pages/` - Main page views (e.g., `Dashboard`, `DataPegawai`, `LuarNegeri`).
  - `layouts/` - Page wrapper layouts (e.g., Sidebar, Navbar).
  - `utils/` - Helper functions and configuration.

## 4. Key Entities (Database Models)
1. **User:** Manages system access, authentication, and role-based permissions. Can be linked to a specific `UnitKerja` to restrict admin scope.
2. **Pegawai:** Represents an employee or official. Contains personal data and is linked to a `UnitKerja` and a `Jabatan`.
3. **UnitKerja:** Represents an organizational unit (e.g., Embassies, Consulates, internal directorates). Contains contact details, work hours, and timezone differences.
4. **Jabatan:** Represents the job titles or positions available.
5. **KonsulKehormatan & PejabatKonsul:** Specialized models for managing Honorary Consuls and their respective officials.
6. **ActivityLog:** An audit trail model that automatically tracks sensitive system actions (CRUD operations) performed by users.

## 5. Core Features
- **Authentication & Authorization:** Secure token-based login. Supports varying roles (e.g., Superadmin, Unit Admin).
- **Employee Directory (Pegawai):** Full CRUD operations for employee data, including advanced filtering and search capabilities.
- **Work Unit Management (Unit Kerja):** Categorized management of Domestic (*Dalam Negeri*) and Foreign (*Luar Negeri*) units, detailing location, work hours, and seasonal variations.
- **Data Synchronization & Cleansing:** API endpoints to sync master data from JSON sources and perform data cleansing.
- **Exporting & Reporting:** Frontend capabilities to export data to Excel (`xlsx`) and PDF (`jsPDF`) formats.
- **Audit Logging:** System-wide tracking of changes to ensure accountability.

## 6. Installation & Local Development Setup

### Prerequisites
- PHP ^8.2
- Composer
- Node.js & npm
- A local database server (e.g., MySQL via Laragon/XAMPP)

### Steps
1. **Clone the repository** (if applicable) or navigate to the project root.
2. **Install Backend Dependencies:**
   ```bash
   composer install
   ```
3. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```
4. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Generate application key: `php artisan key:generate`
   - Configure your database credentials in the `.env` file (`DB_DATABASE`, `DB_USERNAME`, etc.)
5. **Database Migration:**
   ```bash
   php artisan migrate
   ```
6. **Start the Development Servers:**
   You need to run both the frontend build process and the backend server simultaneously.
   - **Terminal 1 (Backend):**
     ```bash
     php artisan serve
     ```
   - **Terminal 2 (Frontend):**
     ```bash
     npm run dev
     ```
7. Open your browser and navigate to the address provided by `php artisan serve` (usually `http://localhost:8000`).

classDiagram
    class UnitKerja {
        +int id
        +string kode_unit_kerja
        +string nama_unit_kerja
        +string deskripsi
        +string alamat
        +string telepon
        +string email
        +pegawai() HasMany
        +users() HasMany
    }

    class User {
        +int id
        +string username
        +string email
        +string role
        +int unit_kerja_id
        +unitKerja() BelongsTo
        +isSuperAdmin() bool
        +getPermissions() array
    }

    class Pegawai {
        +int id
        +int unit_kerja_id
        +int jabatan_id
        +string nama
        +string nip
        +unitKerja() BelongsTo
        +jabatan() BelongsTo
    }

    class Jabatan {
        +int id
        +string nama_jabatan
        +pegawai() HasMany
    }

    class KonsulKehormatan {
        +int id
        +int unit_kerja_id
        +string negara
        +string kota
        +string email
        +pejabats() HasMany
    }

    class PejabatKonsul {
        +int id
        +int konsul_id
        +string nama
        +string gelar_jabatan
        +konsul() BelongsTo
    }

    class ActivityLog {
        +int id
        +int user_id
        +string activity
        +string description
        +user() BelongsTo
    }

    UnitKerja "1" -- "*" User : manages
    UnitKerja "1" -- "*" Pegawai : employs
    UnitKerja "1" -- "*" KonsulKehormatan : supervises
    Jabatan "1" -- "*" Pegawai : categorizes
    KonsulKehormatan "1" -- "*" PejabatKonsul : has
    User "1" -- "*" ActivityLog : performs


<!-- perubahan revisi 14/05/2026 → 15:00 -->
Edited DashboardAdmin.jsx

Saya sudah menyelesaikan semua instruksi yang Anda berikan. Berikut adalah ringkasan perubahan yang telah dilakukan:

1. **Modul Log Activity & Log Sync**:
   - Menambahkan input **Filter Tanggal (Start Date & End Date)** pada komponen `LogHistory.jsx` (Activity Log) dan `SyncData.jsx` (Log Sync).
   - Menambahkan tombol **Export (PDF)** yang menggunakan `jspdf` dan `jspdf-autotable` untuk mengunduh laporan aktivitas dan sinkronisasi berdasarkan filter rentang tanggal (serta pencarian) yang sedang aktif.

2. **Statistik Preview & Download (Public Tracking)**:
   - Membuat *Database Migration* dan model `PublicTracking` pada backend untuk menyimpan riwayat akses dari halaman publik.
   - Membuat `PublicTrackingController` dan menambahkan endpoint API baru untuk mencatat aktivitas secara publik (Preview dan Download). Endpoint statistik harian (7 hari terakhir) juga sudah dibuat.
   - Memperbarui `PagePublic.jsx` agar otomatis menembakkan *request tracking* ke backend setiap kali user membuka Flipbook, melakukan Preview PDF, atau Download PDF. Flipbook dan Preview PDF digabung ke tipe "Preview".
   - Mengubah `DashboardAdmin.jsx` di halaman Admin untuk menampilkan dua **Cards** baru (Public Previews & Public Downloads) serta grafik *AreaChart* yang dinamis menggunakan **Recharts** untuk melacak tren pengunjung harian.

3. **Kustomisasi Flipbook**:
   - Menyesuaikan *property* dimensi pada komponen `HTMLFlipBook` di dalam file `FlipbookViewer.jsx`. Ukuran kanvas kini jauh lebih besar (lebar `600px`, tinggi `850px` hingga maksimal `800x1100`) agar dokumen lebih mudah dan nyaman dibaca, serta tetap *responsive* dengan setelan `stretch`.

Semua fungsi di atas sudah terintegrasi dan bisa langsung Anda uji di aplikasi Anda! Beritahu saya apabila Anda perlu penyesuaian atau tambahan lainnya.
<!-- end -->

