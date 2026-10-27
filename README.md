# Trayce

Prototipe PWA mobile untuk pencatatan, validasi, analitik, pelaporan, dan pengaliran sisa pangan dapur SPPG. Seluruh alur memakai data demo bersama di perangkat; tidak ada backend atau login.

## Jalankan

Memerlukan Node.js 22.18+ (disarankan Node.js 24).

```sh
npm ci
npm run dev
```

Buka URL yang ditampilkan Vite. Untuk versi PWA produksi:

```sh
npm test
npm run build
node --test tests/pwa.test.mjs
npm run preview
```

Service worker hanya aktif pada build produksi dan membutuhkan HTTPS atau localhost. Setelah satu kunjungan online, app shell, font, ikon, dan ilustrasi demo dicache. Navigasi memakai hash sehingga tidak memerlukan rewrite server.

## Berkas utama

- `src/App.tsx`: kerangka ponsel, hash routing, pemilih menu, navigasi berbasis peran.
- `src/Onboarding.tsx`: tiga slide, persetujuan, pemilih peran, ilustrasi SVG orisinal.
- `src/Record.tsx`: alur catat empat langkah, keypad, riwayat, validasi, penolakan, koreksi.
- `src/Home.tsx`: beranda relawan dan dasbor kepala SPPG.
- `src/Insights.tsx`: analitik, ambang usulan, jumlah porsi, laporan, CSV, cetak, WhatsApp, snapshot terkunci.
- `src/Routing.tsx`: jadwal, QR, simulasi pindai, serah terima mitra.
- `src/domain.ts`: tipe data, seed 14 hari, rumus agregasi, koreksi, validasi, CSV.
- `src/store.tsx`, `src/context.ts`: satu state bersama, localStorage, fallback memori, simulasi sinkronisasi.
- `src/ui.tsx`, `src/styles.css`: komponen aksesibel dan sistem visual responsif.
- `public/logo.png`: logo asli dari lampiran pengguna. `public/favicon.png`, `public/icon-192.png`, `public/icon-512.png`, dan `public/icon-maskable-512.png`: ikon browser dan instalasi yang diturunkan dari logo asli.
- `public/manifest.webmanifest`: metadata instalasi PWA.
- `scripts/build-sw.mjs`: membuat `dist/sw.js` dengan cache app shell versi hash.
- `tests/domain.test.ts`, `tests/pwa.test.mjs`: pengujian rumus, transisi data, dan cache app shell.

## Skenario demo

1. Selesaikan onboarding, centang persetujuan, pilih Relawan Dapur.
2. Buka menu header, aktifkan Mode offline (demo).
3. Catat sisa: pilih menu, kategori, berat; ambil foto atau gunakan foto contoh berlabel demo. Simpan.
4. Riwayat menampilkan Menunggu sinkron. Matikan mode offline; setelah simulasi sinkronisasi, status menjadi Menunggu validasi.
5. Ganti peran ke Kepala SPPG. Buka validasi, setujui catatan; total valid di analitik dan laporan bertambah.
6. Buka Pengaliran, buat jadwal. Sisa piring dinonaktifkan. Tidak disajikan mewajibkan konfirmasi SOP. QR muncul setelah jadwal disimpan.
7. Ganti peran ke Mitra Offtake, Pindai QR → Simulasikan pindai; jadwal terdekat yang belum selesai dipilih. Isi berat ambil dan foto, lalu konfirmasi.
8. Kembali ke kepala: pengambilan tampil di Pengaliran serta ringkasan laporan bulan penyelesaian. Berat ini terpisah dari total sisa agar tidak dihitung dua kali.
9. Unduh Excel menghasilkan CSV UTF-8 dengan BOM; Unduh PDF membuka dialog cetak. Bagikan ke WhatsApp membuka ringkasan tanpa mengirim otomatis.
10. Kunci laporan menyimpan snapshot data dan versi templat; perubahan berikutnya tidak mengubah snapshot.

## Aturan perhitungan

- Beranda: entri hari ini selain ditolak; koreksi belum valid tidak dihitung sebagai sisa tambahan.
- Analitik dan total kategori/menu laporan: hanya entri valid yang masih efektif.
- Entri valid selalu dipertahankan. Koreksi membuat entri baru dengan alasan; setelah disetujui, berat koreksi menggantikan berat asal dalam perhitungan.
- Status validasi menghitung seluruh entri audit, termasuk entri asal yang mempunyai koreksi.
- g/porsi = total kg menu × 1.000 / (porsi harian × jumlah hari tercatat menu dalam filter). Satu hari dihitung sekali, berapa pun jumlah entri/kategorinya.
- Ambang usulan default 8 g/porsi; usulan muncul bila terlampaui pada sekurangnya tiga tanggal berbeda dalam periode/filter. Ambang dan porsi dapat diubah.
- “Minggu ini” diasumsikan tujuh hari berjalan, “Bulan ini” dari awal bulan sampai hari ini. Grafik selalu menunjukkan tujuh hari terakhir; kategori mengikuti filter.
- Pengambilan selesai menggunakan berat aktual, bukan estimasi, dan masuk bulan waktu penyelesaian perangkat.
- Sinkronisasi adalah perubahan status lokal; tidak mengirim data ke server.

## Asumsi dan batas prototipe

