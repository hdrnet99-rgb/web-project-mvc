/* =========================================================
   AeroHistory - versi statis (tanpa PHP / MySQL)
   Data ada di js/data.js (variabel PESAWAT)
========================================================= */

const IMG_DIR = 'assets/images/';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=85';

// Escape HTML (pengganti htmlspecialchars di PHP)
function esc(v) {
    return String(v ?? '-')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function imgUrl(gambar) {
    const name = String(gambar || '').trim().split('/').pop();
    return name ? IMG_DIR + encodeURIComponent(name) : FALLBACK_IMG;
}

function imgTag(p) {
    return `<img src="${esc(imgUrl(p.gambar))}" alt="${esc(p.nama_model || 'Pesawat')}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">`;
}

function detailLink(p) {
    return `index.html?cari=${encodeURIComponent(p.nama_model || '')}#database`;
}

/* ---------- Data (setara query di model Pesawat.php) ---------- */
const semuaPesawat = [...PESAWAT].sort((a, b) => b.id - a.id);      // ORDER BY id DESC
const featured = semuaPesawat.slice(0, 6);                           // LIMIT 6

function cariPesawat(keyword) {
    const k = keyword.toLowerCase();
    return PESAWAT
        .filter(p => ['nama_model', 'produsen', 'jenis', 'negara_asal']
            .some(f => String(p[f] ?? '').toLowerCase().includes(k)))
        .sort((a, b) => a.nama_model.localeCompare(b.nama_model));   // ORDER BY nama_model ASC
}

/* ---------- Render: hasil pencarian ---------- */
function renderHasil(keyword, hasil) {
    const box = document.getElementById('hasil-pencarian');
    if (!keyword) { box.innerHTML = ''; return; }

    let isi;
    if (hasil.length) {
        isi = '<div class="aircraft-grid">' + hasil.map(p => `
        <article class="aircraft-card">
            <div class="aircraft-image">
                ${imgTag(p)}
                <span class="aircraft-type">${esc(p.jenis)}</span>
            </div>
            <div class="aircraft-content">
                <div class="manufacturer">${esc(p.produsen)}</div>
                <h3>${esc(p.nama_model)}</h3>
                <div class="description">
                    <h4>Tentang Pesawat</h4>
                    <p>${esc(p.deskripsi)}</p>
                </div>
                <h4 class="spec-heading">Spesifikasi</h4>
                <div class="spec-grid">
                    <div><small>Negara</small><strong>${esc(p.negara_asal)}</strong></div>
                    <div><small>Tahun</small><strong>${esc(p.tahun_penerbangan)}</strong></div>
                    <div><small>Kapasitas</small><strong>${esc(p.kapasitas)}</strong></div>
                    <div><small>Kecepatan</small><strong>${esc(p.kecepatan)}</strong></div>
                    <div><small>Jarak</small><strong>${esc(p.jarak_tempuh)}</strong></div>
                    <div class="engine"><small>Mesin</small><strong>${esc(p.mesin)}</strong></div>
                </div>
            </div>
        </article>`).join('') + '</div>';
    } else {
        isi = `
        <div class="article">
            <h3>✈️ Pesawat Tidak Ditemukan</h3>
            <p>Data dengan kata kunci tersebut belum tersedia di database.</p>
        </div>`;
    }

    box.innerHTML = `
    <section class="database" id="database">
        <div class="section-label">AIRCRAFT DATABASE</div>
        <h2>Hasil Pencarian</h2>
        <p class="result-text">Menampilkan hasil: <strong>"${esc(keyword)}"</strong></p>
        ${isi}
    </section>`;
}

/* ---------- Render: slider semua pesawat ---------- */
function renderSemua() {
    document.getElementById('aircraftCount').textContent = semuaPesawat.length + ' Pesawat';
    const slider = document.getElementById('aircraftSlider');

    if (!semuaPesawat.length) {
        slider.outerHTML = '<div class="article"><h3>Belum Ada Data Pesawat</h3><p>Database belum memiliki data pesawat.</p></div>';
        return;
    }

    slider.innerHTML = semuaPesawat.map(p => {
        const d = p.deskripsi || '';
        const pendek = d.slice(0, 110) + (d.length > 110 ? '...' : '');
        return `
        <article class="all-aircraft-card">
            <div class="all-aircraft-image">${imgTag(p)}</div>
            <div class="all-aircraft-content">
                <div class="manufacturer">${esc(p.produsen)}</div>
                <h3>${esc(p.nama_model)}</h3>
                <div><span class="all-aircraft-type">${esc(p.jenis)}</span></div>
                <p>${esc(pendek)}</p>
                <a class="detail-button" href="${detailLink(p)}">
                    <span>Lihat Detail</span>
                    <span class="arrow-icon">➔</span>
                </a>
            </div>
        </article>`;
    }).join('');
}

/* ---------- Render: model pesawat (featured) ---------- */
function renderFeatured() {
    document.getElementById('featuredGrid').innerHTML = featured.map(p => `
        <article class="mini-card">
            ${imgTag(p)}
            <div class="mini-card-content">
                <small>${esc(p.produsen)}</small>
                <h3>${esc(p.nama_model)}</h3>
                <a href="${detailLink(p)}">Lihat Detail →</a>
            </div>
        </article>`).join('');
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', function () {
    // Kata kunci dari URL: index.html?cari=Boeing
    const keyword = (new URLSearchParams(window.location.search).get('cari') || '').trim();
    const input = document.getElementById('searchInput');
    if (input) input.value = keyword;

    renderHasil(keyword, keyword ? cariPesawat(keyword) : []);
    renderSemua();
    renderFeatured();

    // Setelah hasil dirender, lompat ke bagian #database (jika ada)
    if (keyword && window.location.hash === '#database') {
        const el = document.getElementById('database');
        if (el) el.scrollIntoView();
    }

    // Navigasi slider kiri-kanan
    const slider = document.getElementById('aircraftSlider');
    const btnLeft = document.getElementById('slideLeft');
    const btnRight = document.getElementById('slideRight');
    if (slider && btnLeft && btnRight) {
        btnLeft.addEventListener('click', () => slider.scrollBy({ left: -360, behavior: 'smooth' }));
        btnRight.addEventListener('click', () => slider.scrollBy({ left: 360, behavior: 'smooth' }));
    }
});
