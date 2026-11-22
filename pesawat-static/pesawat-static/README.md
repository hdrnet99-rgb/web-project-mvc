# AeroHistory (versi statis: HTML + CSS + JavaScript)

Tidak butuh PHP, MySQL, XAMPP, atau Laragon.

## Cara menjalankan di VS Code
1. Buka folder ini di VS Code (File > Open Folder).
2. Pasang ekstensi **Live Server** (Ritwick Dey).
3. Klik kanan `index.html` > **Open with Live Server**.

(Bisa juga langsung klik dua kali `index.html`; pencarian tetap berfungsi.)

## Struktur
```
pesawat-static/
├── index.html
├── css/style.css
├── js/
│   ├── data.js      <- data 30 pesawat (dari pesawat.sql)
│   └── script.js    <- render kartu, pencarian, slider
└── assets/
    ├── images/      <- foto pesawat + habibi.jpg
    └── videos/      <- b2-spirit-bomber.mp4
```

## Menambah / mengubah pesawat
Edit `js/data.js`, tambahkan objek baru di array `PESAWAT`
(isi `gambar` dengan nama file di `assets/images/`).

## Catatan
- Video hero (atas) dan font Google Fonts masih memakai CDN, jadi butuh internet.
