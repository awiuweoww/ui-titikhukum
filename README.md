# README / Product Requirements Document (PRD) BRIN

**Nama Produk:** TitikHukum  
**Deskripsi:** Platform Asisten Riset Hukum Terpadu Berbasis RAG & LLM  
**Ditujukan untuk:** Tim Development (@Fabian & @Chandra)  
**Tanggal:** 2 September 2026

---

## 1. Visi & Filosofi Produk (TitikHukum)

**TitikHukum** mendefinisikan ulang efisiensi riset perundang-undangan. Mengubah kerumitan ribuan halaman dokumen legal menjadi kepastian hukum yang transparan melalui analisis AI.

Filosofi "TitikHukum" bermakna presisi absolut: sistem tidak sekadar memberikan opini AI (yang rawan halusinasi), melainkan langsung menunjuk pada satu "titik" kebenaran (koordinat teks/pasal) yang valid dan tak terbantahkan langsung di atas dokumen asli.

**Nilai Jual Utama (Value Proposition):**

- **100% Transparansi Referensi:** Nol risiko halusinasi karena setiap jawaban AI divalidasi dengan bukti visual (_bounding box_).
- **Pemrosesan Cerdas:** Ekstraksi pasal, kewenangan, dan tindak pidana dari dokumen kompleks hanya dalam hitungan detik.

---

## 2. Peran & Hak Akses Pengguna (Role-Based Access)

Sistem membedakan fungsi berdasarkan 3 jenis profil pengguna:

1. **Administrator**
   - Bertugas mengelola _master data_ dokumen.
   - Hak eksklusif untuk mengunggah regulasi secara permanen ke _database_ terstruktur dan graf.
2. **Ahli Hukum / Periset (Expert)**
   - Tenaga ahli profesional untuk riset mendalam dan komparasi putusan.
   - Memiliki akses untuk mengevaluasi (_review_) dan memvalidasi keluaran (_output_) chatbot guna meningkatkan akurasi penalaran sistem.
3. **User Umum (General User)**
   - Masyarakat atau praktisi bisnis yang menggunakan chatbot untuk tanya jawab risiko hukum.
   - Tidak dapat mengubah _database_ utama, tetapi diizinkan mengunggah dokumen pribadi secara _on-the-fly_ (sementara) sebagai konteks percakapan.

---

## 3. Rincian Fungsionalitas Inti (Core Features)

Platform ini mengintegrasikan pemrosesan dokumen kompleks dengan interaksi _chatbot_ melalui modul-modul berikut:

| Modul & Fitur                                  | Spesifikasi Fungsi                                                                                                                     | Kriteria Penerimaan / Catatan Teknis                                                                                                                                               |
| :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **3.1. Ingesti Dokumen (Upload Regulasi)**     | Fasilitas Admin untuk mengunggah dokumen regulasi mentah. Sistem akan membedah (_parse_), memecah (_split_), dan mengekstrak isi fail. | - Mendukung PDF undang-undang, tabel lampiran, laporan, scan sertifikat, dan teks (Prioritas: UU & Putusan Pidana).<br>- Hasil disimpan ke _database_ terstruktur, JSON, dan graf. |
| **3.2. Indeks Graf (miniRAG)**                 | Pembangunan indeks relasional antar entitas hukum untuk memperkaya konteks _semantic search_.                                          | - Harus menggunakan referensi basis kode dan logika dari: `github.com/inimah/scenario-legal-graph-rag`                                                                             |
| **3.3. Mesin Pencari & Konteks Multi-Dokumen** | Fitur pencarian dokumen berbasis _keyword_ dasar maupun _query_ kalimat kompleks.                                                      | - Mengembalikan daftar regulasi relevan.<br>- Pengguna dapat menyeleksi 1 hingga multi-dokumen dari daftar ini sebagai konteks percakapan lanjutan.                                |
| **3.4. Tanya Jawab (Q&A) & Penalaran**         | Chatbot AI untuk tanya jawab berbasis rujukan dokumen terpilih yang mampu melakukan penalaran kasus baru.                              | - Sanggup merangkum multi-dokumen dan menjawab skenario pengandaian (Jika X adalah Y, hukumannya?).<br>- Referensi QA: `github.com/inimah/scenario-legal-qa-generation`            |
| **3.5. Analisis Dokumen _On-The-Fly_**         | Fasilitas _upload attachment_ pada _chat_ khusus bagi pengguna umum untuk evaluasi draf pribadi (misal: draf kontrak).                 | - Dokumen diproses instan sebagai konteks temu kembali khusus _query_ pengguna tersebut.<br>- **Wajib:** Tidak disimpan di _database_ dan otomatis terhapus usai sesi.             |
| **3.6. Validasi Visual (_Bounding Box_)**      | Antarmuka layar terbelah (_split-screen_) yang menampilkan _chat_ dan peninjau PDF secara berdampingan.                                | - Setiap jawaban dari Fungsi 3.3 & 3.4 wajib mengembalikan koordinat referensi teks.<br>- Sistem otomatis menggambar _bounding box_ di atas PDF asli.                              |
| **3.7. Ekstraksi Rincian Otomatis**            | Dasbor yang merangkum poin krusial dari dokumen ke dalam kartu entitas hukum yang rapi.                                                | - Harus mengekstrak: Daftar "Tindak Pidana", "Kewenangan/Lembaga", dan hierarki "Dasar Hukum".                                                                                     |
| **3.8. Visualisasi Alur Graf RAG**             | Fitur edukatif untuk menunjukkan transparansi cara kerja AI kepada pengguna.                                                           | - Tombol "Lihat Alur RAG" yang memunculkan graf sederhana (alur pencocokan _query_ -> _chunking_ -> _LLM output_).                                                                 |
| **3.9. Profiling & Manajemen CRUD**            | Pengelolaan akun pengguna, preferensi aplikasi, dan manajemen daftar pustaka regulasi.                                                 | - Terdapat tabel Daftar Dokumen untuk Admin (Edit metadata, Hapus).<br>- Terdapat riwayat sesi obrolan (History) untuk pengguna biasa.                                             |

---

## 4. Alur Kerja Utama (User Flows)

**A. Alur Admin (Data Ingestion)**

1. Admin login dan masuk ke "Pustaka Dokumen".
2. Unggah PDF (misal: UU Perikanan).
3. Sistem memproses dokumen menjadi indeks terstruktur dan graf (miniRAG). Dokumen siap diakses publik.

**B. Alur Periset / Ahli Hukum (Riset Mendalam)**

1. Melakukan pencarian _semantic_ kompleks di mesin pencari.
2. Memilih 3 putusan pengadilan yang relevan dari hasil pencarian.
3. Masuk ke Ruang Analisis dan meminta AI membuat ringkasan komparasi.
4. Ahli hukum mengeklik referensi visual untuk memastikan AI menyorot halaman PDF yang benar.
5. Ahli hukum memberikan evaluasi/koreksi pada respons LLM untuk perbaikan model.

**C. Alur User Umum (Cek Legalitas Cepat)**

1. User masuk ke Ruang Analisis.
2. Mengunggah draf perjanjian kerja sama secara _on-the-fly_.
3. Bertanya kepada chatbot: "Apakah ada klausul yang merugikan sepihak di dokumen ini?"
4. AI menjawab dengan rincian risiko dan menyorot pasal terkait pada PDF Viewer.
5. User menutup sesi, dan draf perjanjian tersebut otomatis terhapus dari memori _server_.
