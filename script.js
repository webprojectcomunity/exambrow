const VALID_TOKEN = "UJIAN123";
let batasPelanggaran = 3;
let ujianBerjalan = false;

function verifikasiToken() {
    let inputToken = document.getElementById('token-input').value.trim();

    if (inputToken === VALID_TOKEN) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('exam-popup').style.display = 'block';
        ujianBerjalan = true;
        masukFullscreen();
    } else {
        alert("Token salah!");
    }
}

function masukFullscreen() {
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(()=>{});
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}

// ================== ANTI CURANG (UPGRADE) ==================

// A. Deteksi pindah tab / aplikasi
document.addEventListener("visibilitychange", () => {
    if (document.hidden && ujianBerjalan) {
        catatPelanggaran("Keluar dari halaman / buka aplikasi lain!");
    }
});

// B. Deteksi kehilangan fokus (klik address bar / menu)
window.addEventListener("blur", () => {
    if (ujianBerjalan) {
        setTimeout(() => {
            if (document.activeElement !== document.getElementById("gform-iframe")) {
                catatPelanggaran("Mencoba pindah fokus / buka tab!");
            }
        }, 300);
    }
});

// C. Keluar fullscreen
document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && ujianBerjalan) {
        catatPelanggaran("Keluar dari fullscreen!");
    }
});

document.addEventListener("webkitfullscreenchange", () => {
    if (!document.webkitFullscreenElement && ujianBerjalan) {
        catatPelanggaran("Keluar fullscreen (iOS)!");
    }
});

// ================== SISTEM PELANGGARAN ==================

function catatPelanggaran(alasan) {
    if (!ujianBerjalan) return;

    batasPelanggaran--;

    if (batasPelanggaran > 0) {
        document.getElementById('modal-message').innerText = alasan;
        document.getElementById('modal-chance').innerText = batasPelanggaran;
        document.getElementById('custom-modal').style.display = 'flex';
    } else {
        ujianBerjalan = false;
        document.getElementById('custom-modal').style.display = 'none';
        portalTerkunci();
    }
}

function tutupModalPeringatan() {
    document.getElementById('custom-modal').style.display = 'none';
    masukFullscreen();
}

function portalTerkunci() {
    document.getElementById('exam-popup').innerHTML = '';
    document.getElementById('exam-popup').style.display = 'none';

    document.getElementById('login-container').innerHTML = `
        <h2 style="color:red;">AKSES DIBLOKIR</h2>
        <p>Anda terdeteksi melakukan pelanggaran berulang.</p>
    `;
    document.getElementById('login-container').style.display = 'block';
}

// Blok shortcut
document.addEventListener("keydown", e => {
    if (e.ctrlKey && ['c','v','u','s'].includes(e.key)) e.preventDefault();
    if (e.key === "F12") e.preventDefault();
});

window.onbeforeunload = () => {
    if (ujianBerjalan) {
        return "Ujian sedang berlangsung!";
    }
};
