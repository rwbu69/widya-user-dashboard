# User Dashboard

Aplikasi Single Page Application sederhana yang dibuat secara AI assisted untuk menampilkan daftar pengguna dari [JSONPlaceholder](https://jsonplaceholder.typicode.com/users). Dibuat sebagai take-home test Frontend Developer Intern (React.js). Seluruh komponen UI dibuat sendiri, tanpa template dashboard maupun library UI.

Dashboard menampilkan ringkasan jumlah pengguna, daftar pengguna dalam tabel, pencarian berdasarkan nama atau email, serta modal untuk melihat detail pengguna. Tampilan menggunakan gaya minimalis dengan warna netral, border tipis, dan layout yang responsive.

- **Demo:** [Widya Dashboard FE Test](https://widya-user-dashboard-eosin.vercel.app)

## Menjalankan Secara Lokal

```bash
git clone <url-repo>
cd user-dashboard
npm install
npm run dev
```

Perintah lain: `npm run build` (build produksi), `npm run preview` (coba hasil build),
`npm run lint`. Saat ini project belum memiliki automated test atau script `npm run test`.

## Struktur Folder

```text
src/
├── components/   # Komponen UI (UserErrorState, UserModal, UserSummary, UserTable, UserTableSkeleton)
├── hooks/        # Custom hook (useUsers: logika fetching data)
├── services/     # Pemanggilan API (userApi)
├── types/        # Definisi tipe TypeScript
├── utils/        # Fungsi pembantu murni (getInitials)
├── App.tsx       # Orkestrasi state pencarian, filter, modal, dan layout dashboard
└── main.tsx      # Entry point
```

### Perilaku UI

- **Loading:** menampilkan skeleton untuk ringkasan dan tabel dengan animasi pulse.
- **Error:** menampilkan pesan yang mudah dipahami dan tombol `Coba lagi`.
- **Empty result:** menampilkan pesan ketika tidak ada pengguna yang cocok dengan pencarian.
- **Detail pengguna:** klik nama pengguna untuk membuka modal berisi email, telepon, website,
  alamat, dan perusahaan.
- **Responsive:** kolom perusahaan disembunyikan pada layar kecil dan tabel dapat di-scroll
  secara horizontal jika diperlukan.

## Jawaban Pertanyaan Pemahaman

### 1. State Management & Lifecycle

- Data di-fetch di custom hook `useUsers` dengan `useEffect`. Request-nya ada di `services/userApi.ts`, jadi hook tidak perlu tahu URL atau detail `fetch`.
- State-nya cuma `users` dan satu `status` (`'loading' | 'success' | 'error'`), sehingga tidak ada kombinasi yang saling bertentangan, misalnya loading dan error sekaligus.
- `fetch` tidak melempar error untuk status 404/500, makanya `response.ok` saya cek manual. Error jaringan dan error HTTP sama-sama mengubah status jadi `'error'`, lalu UI menampilkan pesan dan tombol "Coba lagi".
- Infinite loop tidak terjadi karena dependency array-nya hanya `[attempt]`, sebuah angka. Loop biasanya muncul kalau dependency-nya object atau fungsi yang dibuat ulang tiap render, atau array-nya tidak ditulis. Di sini effect jalan saat render pertama dan saat tombol retry menaikkan `attempt`.
- Request lama dibatalkan dengan `AbortController`: `signal` dikirim ke `fetch`, dan cleanup `controller.abort()` jalan saat komponen unmount atau sebelum effect dijalankan ulang. Dengan begitu response lama tidak bisa menimpa state dan koneksi tidak terbuang. `AbortError` tidak dianggap error karena pembatalannya memang disengaja.
- Sejak React 18, warning "update on an unmounted component" sudah dihapus, jadi manfaat utama cleanup ini adalah mencegah race condition.
- Untuk aplikasi yang lebih besar, saya akan pakai TanStack Query karena caching, retry, dan de-duplikasi request sudah tersedia.

### 2. Struktur Folder

- Kode saya pisah berdasarkan tanggung jawabnya:
  - `services/`: satu-satunya tempat yang tahu cara memanggil API. Kalau endpoint berubah, cukup edit satu file.
  - `hooks/`: logika fetching dan state, terpisah dari tampilan supaya `App` tetap ringkas.
  - `components/`: komponen UI kecil yang menerima data lewat props (`UserSummary`, `UserTable`, `UserTableSkeleton`, `UserErrorState`, `UserModal`).
  - `types/`: satu sumber untuk bentuk data `User`, dipakai service, hook, dan komponen.
  - `utils/`: fungsi murni tanpa React, mudah dites.
- Project ini kecil, jadi pengelompokan per jenis file sudah cukup dan paling mudah dibaca.
- Kalau fiturnya bertambah (users, posts, dan seterusnya), saya akan pindah ke struktur per fitur (`features/users/`), supaya kode yang berubah bersamaan letaknya berdekatan.

### 3. Optimasi Kinerja (10.000 data)

- Pertama saya pastikan dulu sumber lag-nya. Memfilter 10.000 string dengan `includes` hanya butuh beberapa milidetik. Yang berat adalah merender ribuan elemen DOM setiap kali satu huruf diketik.
- Langkah yang saya ambil, berurutan:
  - `useDeferredValue` (sudah dipakai di `App.tsx`): input memakai `query` yang selalu update instan, sedangkan daftar memakai `deferredQuery`. React merender daftar dengan prioritas rendah dan bisa menghentikannya kalau ada ketikan baru, jadi kolom pencarian tetap responsif.
  - `useMemo` untuk hasil filter dan `memo` pada `UserRow`, supaya filter tidak dihitung ulang dan baris yang tidak berubah tidak dirender ulang.
  - Virtualisasi list (`@tanstack/react-virtual` atau `react-window`): hanya sekitar 20 sampai 30 baris yang terlihat di layar yang dirender, bukan 10.000. Ini solusi paling efektif untuk masalah DOM.
  - Kalau masih kurang: debounce input, pagination atau pencarian di sisi server, atau memindahkan filtering ke Web Worker.
- Dengan 10 data seperti sekarang, saya baru menerapkan dua langkah pertama karena murah dan tidak menambah kompleksitas. Virtualisasi baru saya tambahkan kalau datanya memang sebesar itu.