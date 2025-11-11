// Nama    = Marcelo Jonathan Holle
// NIM     = 411222083

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MahasiswaList = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:8081/mahasiswa";

  useEffect(() => {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setMahasiswa(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Memuat data mahasiswa...</div>;
  if (mahasiswa.length === 0) return <div>Tidak ada data mahasiswa yang tersedia.</div>;

  return (
    <div>
      <h1>Daftar Mahasiswa</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Jurusan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map(mhs => (
            <tr key={mhs.id}>
              <td>{mhs.id}</td>
              <td>{mhs.nama}</td>
              <td>{mhs.jurusan}</td>
              <td>
                <Link to={`/mahasiswa/${mhs.id}`}>Lihat Detail</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaList;
