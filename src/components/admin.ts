import {
  getStudents, saveStudents,
  getAttendance, saveAttendance,
  getSchedule, saveSchedule, resetScheduleToInitial,
  getPiket, savePiket, resetPiketToInitial,
  getPiketTasks, savePiketTasks,
  getReadingLogs, saveReadingLogs,
  getCashTransactions, saveCashTransactions,
  getSavingsTransactions, saveSavingsTransactions,
  getScores, saveScores,
  getKKM, saveKKM,
  exportAllDataJSON, importAllDataJSON,
  getQuestions,
  getGameProgress, saveGameProgress,
  PiketScheduleFull
} from "../utils/storage";
import { Student } from "../data/students";
import { getCurrentDayName, WeekSchedule, ScheduleItem } from "../data/schedule";
import { setTeacherPassword } from "../utils/auth";
import { playClickSound } from "../utils/audio";

export function renderAdminDataSiswa(): string {
  const students = getStudents();
  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>👥</span> Kelola Data Siswa Kelas 4
          </h2>
          <p class="text-xs text-slate-500">Tahun Ajaran 2026/2027 • Urutan presensi resmi SDN Banyurip</p>
        </div>
      </div>

      <!-- Form Tambah Siswa Baru -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">NIS (4 Digit)</label>
          <input type="text" id="new-student-nis" placeholder="1782" class="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono">
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">NISN (10 Digit)</label>
          <input type="text" id="new-student-nisn" placeholder="3169876543" class="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono">
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
          <input type="text" id="new-student-name" placeholder="Nama Lengkap" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Avatar Emoji</label>
          <select id="new-student-avatar" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
            <option value="👦">👦 Laki-laki 1</option>
            <option value="🧒">🧒 Laki-laki 2</option>
            <option value="👧">👧 Perempuan 1</option>
            <option value="👩‍🦰">👩‍🦰 Perempuan 2</option>
          </select>
        </div>
        <div class="flex items-end">
          <button id="btn-save-new-student" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition">
            ➕ Tambah Siswa
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <th class="py-3 px-3 w-12 text-center">No</th>
              <th class="py-3 px-3">NIS</th>
              <th class="py-3 px-3">NISN</th>
              <th class="py-3 px-3">Nama Lengkap</th>
              <th class="py-3 px-3">PIN Login</th>
              <th class="py-3 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-600">
            ${students.map((s, idx) => `
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3 px-3 text-center font-bold text-slate-700">${s.no || idx + 1}</td>
                <td class="py-3 px-3 font-mono">${s.nis}</td>
                <td class="py-3 px-3 font-mono text-emerald-700 font-medium">${s.nisn}</td>
                <td class="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2">
                  <span class="text-lg">${s.avatar || "👦"}</span> ${s.nama}
                </td>
                <td class="py-3 px-3">
                  <span class="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-mono text-xs font-bold">
                    ${s.pin}
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <div class="inline-flex items-center gap-1">
                    <button id="btn-reset-pin-${s.nisn}" class="px-2 py-1 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded text-xs transition" title="Reset PIN ke 4 digit akhir NISN">
                      🔄 Reset PIN
                    </button>
                    <button id="btn-edit-student-${s.nisn}" class="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded text-xs transition">
                      ✏️ Edit
                    </button>
                    <button id="btn-del-student-${s.nisn}" class="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded text-xs transition">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderAdminAbsensi(): string {
  const students = getStudents();
  const today = new Date().toISOString().split("T")[0];
  const attendanceList = getAttendance();
  const currentRecord = attendanceList.find(a => a.date === today) || {
    date: today,
    status: students.reduce((acc, s) => ({ ...acc, [s.nisn]: "H" }), {} as Record<string, "H" | "S" | "I" | "A">)
  };

  const totalDays = attendanceList.length || 1;
  let totalPresent = 0;
  let totalSick = 0;
  let totalPermission = 0;
  let totalAlpha = 0;

  attendanceList.forEach(rec => {
    Object.values(rec.status).forEach(st => {
      if (st === "H") totalPresent++;
      else if (st === "S") totalSick++;
      else if (st === "I") totalPermission++;
      else if (st === "A") totalAlpha++;
    });
  });

  const totalPossible = totalDays * students.length;
  const attendancePercentage = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 100;

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📋</span> Presensi & Rekap Kehadiran
          </h2>
          <p class="text-xs text-slate-500">Catat kehadiran harian H (Hadir), S (Sakit), I (Izin), A (Alpa)</p>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-semibold text-slate-600">Pilih Tanggal:</label>
          <input type="date" id="input-absensi-date" value="${today}" class="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-slate-50 font-medium">
          <button id="btn-save-absensi" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition">
            💾 Simpan Absensi
          </button>
        </div>
      </div>

      <!-- Quick Stats Card -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <div class="text-xs font-semibold text-emerald-700">Tingkat Kehadiran</div>
          <div class="text-2xl font-black text-emerald-800">${attendancePercentage}%</div>
          <div class="text-[10px] text-emerald-600">${totalPresent} hadir dari ${totalPossible} slot</div>
        </div>
        <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl text-center">
          <div class="text-xs font-semibold text-sky-700">Sakit (S)</div>
          <div class="text-2xl font-black text-sky-800">${totalSick}</div>
          <div class="text-[10px] text-sky-600">Total hari sakit</div>
        </div>
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <div class="text-xs font-semibold text-amber-700">Izin (I)</div>
          <div class="text-2xl font-black text-amber-800">${totalPermission}</div>
          <div class="text-[10px] text-amber-600">Total hari izin</div>
        </div>
        <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
          <div class="text-xs font-semibold text-rose-700">Alpa (A)</div>
          <div class="text-2xl font-black text-rose-800">${totalAlpha}</div>
          <div class="text-[10px] text-rose-600">Tanpa keterangan</div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <th class="py-3 px-3 text-center w-12">No</th>
              <th class="py-3 px-3">Nama Siswa</th>
              <th class="py-3 px-3">NISN</th>
              <th class="py-3 px-3 text-center">Status Kehadiran Hari Ini</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${students.map((s, idx) => {
              const currentStatus = currentRecord.status[s.nisn] || "H";
              return `
                <tr class="hover:bg-slate-50/70 transition">
                  <td class="py-3 px-3 text-center font-bold text-slate-600">${idx + 1}</td>
                  <td class="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2">
                    <span>${s.avatar || "👦"}</span> ${s.nama}
                  </td>
                  <td class="py-3 px-3 font-mono text-xs text-slate-500">${s.nisn}</td>
                  <td class="py-3 px-3 text-center">
                    <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200" id="status-group-${s.nisn}">
                      ${["H", "S", "I", "A"].map((st) => {
                        const isSelected = currentStatus === st;
                        const colorMap: Record<string, string> = {
                          H: isSelected ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-700 hover:bg-emerald-50",
                          S: isSelected ? "bg-sky-600 text-white shadow-sm" : "text-sky-700 hover:bg-sky-50",
                          I: isSelected ? "bg-amber-600 text-white shadow-sm" : "text-amber-700 hover:bg-amber-50",
                          A: isSelected ? "bg-rose-600 text-white shadow-sm" : "text-rose-700 hover:bg-rose-50",
                        };
                        return `
                          <button id="btn-att-${s.nisn}-${st}" data-nisn="${s.nisn}" data-status="${st}" class="px-3 py-1 rounded-lg text-xs font-bold transition-all ${colorMap[st]}">
                            ${st}
                          </button>
                        `;
                      }).join("")}
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// JADWAL PELAJARAN (Kelola Penuh)
export function renderAdminJadwal(selectedDay: string = "Senin"): string {
  const schedule = getSchedule();
  const currentDay = getCurrentDayName();
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const dayItems = schedule[selectedDay] || [];

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📅</span> Kelola Jadwal Pelajaran (Penuh)
          </h2>
          <p class="text-xs text-slate-500">
            Tambah, edit, hapus, urutkan otomatis, dan salin jadwal antar hari.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-reset-jadwal-default" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition">
            🔄 Kembalikan ke Jadwal Awal
          </button>
          <button id="btn-print-jadwal" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition no-print">
            🖨️ Cetak
          </button>
        </div>
      </div>

      <!-- Day Selector Tabs -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-2">
        <div class="flex gap-2 overflow-x-auto">
          ${days.map(d => `
            <button id="btn-jadwal-tab-${d}" data-day="${d}" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${d === selectedDay ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
              <span>${d}</span>
              ${d === currentDay ? '<span class="text-[9px] bg-white text-emerald-800 px-1 rounded-full font-black">HARI INI</span>' : ''}
            </button>
          `).join("")}
        </div>

        <!-- Copy Day Schedule Form -->
        <div class="hidden sm:flex items-center gap-2 text-xs">
          <span class="text-slate-500 font-semibold">Salin ke:</span>
          <select id="select-copy-target-day" class="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold">
            ${days.filter(d => d !== selectedDay).map(d => `<option value="${d}">${d}</option>`).join("")}
          </select>
          <button id="btn-copy-schedule" data-from="${selectedDay}" class="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs transition">
            Salin Jadwal 📋
          </button>
        </div>
      </div>

      <!-- Form Tambah Baris Jadwal Baru -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div class="font-bold text-xs text-slate-700 flex items-center gap-1.5">
          <span>➕</span> Tambah Mata Pelajaran ke Hari <strong>${selectedDay}</strong>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-600 mb-1">Jam Mulai</label>
            <input type="time" id="new-item-start" value="07:35" class="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono">
          </div>
          <div>
            <label class="block font-semibold text-slate-600 mb-1">Jam Selesai</label>
            <input type="time" id="new-item-end" value="09:20" class="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono">
          </div>
          <div class="sm:col-span-2">
            <label class="block font-semibold text-slate-600 mb-1">Nama Mata Pelajaran / Kegiatan</label>
            <input type="text" id="new-item-mapel" placeholder="Contoh: Matematika" class="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold">
          </div>
          <div class="flex items-end gap-2">
            <label class="flex items-center gap-1 text-xs text-slate-600 pb-2">
              <input type="checkbox" id="new-item-is-rest" class="rounded">
              <span>Waktu Istirahat</span>
            </label>
            <button id="btn-add-schedule-item" data-day="${selectedDay}" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition">
              Simpan 💾
            </button>
          </div>
        </div>
      </div>

      <!-- Schedule Table for Selected Day -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th class="py-2.5 px-3 w-12 text-center">Urutan</th>
              <th class="py-2.5 px-3">Jam Pelajaran</th>
              <th class="py-2.5 px-3">Mata Pelajaran / Aktivitas</th>
              <th class="py-2.5 px-3 text-center">Kategori</th>
              <th class="py-2.5 px-3 text-center">Aksi Kelola</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${dayItems.length === 0 ? `
              <tr>
                <td colspan="5" class="py-8 text-center text-slate-400 italic">
                  Belum ada jadwal untuk hari ${selectedDay}. Tambahkan baris jadwal di atas!
                </td>
              </tr>
            ` : dayItems.map((it, idx) => `
              <tr class="hover:bg-slate-50">
                <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-500">${idx + 1}</td>
                <td class="py-2.5 px-3 font-mono font-bold text-slate-800">${it.start} – ${it.end}</td>
                <td class="py-2.5 px-3 font-semibold text-slate-800">${it.mapel}</td>
                <td class="py-2.5 px-3 text-center">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${it.isRest ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
                    ${it.isRest ? 'Istirahat' : 'Pelajaran'}
                  </span>
                </td>
                <td class="py-2.5 px-3 text-center">
                  <div class="inline-flex items-center gap-1.5">
                    <button id="btn-edit-sched-${selectedDay}-${it.id}" data-day="${selectedDay}" data-id="${it.id}" class="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded text-xs transition">
                      ✏️ Edit
                    </button>
                    <button id="btn-del-sched-${selectedDay}-${it.id}" data-day="${selectedDay}" data-id="${it.id}" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded text-xs transition">
                      🗑️ Hapus
                    </button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// JADWAL PIKET (Kelola Penuh)
export function renderAdminPiket(selectedDay: string = "Senin"): string {
  const students = getStudents();
  const piket = getPiket();
  const tasks = getPiketTasks();
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const assignments = piket[selectedDay] || [];
  const studentMap = new Map(students.map(s => [s.nisn, s]));

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🧹</span> Kelola Jadwal Piket Siswa (Penuh)
          </h2>
          <p class="text-xs text-slate-500">
            Atur pembagian siswa dan tugas kebersihan kelas untuk Senin hingga Jumat.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button id="btn-shuffle-piket-fair" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition">
            🎲 Acak Ulang Adil
          </button>
          <button id="btn-clear-day-piket" data-day="${selectedDay}" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
            🗑️ Kosongkan Hari
          </button>
          <button id="btn-reset-piket-default" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition">
            🔄 Kembalikan ke Awal
          </button>
        </div>
      </div>

      <!-- Day Tabs -->
      <div class="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        ${days.map(d => {
          const count = (piket[d] || []).length;
          return `
            <button id="btn-piket-tab-${d}" data-day="${d}" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${d === selectedDay ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
              <span>${d}</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] ${d === selectedDay ? 'bg-white text-emerald-800 font-black' : 'bg-slate-200 text-slate-600 font-bold'}">${count} Siswa</span>
            </button>
          `;
        }).join("")}
      </div>

      <!-- Form Tambah Siswa & Tugas ke Hari Ini -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div class="font-bold text-xs text-slate-700 flex items-center gap-1.5">
          <span>➕</span> Tugaskan Siswa ke Hari <strong>${selectedDay}</strong>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-600 mb-1">Pilih Siswa</label>
            <select id="piket-assign-student" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
              ${students.map(s => `<option value="${s.nisn}">${s.avatar || "👦"} ${s.nama}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-600 mb-1">Pilih Tugas Piket</label>
            <select id="piket-assign-task" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
              ${tasks.map(t => `<option value="${t}">${t}</option>`).join("")}
            </select>
          </div>
          <div class="flex items-end">
            <button id="btn-add-piket-assignment" data-day="${selectedDay}" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition">
              ➕ Tambahkan ke Regu ${selectedDay}
            </button>
          </div>
        </div>
      </div>

      <!-- Current Day Piket Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th class="py-2.5 px-3 w-12 text-center">No</th>
              <th class="py-2.5 px-3">Nama Siswa</th>
              <th class="py-2.5 px-3">NISN</th>
              <th class="py-2.5 px-3">Tugas Piket Kebersihan</th>
              <th class="py-2.5 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${assignments.length === 0 ? `
              <tr>
                <td colspan="5" class="py-8 text-center text-slate-400 italic">
                  Belum ada siswa yang ditugaskan piket pada hari ${selectedDay}.
                </td>
              </tr>
            ` : assignments.map((asg, idx) => {
              const st = studentMap.get(asg.nisn);
              return `
                <tr class="hover:bg-slate-50">
                  <td class="py-2.5 px-3 text-center font-bold text-slate-500">${idx + 1}</td>
                  <td class="py-2.5 px-3 font-semibold text-slate-800 flex items-center gap-2">
                    <span>${st?.avatar || "👦"}</span>
                    <span>${st?.nama || asg.nisn}</span>
                  </td>
                  <td class="py-2.5 px-3 font-mono text-slate-500">${asg.nisn}</td>
                  <td class="py-2.5 px-3 font-semibold text-emerald-800">
                    🧹 ${asg.task}
                  </td>
                  <td class="py-2.5 px-3 text-center">
                    <button id="btn-del-piket-${selectedDay}-${asg.id}" data-day="${selectedDay}" data-id="${asg.id}" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs transition">
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderAdminLiterasi(): string {
  const students = getStudents();
  const logs = getReadingLogs();

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📚</span> Pojok Baca Literasi Siswa
          </h2>
          <p class="text-xs text-slate-500">Catat riwayat membaca buku fiksi & non-fiksi anak</p>
        </div>
      </div>

      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Pilih Siswa</label>
          <select id="literasi-student" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
            ${students.map(s => `<option value="${s.nisn}">${s.nama}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Judul Buku</label>
          <input type="text" id="literasi-title" placeholder="Contoh: Kisah Si Kancil" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Halaman Dibaca</label>
          <input type="number" id="literasi-pages" value="10" min="1" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Pesan / Kesan Singkat</label>
          <input type="text" id="literasi-note" placeholder="Ceritanya seru dan mendidik" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
        </div>
        <div class="flex items-end">
          <button id="btn-save-literasi" class="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition">
            ➕ Simpan Bacaan
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th class="py-2.5 px-3">Tanggal</th>
              <th class="py-2.5 px-3">Nama Siswa</th>
              <th class="py-2.5 px-3">Judul Buku</th>
              <th class="py-2.5 px-3 text-center">Jml Hal</th>
              <th class="py-2.5 px-3">Kesan / Ringkasan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-600">
            ${logs.length === 0 ? `
              <tr>
                <td colspan="5" class="py-6 text-center text-slate-400 italic">Belum ada catatan buku yang dibaca. Ayo mulai membaca hari ini! 📖</td>
              </tr>
            ` : logs.map(l => `
              <tr class="hover:bg-slate-50">
                <td class="py-2.5 px-3 font-mono">${l.date}</td>
                <td class="py-2.5 px-3 font-semibold text-slate-800">${l.studentName}</td>
                <td class="py-2.5 px-3 font-medium text-sky-700">📖 ${l.bookTitle}</td>
                <td class="py-2.5 px-3 text-center font-bold">${l.pages}</td>
                <td class="py-2.5 px-3 text-slate-500">${l.note}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export { renderAdminKas, kasState, setKasState } from "./adminKas";
export { renderAdminTabungan, tabunganState, setTabunganState } from "./adminTabungan";
export { renderAdminNilai, nilaiState, setNilaiState } from "./adminNilai";

export function renderAdminMonitor(): string {
  const students = getStudents();

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📈</span> Monitor Progres Belajar & Game Siswa
          </h2>
          <p class="text-xs text-slate-500">Pantau XP ⭐, Koin 🪙, Permata Ilmu 💎, Kejadian Remedial, dan Riwayat Soal</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${students.map(s => {
          const progS1 = getGameProgress(s.nisn, 1);
          const answeredCount = Object.values(progS1.answeredQuestionIds).reduce((acc, arr) => acc + arr.length, 0);

          return `
            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-3">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">${s.avatar || "👦"}</span>
                  <div>
                    <h3 class="font-bold text-slate-800 text-sm">${s.nama}</h3>
                    <p class="text-[11px] font-mono text-slate-500">NISN: ${s.nisn}</p>
                  </div>
                </div>
                <button id="btn-reset-history-${s.nisn}" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold transition" title="Kosongkan riwayat agar siswa bisa memulai bank soal baru">
                  🔄 Reset Riwayat Soal
                </button>
              </div>

              <div class="grid grid-cols-4 gap-2 text-center">
                <div class="p-2 bg-white rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-400">Total XP</div>
                  <div class="font-black text-amber-600 text-sm font-mono">⭐ ${progS1.xp}</div>
                </div>
                <div class="p-2 bg-white rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-400">Koin</div>
                  <div class="font-black text-yellow-600 text-sm font-mono">🪙 ${progS1.coins}</div>
                </div>
                <div class="p-2 bg-white rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-400">Permata</div>
                  <div class="font-black text-emerald-600 text-sm font-mono">💎 ${progS1.gems.length}/10</div>
                </div>
                <div class="p-2 bg-white rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-400">Remedial</div>
                  <div class="font-black text-rose-600 text-sm font-mono">${progS1.remedialCount}x</div>
                </div>
              </div>

              <div class="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center">
                <span>Soal telah dijawab: <strong>${answeredCount}</strong> soal</span>
                <span class="text-[11px] text-slate-400">Status: Aktif</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

export function renderAdminBackup(): string {
  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="pb-4 border-b border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>⚙️</span> Pengaturan Sistem, Sandi Guru & Cadangan Data
        </h2>
        <p class="text-xs text-slate-500">Ekspor/Impor cadangan data JSON dan amankan akun guru</p>
      </div>

      <!-- Ganti Password Guru -->
      <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span>🔑</span> Ganti Kata Sandi Akun Guru
        </h3>
        <p class="text-xs text-slate-500">Kata sandi baru akan dienkripsi dengan standar aman SHA-256 (Web Cryptography API).</p>
        <div class="flex flex-col sm:flex-row gap-3 max-w-md">
          <input type="password" id="input-new-teacher-pwd" placeholder="Masukkan password baru..." class="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm flex-1">
          <button id="btn-save-teacher-pwd" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold transition">
            Simpan Sandi Baru
          </button>
        </div>
      </div>

      <!-- Ekspor & Impor Cadangan Lengkap -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
          <h3 class="font-bold text-emerald-900 text-sm flex items-center gap-2">
            <span>💾</span> Cadangkan Seluruh Data (Ekspor JSON)
          </h3>
          <p class="text-xs text-emerald-700 leading-relaxed">
            Unduh seluruh arsip data kelas (siswa, absensi, jadwal, piket, kas, tabungan, nilai, materi, bank soal, hasil grafik) ke dalam format file JSON.
          </p>
          <button id="btn-export-full-data" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition">
            ⬇️ Unduh File Cadangan (JSON)
          </button>
        </div>

        <div class="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
          <h3 class="font-bold text-amber-900 text-sm flex items-center gap-2">
            <span>📥</span> Pulihkan Data dari Cadangan (Impor JSON)
          </h3>
          <p class="text-xs text-amber-700 leading-relaxed">
            Tempelkan isi file cadangan JSON atau unggah file untuk memulihkan seluruh data aplikasi.
          </p>
          <textarea id="textarea-import-data" rows="3" placeholder="Tempelkan kode JSON di sini..." class="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-mono"></textarea>
          <button id="btn-import-full-data" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition">
            Pulihkan Data
          </button>
        </div>
      </div>
    </div>
  `;
}
