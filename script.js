// ARRAY PENYIMPAN DATA
let daftarPeserta = [];

// DOM elements
const kodeInput = document.getElementById('kodePendaftaran');
const tempatTesSelect = document.getElementById('tempatTesSelect');
const gelombangSelect = document.getElementById('gelombang');
const bulanTesSelect = document.getElementById('bulanTes');
const namaInput = document.getElementById('namaPendaftar');
const radioLaki = document.querySelector('input[value="Laki-laki"]');
const radioPerempuan = document.querySelector('input[value="Perempuan"]');
const tempatLahirInput = document.getElementById('tempatLahir');
const tanggalLahirInput = document.getElementById('tanggalLahir');
const asalSekolahInput = document.getElementById('asalSekolah');
const pekerjaanOrtuInput = document.getElementById('pekerjaanOrtu');
const nilaiMatematika = document.getElementById('nilaiMatematika');
const nilaiInggris = document.getElementById('nilaiInggris');
const nilaiUmum = document.getElementById('nilaiUmum');
const simpanBtn = document.getElementById('simpanBtn');
const nextBtn = document.getElementById('nextBtn');
const jumlahDataDisplay = document.getElementById('jumlahDataDisplay');
const jumlahRecordSpan = document.getElementById('jumlahRecordSpan');
const tableBody = document.getElementById('tableBody');

// Elemen statistik
const statTotalEl = document.getElementById('statTotal');
const statLulusEl = document.getElementById('statLulus');
const statTidakLulusEl = document.getElementById('statTidakLulus');
const statCadanganEl = document.getElementById('statCadangan');

// ========== FUNGSI GENERATE KODE OTOMATIS ==========
function getNextNomorUrut(jalur, gelombang, bulan) {
    const filtered = daftarPeserta.filter(peserta => {
        const parts = peserta.kodePendaftaran.split('-');
        if (parts.length === 3) {
            const kodeJalur = parts[0].charAt(0);
            const kodeGelombang = parts[0].substring(1);
            const kodeBulan = parts[2];
            return kodeJalur === jalur && kodeGelombang === gelombang && kodeBulan === bulan;
        }
        return false;
    });
    
    if (filtered.length === 0) {
        return 1;
    }
    
    let maxUrut = 0;
    filtered.forEach(peserta => {
        const parts = peserta.kodePendaftaran.split('-');
        if (parts.length === 3) {
            const nomorUrut = parseInt(parts[1]);
            if (nomorUrut > maxUrut) {
                maxUrut = nomorUrut;
            }
        }
    });
    
    return maxUrut + 1;
}

function getJalurCode() {
    const selectedText = tempatTesSelect.value;
    if (selectedText === 'GEDUNG A') return 'A';
    if (selectedText === 'GEDUNG B') return 'B';
    if (selectedText === 'UNPAM VIKTOR') return 'V';
    return 'A';
}

function generateKodePendaftaran() {
    const jalurCode = getJalurCode();
    const gelombang = gelombangSelect.value;
    const bulan = bulanTesSelect.value;
    const nomorUrut = getNextNomorUrut(jalurCode, gelombang, bulan);
    const nomorUrutFormatted = nomorUrut.toString().padStart(2, '0');
    const kode = `${jalurCode}${gelombang}-${nomorUrutFormatted}-${bulan}`;
    return kode;
}

function updateKodePendaftaran() {
    if (kodeInput) {
        const kodeBaru = generateKodePendaftaran();
        kodeInput.value = kodeBaru;
    }
}

// ========== FUNGSI UTAMA ==========
function getSelectedGender() {
    if (radioLaki && radioLaki.checked) return 'Laki-laki';
    if (radioPerempuan && radioPerempuan.checked) return 'Perempuan';
    return '';
}

