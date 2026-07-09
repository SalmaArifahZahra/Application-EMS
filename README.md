# Employee Management System (EMS)

Dokumentasi ini berisi panduan untuk menjalankan aplikasi, struktur folder, teknologi yang digunakan, serta penjelasan mengenai implementasi **Role Based Access Control (RBAC)** pada aplikasi Employee Management System.

---

## Cara Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan pengembangan.

### 1. Install Dependencies

Pastikan **Node.js** telah terpasang pada komputer, kemudian jalankan perintah berikut pada direktori utama proyek.

```bash
npm install
```

### 2. Menjalankan Development Server

Jalankan perintah berikut.

```bash
npm run dev
```

Secara default aplikasi akan berjalan pada:

```
http://localhost:3000
```

Apabila port **3000** sedang digunakan, Next.js akan otomatis menggunakan port lain, misalnya **3001**.

### 3. Menjalankan Unit Testing

Untuk menjalankan seluruh pengujian unit menggunakan **Jest**, gunakan perintah berikut.

```bash
npm run test
```

---

# Struktur Folder

Proyek ini menggunakan pendekatan **Feature-Sliced Design (FSD)** agar kode lebih terstruktur, mudah dipelihara, dan setiap fitur terpisah dengan jelas.

```
app/
components/
features/
lib/
public/
```

### app/

Berisi halaman aplikasi menggunakan **Next.js App Router**, termasuk layout, routing, dan proteksi halaman.

### components/

Berisi komponen UI yang dapat digunakan kembali (Reusable Components), seperti Button, Input, Card, Modal, Table, dan komponen umum lainnya.

### features/

Berisi seluruh fitur utama aplikasi yang dipisahkan berdasarkan domain, seperti:

- Authentication
- Employee
- Department
- Position
- User

Setiap fitur memiliki struktur sendiri yang terdiri dari:

- Components
- Services
- Hooks
- Types
- Validation
- Unit Test (`*.test.ts` atau `*.test.tsx`)

### lib/

Berisi konfigurasi dan utilitas yang digunakan secara global, seperti konfigurasi API Client.

### public/

Berisi aset statis seperti gambar, ikon, logo, dan file pendukung lainnya.

---

# Teknologi yang Digunakan

Aplikasi ini dikembangkan menggunakan teknologi berikut.

- **Next.js** – Framework React yang digunakan untuk membangun aplikasi dengan App Router.
- **React** – Library JavaScript untuk membangun antarmuka pengguna yang interaktif.
- **TypeScript** – Bahasa pemrograman yang digunakan untuk meningkatkan keamanan tipe data dan memudahkan pengembangan.
- **Tailwind CSS** – Framework CSS berbasis utility class untuk membangun antarmuka yang responsif dan konsisten.
- **React Hook Form** – Library untuk mengelola state dan proses validasi pada form.
- **Zod** – Library untuk melakukan validasi skema data pada form dan input pengguna.
- **Fetch API** – API bawaan browser yang digunakan untuk mengambil dan mengirim data ke endpoint MockAPI selama proses pengembangan.
- **Jest** – Framework yang digunakan untuk melakukan unit testing pada fungsi dan komponen aplikasi.
- **React Testing Library** – Library untuk menguji komponen React berdasarkan perilaku pengguna.

---

# Implementasi Role Based Access Control (RBAC)

Aplikasi menerapkan **Role Based Access Control (RBAC)** untuk membatasi hak akses berdasarkan peran pengguna.

Role yang tersedia terdiri dari:

- Super Admin
- HRD
- Employee

Implementasi RBAC dilakukan pada dua bagian utama.

## 1. Route Protection

Setiap halaman akan memeriksa status login dan role pengguna sebelum halaman ditampilkan.

Jika pengguna mencoba mengakses URL yang tidak sesuai dengan hak aksesnya, sistem akan menolak permintaan tersebut dan mengarahkan pengguna ke halaman yang diizinkan atau menampilkan halaman **403 Forbidden**.

Contoh:

- Super Admin dapat mengakses seluruh menu.
- HRD tidak dapat mengakses halaman **User Management**.
- Employee hanya dapat mengakses Dashboard dan Profil.

---

## 2. Component Authorization

Selain pada level halaman, pembatasan akses juga diterapkan pada setiap komponen.

Komponen akan dirender sesuai dengan role pengguna sehingga hanya fitur yang memiliki izin yang akan ditampilkan.

Contoh implementasi:

- Tombol **Delete Employee** hanya ditampilkan untuk **Super Admin**.
- HRD hanya dapat melihat tombol **View** dan **Edit**.
- Employee tidak dapat melihat tombol aksi maupun data karyawan lain.

Pendekatan ini memastikan pengguna hanya dapat melihat dan menggunakan fitur sesuai dengan hak akses yang dimiliki.

---

# Fitur Utama

- Authentication
- Dashboard
- Employee Management (CRUD)
- Department Management (CRUD)
- Position Management (CRUD)
- User Management
- Profile Management
- Role Based Access Control (RBAC)
- Form Validation menggunakan Zod
- Skeleton Loading
- Toast Notification
- Responsive Design
- Unit Testing