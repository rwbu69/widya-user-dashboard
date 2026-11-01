# User Dashboard

Aplikasi Single Page Application sederhana yang dibuat secara AI assisted untuk menampilkan daftar pengguna dari [JSONPlaceholder](https://jsonplaceholder.typicode.com/users). Dibuat sebagai take-home test Frontend Developer Intern (React.js). Seluruh komponen UI dibuat sendiri, tanpa template dashboard maupun library UI.

Dashboard menampilkan ringkasan jumlah pengguna, daftar pengguna dalam tabel, pencarian berdasarkan nama atau email, serta modal untuk melihat detail pengguna. Tampilan menggunakan gaya minimalis dengan warna netral, border tipis, dan layout yang responsive.

- **Demo:** [<Take Home Test User Dashboard>](https://widya-user-dashboard-eosin.vercel.app/)

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

Data di-fetch di custom hook `useUsers` (`src/hooks/useUsers.ts`) memakai `useEffect` dan service
`fetchUsers`.
Pemanggilan HTTP-nya sendiri ada di `src/services/userApi.ts` supaya hook tidak tahu detail URL
atau cara fetch. State dikelola dengan `useState`: daftar `users` dan satu `status`
(`'loading' | 'success' | 'error'`), sehingga tidak ada kombinasi state yang saling bertentangan.
Status respons juga dicek lewat `response.ok`, karena `fetch` tidak melempar error untuk status
404/500.

Error jaringan dan error HTTP mengubah status menjadi `'error'`, sehingga UI dapat menampilkan
pesan kegagalan dan tombol retry. `AbortError` tidak dianggap sebagai error karena request tersebut
dibatalkan secara sengaja.

**Mencegah infinite loop.** Dependency array effect hanya berisi `[attempt]`, yaitu sebuah angka
(primitif yang stabil). Tidak ada object, array, atau fungsi yang dibuat ulang tiap render di
dalamnya. Infinite loop biasanya muncul kalau effect memanggil `setState` sementara dependency-nya
berubah di setiap render, atau kalau dependency array dihilangkan. Di project ini effect hanya
jalan saat komponen pertama kali muncul dan ketika tombol "Coba lagi" menaikkan `attempt`.

**Mencegah request yang tidak terpakai.** Effect membuat `AbortController`, mengirim `signal`-nya
ke `fetch`, dan mengembalikan cleanup `() => controller.abort()`. Saat komponen unmount atau
effect akan dijalankan ulang, request lama dibatalkan. Dengan begitu response lama tidak bisa
menimpa state (race condition) dan koneksi tidak terbuang sia-sia. `AbortError` diabaikan karena
itu pembatalan yang disengaja, bukan kegagalan. Perlu dicatat, sejak React 18 warning "state
update on an unmounted component" sudah dihapus, jadi manfaat utama cleanup ini adalah
mencegah race condition dan pekerjaan sia-sia. Di mode development, `StrictMode` menjalankan
effect dua kali (mount, cleanup, mount) justru untuk memastikan cleanup-nya benar. Untuk aplikasi
yang lebih besar saya akan mempertimbangkan TanStack Query (caching, retry, dan de-duplikasi
request sudah tersedia).

### 2. Struktur Folder

Saya memisahkan kode berdasarkan **tanggung jawab**-nya:

- `services/`: satu-satunya tempat yang tahu URL dan cara memanggil API. Kalau endpoint berubah,
  cukup edit satu file.
- `hooks/`: logika stateful (fetching, loading, error) yang terpisah dari tampilan, sehingga
  `App` tetap ringkas dan hook mudah dipakai ulang atau dites.
- `components/`: komponen UI yang kecil dan fokus pada satu hal, menerima data lewat props.
  `UserSummary` menampilkan ringkasan, `UserTable` menampilkan data, `UserTableSkeleton`
  menangani loading, dan `UserErrorState` menangani error serta retry. `UserModal` menampilkan
  detail pengguna.
- `types/`: satu sumber kebenaran untuk bentuk data `User`, dipakai oleh service, hook, dan
  komponen.
- `utils/`: fungsi murni tanpa React yang gampang dites.

Ukuran project ini kecil, jadi pengelompokan per jenis file sudah cukup dan paling mudah dipahami.
Jika aplikasi tumbuh dengan banyak fitur (users, posts, dan seterusnya), saya akan beralih ke
struktur per fitur (`features/users/` berisi komponen, hook, dan service miliknya sendiri) agar
kode yang berubah bersama-sama tetap berdekatan.

### 3. Optimasi Kinerja (10.000 data)

Pertama saya cari tahu sumber lag-nya. Memfilter 10.000 string dengan `includes` itu murah
(beberapa milidetik). Yang mahal adalah **merender ribuan elemen DOM** setiap kali huruf diketik.
Pendekatannya berlapis:

1. **`useDeferredValue`** (sudah dipakai di `App.tsx`). Input memakai `query` yang selalu update
   instan, sedangkan daftar memakai `deferredQuery`. React merender daftar dengan prioritas
   rendah dan bisa menginterupsinya kalau ada ketikan baru, sehingga kolom pencarian tetap
   responsif. `useTransition` bisa dipakai untuk tujuan serupa.
2. **`useMemo`** untuk hasil filter dan **`memo`** pada `UserRow`, supaya filter tidak dihitung
   ulang dan baris yang tidak berubah tidak dirender ulang.
3. **Virtualisasi list** (misalnya `@tanstack/react-virtual` atau `react-window`). Hanya item
   yang terlihat di layar (sekitar 20 sampai 30) yang dirender, bukan 10.000. Ini solusi paling
   efektif untuk masalah DOM yang terlalu besar.
4. Jika masih kurang: **debounce** input untuk mengurangi frekuensi filter, **pagination** atau
   pencarian di sisi server, atau memindahkan filtering ke **Web Worker**.

Untuk 10 data seperti sekarang, optimasi ini belum perlu. Poin 1 sampai 2 saya terapkan karena
murah dan tidak menambah kompleksitas, sedangkan virtualisasi baru saya tambahkan kalau datanya
memang sebesar itu.