function validateForm() {
    let kode = kodeInput ? kodeInput.value.trim() : '';
    let nama = namaInput ? namaInput.value.trim() : '';
    let tempat = tempatLahirInput ? tempatLahirInput.value.trim() : '';
    let tgl = tanggalLahirInput ? tanggalLahirInput.value : '';
    let asal = asalSekolahInput ? asalSekolahInput.value.trim() : '';
    let jenisKelamin = getSelectedGender();
    let pekerjaan = pekerjaanOrtuInput ? pekerjaanOrtuInput.value.trim() : '';
    let tempatTes = tempatTesSelect ? tempatTesSelect.value : '';
    let mtk = nilaiMatematika ? parseFloat(nilaiMatematika.value) : NaN;
    let inggris = nilaiInggris ? parseFloat(nilaiInggris.value) : NaN;
    let umum = nilaiUmum ? parseFloat(nilaiUmum.value) : NaN;
    
    if (!kode) { alert("Kode Pendaftaran gagal digenerate!"); return false; }
    if (!nama) { alert("Nama Pendaftar wajib diisi!"); return false; }
    if (!tempat) { alert("Tempat Lahir wajib diisi!"); return false; }
    if (!tgl) { alert("Tanggal Lahir wajib dipilih!"); return false; }
    if (!jenisKelamin) { alert("Pilih Jenis Kelamin (Laki-laki / Perempuan)!"); return false; }
    if (!asal) { alert("Asal Sekolah wajib diisi!"); return false; }
    if (!pekerjaan) { alert("Pekerjaan Orang Tua wajib diisi!"); return false; }
    if (!tempatTes) { alert("Tempat Tes wajib dipilih!"); return false; }
    if (isNaN(mtk) || mtk < 0 || mtk > 100) { alert("Nilai Matematika harus angka 0-100"); return false; }
    if (isNaN(inggris) || inggris < 0 || inggris > 100) { alert("Nilai Bahasa Inggris harus angka 0-100"); return false; }
    if (isNaN(umum) || umum < 0 || umum > 100) { alert("Nilai Pengetahuan Umum harus angka 0-100"); return false; }
    
    const isDuplicate = daftarPeserta.some(peserta => peserta.kodePendaftaran === kode);
    if (isDuplicate) {
        alert(`Kode Pendaftaran "${kode}" sudah digunakan! Silakan ubah jalur/gelombang/bulan.`);
        return false;
    }
    return true;
}

// ========== KRITERIA BARU ==========
// Rata-rata >= 70 : LULUS
// Rata-rata 60 - 69.99 : CADANGAN
// Rata-rata < 60 : TIDAK LULUS
function hitungRataDanKeterangan(mat, ing, um) {
    let rata = (mat + ing + um) / 3;
    let rataFixed = rata.toFixed(2);
    let keterangan = "";
    
    if (rata >= 70) {
        keterangan = "LULUS";
    } else if (rata >= 60) {
        keterangan = "CADANGAN";
    } else {
        keterangan = "TIDAK LULUS";
    }
    
    return { rata: parseFloat(rataFixed), keterangan };
}

function hitungStatistik() {
    const total = daftarPeserta.length;
    const lulus = daftarPeserta.filter(peserta => peserta.keterangan === "LULUS").length;
    const cadangan = daftarPeserta.filter(peserta => peserta.keterangan === "CADANGAN").length;
    const tidakLulus = daftarPeserta.filter(peserta => peserta.keterangan === "TIDAK LULUS").length;
    return { total, lulus, cadangan, tidakLulus };
}

function updateStatistik() {
    const { total, lulus, cadangan, tidakLulus } = hitungStatistik();
    if (statTotalEl) statTotalEl.innerText = total;
    if (statLulusEl) statLulusEl.innerText = lulus;
    if (statTidakLulusEl) statTidakLulusEl.innerText = tidakLulus;
    if (statCadanganEl) statCadanganEl.innerText = cadangan;
}

function simpanData() {
    console.log("Tombol SIMPAN ditekan");
    if (!validateForm()) return;
    
    let kode = kodeInput.value.trim();
    let nama = namaInput.value.trim();
    let tempatLahir = tempatLahirInput.value.trim();
    let jenisKelamin = getSelectedGender();
    let tglLahir = tanggalLahirInput.value;
    let asalSekolah = asalSekolahInput.value.trim();
    let pekerjaanOrtu = pekerjaanOrtuInput.value.trim();
    let tempatTes = tempatTesSelect.value;
    let mtk = parseFloat(nilaiMatematika.value);
    let ing = parseFloat(nilaiInggris.value);
    let umum = parseFloat(nilaiUmum.value);
    
    const { rata, keterangan } = hitungRataDanKeterangan(mtk, ing, umum);
    
    const newPeserta = {
        kodePendaftaran: kode,
        namaPendaftar: nama,
        tempatLahir: tempatLahir,
        jenisKelamin: jenisKelamin,
        tanggalLahir: tglLahir,
        asalSekolah: asalSekolah,
        pekerjaanOrtu: pekerjaanOrtu,
        tempatTes: tempatTes,
        bahasaInggris: ing,
        matematika: mtk,
        pengetahuanUmum: umum,
        rataRata: rata,
        keterangan: keterangan
    };
    
    daftarPeserta.push(newPeserta);
    renderTabel();
    updateJumlahInfo();
    updateStatistik();
    updateKodePendaftaran();
    
    alert(`Data dengan kode ${kode} berhasil disimpan. Nilai rata-rata: ${rata} (${keterangan})`);
}

