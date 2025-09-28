// Nama    = Marcelo Jonathan Holle
// NIM     = 411222083

import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MahasiswaList from './components/MahasiswaList'
import MahasiswaDetail from './components/MahasiswaDetail'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="App" style={{ padding: '20px'}}>
        <Routes>
          {/* Halaman utama daftar mahasiswa */}
          <Route path="/" element={<MahasiswaList/>} />

          {/* Halaman detail mahasiswa */}
          <Route path="/mahasiswa/:id" element={<MahasiswaDetail/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
                            