- SPPG Contoh 01, 2.900 porsi setiap hari untuk setiap menu; porsi adalah asumsi yang bisa diubah.
- Seed dibuat relatif terhadap tanggal perangkat pada pemakaian pertama: 14 hari, 5 menu × 3 kategori, tepat 3 entri menunggu validasi, 3 mitra, dan 2 jadwal (1 selesai).
- Identitas visual menggunakan logo asli yang dilampirkan pengguna, dengan biru `#3D47FD` dan limau `#C6FC41`. Ikon maskable memakai ruang aman tambahan agar lambang tidak terpotong saat instalasi.
- CSS responsif biasa digunakan sebagai padanan Tailwind; React, TypeScript, Vite, SVG chart, Lucide, dan `qrcode` digunakan. Plus Jakarta Sans disertakan lokal agar tersedia offline.
- Foto seed adalah ilustrasi berlabel demo. Foto kamera dikompresi ke JPEG dan diberi cap waktu perangkat; cap waktu bukan bukti forensik.
- Input kamera memakai `accept="image/*" capture="environment"`. Browser/OS menentukan pengalaman kamera; web tidak dapat menjamin pemilih galeri selalu dilarang. Tombol foto contoh disediakan terpisah untuk demonstrasi desktop.
- Pemindaian QR disimulasikan; QR tetap nyata dan berisi pengenal jadwal. Tidak ada pemindaian kamera nyata atau sinkronisasi lintas perangkat.
- localStorage memiliki kuota. Jika tidak tersedia/penuh, aplikasi menampilkan pemberitahuan dan tetap berjalan di memori sampai tab ditutup.
- Format laporan adalah templat demo, bukan format resmi atau jaminan penerimaan BGN. Laporan terkunci tidak memiliki fitur buka kunci pada prototipe.
- PDF lewat dialog cetak; Excel lewat CSV, bukan XLSX. WhatsApp memerlukan koneksi. Pengiriman pesan dilakukan sendiri oleh pengguna.
- Belum mencakup autentikasi, otorisasi server, database, push notification, log audit server, penyesuaian porsi per tanggal, atau aplikasi native.

## Pembaruan foto dan UI

- Lima foto menu realistis, tiga ilustrasi 3D peran dengan palet yang seragam, dan tiga foto kategori sisa tersedia di `public/images/`.
- Gambar dibuat dengan Imagegen bawaan. Prompt lengkap dicatat di `docs/image-prompts.md`; seluruhnya adalah ilustrasi demo.
- Kartu peran, menu, dan kategori disusun ulang dengan gambar lebih besar dan jarak yang konsisten.
- Foto demo lama ditampilkan memakai foto menu yang sesuai tanpa mengubah data tersimpan. Foto pengguna tetap dipakai; jika gagal dimuat, penggantinya diberi label “Foto tidak tersedia · demo”.
- 11 pengujian unit dan 1 pengujian PWA lulus. Pemeriksaan browser mencakup foto nasi pada validasi, semua foto menu, ikon peran, dan tiga gambar kategori.
- Aset WebP disertakan dalam cache PWA agar tersedia offline setelah app shell tersimpan.

## Verifikasi pembaruan logo dan warna

- Build produksi berhasil; 8 uji domain dan 1 uji cache PWA lulus.
- Onboarding, pilihan peran, dan dashboard Kepala SPPG diperiksa di browser.
- Logo asli disimpan tanpa perubahan; ukuran favicon dan ikon instalasi diverifikasi.
- Folder `dist/` berisi build produksi siap hosting statis.
- Publikasi situs belum diperbarui karena ID situs pada `.openai/hosting.json` tidak ditemukan.
- Gambar `docs/trayce-preview.jpg` adalah dokumentasi tampilan sebelum pembaruan ini.

## Verifikasi versi sebelumnya

- Build TypeScript + Vite berhasil.
- Uji service worker memverifikasi seluruh aset cache tersedia, penghapusan cache versi lama, dan fallback navigasi offline.
- Pengujian unit mencakup seed, validasi idempoten, penggantian koreksi tanpa hitung ganda, pengecualian validasi massal, rumus g/porsi dan ambang tiga hari, persyaratan bukti/berat pengambilan, CSV, serta snapshot laporan.
- Uji browser: onboarding, mode offline → catat 1,5 kg → sinkron → validasi → analitik/laporan; buat jadwal Tidak disajikan dengan persetujuan; QR → mitra mengambil 11,5 kg → ringkasan 29,1 kg (17,6 seed + 11,5 baru); muat ulang mempertahankan hasil; penguncian dan unduhan CSV berhasil.
- CSV hasil browser cocok dengan tampilan: total valid 1.002,4 kg, pengambilan 29,1 kg. Nilai tersebut hasil sesi uji, bukan angka hardcoded di UI.
- Tidak ditemukan galat konsol aplikasi pada pemeriksaan ulang setelah muat bersih. Identitas context dipisahkan agar pembaruan kode saat pengembangan tidak memutus provider. Log ekstensi browser dipisahkan dari aplikasi.
- Kamera perangkat fisik, dialog cetak sistem, dan instalasi PWA lintas OS memerlukan uji perangkat nyata. Cache app shell dibuat otomatis pada build.

Trayce tidak menggantikan pengawasan BGN.
