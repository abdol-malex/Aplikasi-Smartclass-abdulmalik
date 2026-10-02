export interface SubbabItem {
  id: string; // e.g. "PPKN-B1-S1"
  code: string; // e.g. "A"
  title: string;
  isSumatif?: boolean;
}

export interface BabItem {
  id: string; // e.g. "PPKN-B1"
  title: string;
  subbabs: SubbabItem[];
}

export interface MapelKurikulum {
  name: string;
  code: string;
  babs: BabItem[];
  evaluasi: string[]; // ["ATS 1", "ASAS 1"]
  defaultKKM: number;
}

// Raw JSON Structure provided by user
export const RAW_KURIKULUM_SEM1: Record<string, Record<string, string[]>> = {
  "PPKN": {
    "Bab 1: Mengenal Lingkungan Sekitar": [
      "A. Identitas masyarakat di lingkungan tempat tinggal",
      "B. Menghargai perbedaan identitas masyarakat",
      "C. Perangkat desa dan kelurahan",
      "D. Menjelajah lingkungan tempat tinggal"
    ],
    "Bab 2: Aku Anak Disiplin": [
      "A. Aturan di lingkungan sekitar",
      "B. Membuat dan melaksanakan aturan",
      "C. Mendapatkan hak dan melakukan kewajiban"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Bahasa Indonesia": {
    "Bab 1: Sudah Besar": [
      "A. Memaknai teks narasi yang dibacakan",
      "B. Menulis kalimat transitif dan intransitif",
      "C. Memahami arti kata pada kamus",
      "D. Memahami isi bacaan dan menyampaikan pendapat"
    ],
    "Bab 2: Di Bawah Atap": [
      "A. Menyimpulkan dan menceritakan kembali isi teks bacaan",
      "B. Mengidentifikasi kata bermakna ganda (homonim)",
      "C. Mengenal kata berimbuhan me-",
      "D. Menyusun paragraf deskripsi dengan kalimat majemuk setara"
    ],
    "Bab 3: Lihat Sekitar": [
      "A. Membaca petunjuk arah dan rambu lalu lintas",
      "B. Menyusun teks argumentasi",
      "C. Menggunakan imbuhan ber-",
      "D. Menulis teks deskripsi"
    ],
    "Bab 4: Meliuk dan Menerjang": [
      "A. Menemukan informasi dari bacaan yang disimak",
      "B. Memahami majas personifikasi",
      "C. Menyusun teks wawancara",
      "D. Merespons teks visual"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Matematika": {
    "Bab 1: Bilangan Cacah sampai 10.000": [
      "A. Membaca dan menulis bilangan cacah",
      "B. Membandingkan dan mengurutkan bilangan cacah",
      "C. Komposisi dan dekomposisi bilangan"
    ],
    "Bab 2: Operasi Bilangan Cacah sampai 1.000": [
      "A. Penjumlahan dan pengurangan",
      "B. Perkalian dan pembagian",
      "C. Faktor dan kelipatan"
    ],
    "Bab 3: Pecahan": [
      "A. Membandingkan dan mengurutkan pecahan",
      "B. Pecahan senilai",
      "C. Pecahan desimal dan persen"
    ],
    "Bab 4: Pola Gambar dan Pola Bilangan": [
      "A. Pola gambar",
      "B. Pola bilangan"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "IPA": {
    "Bab 1: Mengubah Bentuk Energi": [
      "A. Perubahan energi di sekitar kita",
      "B. Fotosintesis",
      "C. Mengapa manusia mengubah energi"
    ],
    "Bab 2: Gaya di Sekitar Kita": [
      "A. Apa itu gaya",
      "B. Berbagai bentuk gaya",
      "C. Manfaat gaya dalam kehidupan sehari-hari"
    ],
    "Bab 3: Di Sini Tempat Tinggalku!": [
      "A. Mengenal peta",
      "B. Bentang alam daerahku"
    ],
    "Bab 4: Iklim dan Perubahannya": [
      "A. Musim dan iklim di Indonesia",
      "B. Efek rumah kaca",
      "C. Gas karbon di sekitar kita"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Bahasa Inggris": {
    "Chapter 1: My Morning Routine": [
      "A. Morning Activities",
      "B. Time"
    ],
    "Chapter 2: Meal Time": [
      "A. Meal Time and Foods",
      "B. Taste and Texture"
    ],
    "Chapter 3: My Colorful Toys and Their Shapes": [
      "A. Toys",
      "B. Shapes and Colors"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Seni Budaya": {
    "Bab 1: Menggambar Sketsa": [
      "A. Tahapan membuat sketsa awal",
      "B. Referensi berbagai jenis sketsa"
    ],
    "Bab 2: Menelaah Karakteristik Alat dan Bahan": [
      "A. Karakteristik alat dan bahan",
      "B. Karakteristik karya berdasarkan alat dan bahan"
    ],
    "Bab 3: Mengkreasikan Karya Seni Rupa Dua Dimensi dan Tiga Dimensi": [
      "A. Lima unsur rupa dalam karya seni",
      "B. Prinsip keseimbangan dalam karya seni",
      "C. Macam-macam karya seni rupa 2D",
      "D. Macam-macam karya seni rupa 3D",
      "E. Prosedur penggunaan bahan",
      "F. Prosedur penggunaan alat"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Bahasa Jawa": {
    "Pasinaon 1: Teks Geguritan lan Cerita Wayang": [
      "A. Teks Geguritan",
      "B. Maca Teks Geguritan",
      "C. Nemtokake Piwulang Luhur Teks Geguritan",
      "D. Nemtokake Pokok Wos Wacan",
      "E. Undha Usuk Basa Jawa"
    ],
    "Pasinaon 2: Tembang Gambuh": [
      "A. Titikane Tembang Gambuh",
      "B. Negesi Tembung"
    ],
    "Pasinaon 3: Teks Non Sastra (Tradisi)": [
      "A. Teks Non Sastra",
      "B. Nentokake Pokok Wos Wacan"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Pendidikan Agama Islam": {
    "Bab 1 Mari Mengaji dan Mengkaji Surah al-Hujurat Ayat 10–11 dan Hadis tentang Mukmin itu Bersaudara": [
      "Membaca Surah al-Hujurat Ayat 10–11",
      "Mengartikan Surah al-Hujurat Ayat 10–11",
      "Memahami Pesan Pokok Surah al-Hujurat Ayat 10–11",
      "Menulis Surah al-Hujurat Ayat 10–11",
      "Menghafal Surah al-Hujurat Ayat 10–11",
      "Mengkaji Hadis tentang Mukmin itu Bersaudara",
      "Asesmen Sumatif Bab 1"
    ],
    "Bab 2 Teladan Mulia Asmaulhusna": [
      "Lima Asmaulhusna dan Artinya",
      "Berakhlak dengan Lima Asmaulhusna",
      "Asesmen Sumatif Bab 2"
    ],
    "Bab 3 Akhlakku terhadap Keluarga": [
      "Anggota Keluarga",
      "Akhlak terhadap Keluarga",
      "Asesmen Sumatif Bab 3"
    ],
    "Evaluasi_Tengah": [
      "Asesmen Tengah Semester"
    ],
    "Bab 4 Menyambut Usia Balig": [
      "Tanda-tanda Balig Menurut Ilmu Fikih",
      "Tanda-tanda Balig dalam Pandangan Ilmu Biologi",
      "Tanggung Jawab setelah Usia Balig",
      "Asesmen Sumatif Bab 4"
    ],
    "Bab 5 Kisah Muhammad saw. diangkat menjadi Rasul dan Awal Dakwahnya di Makkah": [
      "Muhammad saw. diangkat menjadi Rasul",
      "Awal Dakwah Nabi Muhammad saw. di Makkah",
      "Meneladani Kisah Dakwah Nabi Muhammad saw.",
      "Asesmen Sumatif Bab 5"
    ],
    "Evaluasi_Akhir": [
      "Asesmen Akhir Semester"
    ]
  },
  "PJOK": {
    "Bab 1 Ayo, Bergerak!": [
      "Bergerak Berpindah Tempat",
      "Bergerak tanpa Berpindah Tempat",
      "Bergerak Menggunakan Benda",
      "Bergerak di Air",
      "Asesmen Sumatif Akhir Bab 1"
    ],
    "Bab 2 Ayo, Bermain!": [
      "Permainan Invas",
      "Permainan Net",
      "Permainan Lapangan",
      "Permainan Target",
      "Permainan Kooperatif",
      "Asesmen Sumatif Akhir Bab 2"
    ],
    "Evaluasi_Tengah": [
      "Asesmen Sumatif Tengah Semester"
    ],
    "Bab 3 Ayo, Merangkai Gerak!": [
      "Aktivitas Gerak Berirama",
      "Aktivitas Senam",
      "Aktivitas Bela Diri",
      "Asesmen Sumatif Akhir Bab 3"
    ],
    "Evaluasi_Akhir": [
      "Asesmen Sumatif Akhir Semester"
    ]
  }
};

export const LIST_MAPEL_SEM1 = Object.keys(RAW_KURIKULUM_SEM1);

// Helper to get structured Mapel info
export function getStructuredMapels(semester: 1 | 2 = 1): MapelKurikulum[] {
  if (semester === 2) {
    // Semester 2 and Komputer are empty without errors
    return [];
  }

  return LIST_MAPEL_SEM1.map((mapelName) => {
    const rawMapel = RAW_KURIKULUM_SEM1[mapelName] || {};
    const babs: BabItem[] = [];
    let evaluasi: string[] = ["ATS 1", "ASAS 1"];

    Object.entries(rawMapel).forEach(([babTitle, subList], bIdx) => {
      if (babTitle.startsWith("Evaluasi")) {
        evaluasi = subList;
        return;
      }

      // Filter subbabs: separate normal subbab and sumatif bab
      const subbabs: SubbabItem[] = subList
        .filter(subTitle => !subTitle.toLowerCase().includes("asesmen sumatif"))
        .map((subTitle, sIdx) => {
          const matchCode = subTitle.match(/^([A-Z])\.\s*(.+)$/);
          return {
            id: `${mapelName}-B${bIdx + 1}-S${sIdx + 1}`,
            code: matchCode ? matchCode[1] : `${sIdx + 1}`,
            title: matchCode ? matchCode[2].trim() : subTitle.trim(),
            isSumatif: false
          };
        });

      babs.push({
        id: `${mapelName}-B${bIdx + 1}`,
        title: babTitle.trim(),
        subbabs
      });
    });

    return {
      name: mapelName,
      code: mapelName.toLowerCase().replace(/\s+/g, "_"),
      babs,
      evaluasi,
      defaultKKM: 70
    };
  });
}
