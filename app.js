const GAS_URL = 'https://script.google.com/macros/s/AKfycbxU9GN2yQ0d-etzODIO8fy5NRx0H3WND-hXmtKoPsrtgm63FkDuP8iyp4_UO1BoKyZB0A/exec';

let currentUser = null;

/* ===============================
   API HELPER (MATCH doPost)
================================ */
function api(action, payload = {}) {
  return fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload })
  }).then(res => res.json());
}

/* ===============================
   AUTH
================================ */
function login() {
  api('login', {
    username: username.value,
    password: password.value
  }).then(res => {
    if (res.success) {
      currentUser = res;
      loginPage.classList.add('hidden');
      dashboardPage.classList.remove('hidden');
      loadDashboard();
    } else {
      loginMsg.innerText = res.message;
    }
  });
}

function logout() {
  currentUser = null;
  dashboardPage.classList.add('hidden');
  loginPage.classList.remove('hidden');
}

/* ===============================
   DASHBOARD
================================ */
function loadDashboard() {
  api('getDashboardStats').then(res => {
    if (!res.success) return;

    const d = res.data;
    dashboardStats.innerHTML = `
      <div class="card">👥 Santri: ${d.totalSantri}</div>
      <div class="card">📘 Progres: ${d.totalProgres}</div>
      <div class="card">📅 Absensi: ${d.totalAbsensi}</div>
      <div class="card">⚠️ Pelanggaran: ${d.totalPelanggaran}</div>
    `;
  });
}

/* ===============================
   SANTRI
================================ */
function loadSantri() {
  api('getSantriData').then(res => {
    if (!res.success) return;

    content.innerHTML = res.data.map(s => `
      <div class="card">
        <b>${s.nama}</b><br>
        Kelas: ${s.kelas}<br>
        Wali: ${s.wali}<br>
        HP: ${s.hp}
      </div>
    `).join('');
  });
}

/* ===============================
   ABSENSI
================================ */
function loadAbsensiHariIni() {
  api('getAbsensiHariIni').then(res => {
    if (!res.success) return;

    content.innerHTML = res.data.map(a => `
      <div class="card">
        <b>${a.namaSantri}</b><br>
        Kelas: ${a.kelas}<br>
        Status: ${a.status}
      </div>
    `).join('');
  });
}

/* ===============================
   PROGRES
================================ */
function loadProgres() {
  api('getProgresData', { filter: {} }).then(res => {
    if (!res.success) return;

    content.innerHTML = res.data.map(p => `
      <div class="card">
        <b>${p.namaSantri}</b><br>
        ${p.tipeHafalan}<br>
        ${p.surah || p.bait || ''}<br>
        ${new Date(p.tanggal).toLocaleDateString()}
      </div>
    `).join('');
  });
}

/* ===============================
   PELANGGARAN
================================ */
function loadPelanggaran() {
  api('getPelanggaranData', { filter: {} }).then(res => {
    if (!res.success) return;

    content.innerHTML = res.data.map(p => `
      <div class="card">
        <b>${p.namaSantri}</b><br>
        ${p.pelanggaran}<br>
        ${p.keterangan || ''}
      </div>
    `).join('');
  });
}
