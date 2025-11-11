// Nama    = Marcelo Jonathan Holle
// NIM     = 411222083

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 8081;

app.use(cors());

const getMahasiswaData = () => {
    const jsonData = fs.readFileSync('./mahasiswa.json');
    return JSON.parse(jsonData);
}

app.get('/mahasiswa', (req, res) => {
    const mahasiswa = getMahasiswaData();
    res.json(mahasiswa);
});

app.get('/mahasiswa/:id', (req, res) => {
    const mahasiswa = getMahasiswaData();
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