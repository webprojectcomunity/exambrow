let VALID_TOKEN = "";
let FORM_LINK = "";
let DATA_LOADED = false;

let ujianBerjalan = false;
let batasPelanggaran = 3;

// ================= LOAD DATA =================
window.addEventListener("DOMContentLoaded", function () {

    fetch("https://script.google.com/macros/s/AKfycbygo9uVEhnY6M8QefD7HEQV57DWTZOE3ACPQhl6b80lvzxGuliQULaE5yKG_guqoDdyPQ/exec")
    .then(res => res.json())
    .then(data => {

        console.log("DATA:", data);

        VALID_TOKEN = (data.token || "").trim();
        FORM_LINK = data.formLink || "";

        // Set iframe
        if (FORM_LINK) {
            document.getElementById("gform-iframe").src = FORM_LINK;
        }

        // Set background
        if (data.background) {
            document.body.style.background = `url(${data.background}) no-repeat center center fixed`;
            document.body.style.backgroundSize = "cover";
        }

        DATA_LOADED = true;
    })
    .catch(err => {
        console.error("Gagal ambil data:", err);
        alert("Gagal mengambil data dari server!");
    });

});

// ================= LOGIN =================
function verifikasiToken() {

    if (!DATA_LOADED) {
        alert("Data belum siap, tunggu sebentar...");
        return;
    }

    const inputToken = document.getElementById("token-input").value.trim();

    if (inputToken === VALID_TOKEN) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('exam-popup').style.display = 'block';
        ujianBerjalan = true;
        masukFullscreen();
    } else {
        alert("Token salah!");
    }
}

// ================= FULLSCREEN =================
function masukFullscreen() {
    let elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}

// ================= ANTI CURANG =================
document.addEventListener("visibilitychange", function() {
    if (document.hidden && ujianBerjalan) {
        catatPelanggaran("Keluar dari halaman terdeteksi!");
    }
});

window.addEventListener("blur", function() {
    if (ujianBerjalan) {
        setTimeout(() => {
            if (document.activeElement !== document.getElementById("gform-iframe")) {
                catatPelanggaran("Pindah fokus layar terdeteksi!");
            }
        }, 300);
    }
});

document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement && ujianBerjalan) {
        catatPelanggaran("Keluar dari fullscreen!");
    }
});

// ================= PELANGGARAN =================
function catatPelanggaran(alasan) {
    batasPelanggaran--;

    if (batasPelanggaran > 0) {
        document.getElementById('modal-message').innerText = alasan;
        document.getElementById('modal-chance').innerText = batasPelanggaran;
        document.getElementById('custom-modal').style.display = 'flex';
    } else {
        portalTerkunci();
    }
}

function tutupModalPeringatan() {
    document.getElementById('custom-modal').style.display = 'none';
    masukFullscreen();
}

// ================= BLOKIR =================
function portalTerkunci() {
    ujianBerjalan = false;

    document.getElementById('exam-popup').innerHTML = '';
    document.getElementById('exam-popup').style.display = 'none';

    document.getElementById('login-container').innerHTML = `
        <h2 style="color:red">AKSES DIBLOKIR</h2>
        <p>Anda terdeteksi curang.</p>
    `;
}

// ================= BLOKIR KEY =================
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && ['c','v','u','s'].includes(e.key)) {
        e.preventDefault();
    }
    if (e.key === 'F12') e.preventDefault();
});