function resetForm() {
    if (namaInput) namaInput.value = '';
    if (radioLaki) radioLaki.checked = false;
    if (radioPerempuan) radioPerempuan.checked = false;
    if (tempatLahirInput) tempatLahirInput.value = '';
    if (tanggalLahirInput) tanggalLahirInput.value = '';
    if (asalSekolahInput) asalSekolahInput.value = '';
    if (pekerjaanOrtuInput) pekerjaanOrtuInput.value = '';
    if (nilaiMatematika) nilaiMatematika.value = '';
    if (nilaiInggris) nilaiInggris.value = '';
    if (nilaiUmum) nilaiUmum.value = '';
    
    if (tempatTesSelect) tempatTesSelect.value = 'GEDUNG A';
    if (gelombangSelect) gelombangSelect.value = '1';
    if (bulanTesSelect) bulanTesSelect.value = '1';
    
    updateKodePendaftaran();
    if (namaInput) namaInput.focus();
}

function hapusData(index) {
    if (confirm(`Yakin ingin menghapus data pendaftar ${daftarPeserta[index].namaPendaftar}?`)) {
        daftarPeserta.splice(index, 1);
        renderTabel();
        updateJumlahInfo();
        updateStatistik();
        updateKodePendaftaran();
    }
}

function updateJumlahInfo() {
    let total = daftarPeserta.length;
    if (jumlahDataDisplay) jumlahDataDisplay.value = total;
    if (jumlahRecordSpan) jumlahRecordSpan.innerText = `Total Pendaftar: ${total}`;
}

function renderTabel() {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    if (daftarPeserta.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="13" class="info-baris">Tidak ada data pendaftar. Silakan tambah data.</td></tr>';
        return;
    }
    
    daftarPeserta.forEach((peserta, idx) => {
        const row = tableBody.insertRow();
        let tglLahirFormatted = peserta.tanggalLahir ? peserta.tanggalLahir : '-';
        
        row.insertCell(0).innerText = peserta.kodePendaftaran;
        row.insertCell(1).innerText = peserta.namaPendaftar;
        row.insertCell(2).innerText = peserta.tempatLahir;
        row.insertCell(3).innerText = peserta.jenisKelamin;
        row.insertCell(4).innerText = tglLahirFormatted;
        row.insertCell(5).innerText = peserta.pekerjaanOrtu;
        row.insertCell(6).innerText = peserta.tempatTes;
        row.insertCell(7).innerText = peserta.bahasaInggris;
        row.insertCell(8).innerText = peserta.matematika;
        row.insertCell(9).innerText = peserta.pengetahuanUmum;
        row.insertCell(10).innerText = peserta.rataRata;
        
        const ketCell = row.insertCell(11);
        const badgeSpan = document.createElement('span');
        badgeSpan.innerText = peserta.keterangan;
        if (peserta.keterangan === "LULUS") {
            badgeSpan.className = "badge-lulus";
        } else if (peserta.keterangan === "CADANGAN") {
            badgeSpan.className = "badge-cadangan";
        } else {
            badgeSpan.className = "badge-gagal";
        }
        ketCell.appendChild(badgeSpan);
        
        const actionCell = row.insertCell(12);
        const delBtn = document.createElement('button');
        delBtn.innerText = '🗑 Hapus';
        delBtn.className = 'aksi-btn';
        delBtn.style.background = '#fff0f0';
        delBtn.style.padding = '5px 12px';
        delBtn.style.borderRadius = '30px';
        delBtn.style.cursor = 'pointer';
        delBtn.onclick = () => hapusData(idx);
        actionCell.appendChild(delBtn);
    });
}

function nextAction() {
    resetForm();
    alert("Form telah dibersihkan. Kode pendaftaran otomatis diperbarui.");
}

// ========== EVENT LISTENER ==========
if (simpanBtn) {
    simpanBtn.addEventListener('click', simpanData);
    console.log("Event listener SIMPAN terpasang");
}

if (nextBtn) {
    nextBtn.addEventListener('click', nextAction);
    console.log("Event listener NEXT terpasang");
}

if (tempatTesSelect) {
    tempatTesSelect.addEventListener('change', updateKodePendaftaran);
}

if (gelombangSelect) {
    gelombangSelect.addEventListener('change', updateKodePendaftaran);
}

if (bulanTesSelect) {
    bulanTesSelect.addEventListener('change', updateKodePendaftaran);
}

// ========== INISIALISASI ==========
renderTabel();
updateJumlahInfo();
updateStatistik();
updateKodePendaftaran();

console.log("Script berhasil dijalankan!");
console.log("Jumlah data awal:", daftarPeserta.length);
