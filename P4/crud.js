// Marcelo Jonathan Holle - 411222083 :)
// crud.js - RESTful API Sederhana untuk Manajemen Buku
const express = require('express');
const app = express();
const port = 3000;

// Middleware: Mengizinkan Express untuk mem-parsing body permintaan dalam format JSON
app.use(express.json());

// --- Simulasi Database (Data Buku) ---
let books = [
    { id: 1, title: 'Naruto', author: 'Masashi Kishimoto' },
    { id: 2, title: 'Jujutsu Kaisen', author: 'Gege Akutami' },
    { id: 3, title: 'Sword Art Online', author: 'Reki Kawahara' }
];

// Fungsi bantu untuk mendapatkan ID berikutnya
const getNextId = () => {
    return books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
};

// =======================================================
// === 1. READ (GET) - Mengambil Data ====================
// =======================================================

// Endpoint GET /api/books: Mengambil SEMUA buku
app.get('/api/books', (req, res) => {
    console.log('GET /api/books - Mengambil semua buku');
    res.status(200).json(books);
});

// Endpoint GET /api/books/:id: Mengambil buku berdasarkan ID
app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);
    if (book) {
        console.log(`GET /api/books/${id} - Buku ditemukan`);
        res.status(200).json(book);
    } else {
        console.log(`GET /api/books/${id} - Buku tidak ditemukan`);
        res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
});

// =======================================================
// === 2. CREATE (POST) - Membuat Data Baru ==============
// =======================================================
app.post('/api/books', (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        console.log('POST /api/books - Gagal: Data tidak lengkap');
        return res.status(400).json({ message: 'Title dan Author harus diisi' });
    }

    const newBook = {
        id: getNextId(),
        title: title,
        author: author
    };

    books.push(newBook);
    console.log(`POST /api/books - Buku baru berhasil dibuat: ID ${newBook.id}`);
    res.status(201).json(newBook);
});

// =======================================================
// === 3. UPDATE (PUT) - Memperbarui Data ================
// =======================================================
app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex !== -1) {
        const { title, author } = req.body;
        if (!title || !author) {
            return res.status(400).json({ message: 'Title dan Author harus diisi untuk update PUT' });
        }

        const updatedBook = { id, title, author };
        books[bookIndex] = updatedBook;
        console.log(`PUT /api/books/${id} - Buku berhasil diperbarui`);
        res.status(200).json(updatedBook);
    } else {
        console.log(`PUT /api/books/${id} - Buku tidak ditemukan`);
        res.status(404).json({ message: 'Buku tidak ditemukan untuk diperbarui' });
    }
});

// =======================================================
// === 4. DELETE (DELETE) - Menghapus Data ===============
// =======================================================
app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = books.length;

    books = books.filter(b => b.id !== id);

    if (books.length < initialLength) {
        console.log(`DELETE /api/books/${id} - Buku berhasil dihapus`);
        res.status(204).send();
    } else {
        console.log(`DELETE /api/books/${id} - Buku tidak ditemukan`);
        res.status(404).json({ message: 'Buku tidak ditemukan untuk dihapus' });
    }
});

// --- Menjalankan Server ---
app.listen(port, () => {
    console.log(`Server REST API berjalan di http://localhost:${port}`);
});
