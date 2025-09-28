// Nama    = Marcelo Jonathan Holle
// NIM     = 411222083

const express = require('express');
const app = express();
const port = 8081;

const mahasiswa = [
    {id: 1, nama: 'Marcelo', jurusan: 'Informatika'},
    {id: 2, nama: 'Glenn', jurusan: 'Sistem Informasi'},
    {id: 3, nama: 'Bagas', jurusan: 'Teknik Elektro'},
    {id: 4, nama: 'Natalia', jurusan: 'Informatika'},
    {id: 5, nama: 'John', jurusan: 'Informatika'}
]

app.get('/mahasiswa', (req, res) => {
    res.json(mahasiswa);
});

app.get('/mahasiswa/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = mahasiswa.find(m => m.id === id);

    if (data) {
        res.json(data);
    }else {
        res.status(404).send('Mahasiswa tidak ditemukan');
    }
});

app.listen(port, () => {
    console.log(`server berjalan di http://localhost:${port}`);
})