// Nama    = Marcelo Jonathan Holle
// NIM     = 411222083

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const mahasiswaDetail = () => {
  const { id } = useParams();  
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `http://localhost:8081/mahasiswa/${id}`;

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
        console.error("Error fetching detail: ", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Memuat detail mahasiswa...</div>;
  if (!mahasiswa) return <div>Mahasiswa dengan ID {id} tidak ditemukan.</div>;

  return (
    <div>
      <h1>Detail Mahasiswa</h1>
      <p><strong>ID:</strong> {mahasiswa.id}</p>
      <p><strong>Nama:</strong> {mahasiswa.nama}</p>
      <p><strong>Jurusan:</strong> {mahasiswa.jurusan}</p>
      <Link to="/">Kembali ke Daftar</Link>
    </div>
  );
};

export default mahasiswaDetail;
