// --- Konfigurasi API ---
const API_URL = 'http://localhost:3000/api'; // Sesuaikan dengan port backend Anda

// --- Elemen DOM ---
const authSection = document.getElementById('auth-section');
const adminSection = document.getElementById('admin-section');
const bookList = document.getElementById('book-list');
const loginForm = document.getElementById('login-form');
const adminForm = document.getElementById('admin-crud-form');
const authStatus = document.getElementById('auth-status');
const adminMessage = document.getElementById('admin-message');
const logoutButton = document.getElementById('btn-logout');
const registerButton = document.getElementById('btn-register');
const submitButton = document.getElementById('submit-btn');
const cancelButton = document.getElementById('cancel-btn');

// --- Variabel Global ---
let userToken = localStorage.getItem('jwtToken');
let userRole = localStorage.getItem('userRole');

// --- Fungsi Utilitas ---
function updateUI() {
    if (userToken && userRole === 'admin') {
        authSection.classList.remove('hidden');
        adminSection.classList.remove('hidden');
        loginForm.classList.add('hidden');
        logoutButton.classList.remove('hidden');
        authStatus.innerHTML = `Login sebagai: **Admin**`;
    } else if (userToken && userRole === 'user') {
        authSection.classList.remove('hidden');
        adminSection.classList.add('hidden');
        loginForm.classList.add('hidden');
        logoutButton.classList.remove('hidden');
        authStatus.innerHTML = `Login sebagai: User biasa. Tidak ada akses CRUD admin.`;
    } else {
        authSection.classList.remove('hidden');
        adminSection.classList.add('hidden');
        loginForm.classList.remove('hidden');
        logoutButton.classList.add('hidden');
        authStatus.innerHTML = '';
    }
}

/** Mengambil data buku (Akses Publik) */
async function fetchBooks() {
    bookList.innerHTML = '<li>Memuat data buku...</li>';
    try {
        const response = await fetch(`${API_URL}/books`);
        const books = await response.json();
        bookList.innerHTML = '';
        if (books.length === 0) {
            bookList.innerHTML = '<li>Belum ada buku dalam daftar.</li>';
            return;
        }
        books.forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${book.nama_buku}</strong>  
                    (Pengarang: ${book.pengarang}, Tahun: ${book.thn_terbit})
                </div>
                <div class="admin-controls">
                    ${userRole === 'admin' ? `
                        <button onclick="editBook(${book.id}, '${book.nama_buku}', '${book.pengarang}', ${book.thn_terbit})">Edit</button>
                        <button onclick="deleteBook(${book.id})">Hapus</button>
                    ` : ''}
                </div>
            `;
            bookList.appendChild(li);
        });
    } catch (error) {
        bookList.innerHTML = `<li>Gagal memuat buku: ${error.message}</li>`;
        console.error('Fetch error:', error);
    }
}

// --- Otentikasi (Login & Registrasi) ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    await handleAuth('signin', username, password);
});

registerButton.addEventListener('click', async () => {
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    if (!username || !password) {
        authStatus.innerHTML = 'Masukkan username dan password untuk daftar!';
        return;
    }
    await handleAuth('signup', username, password, 'admin');
});

async function handleAuth(endpoint, username, password, role = 'user') {
    try {
        const response = await fetch(`${API_URL}/auth/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });
        const data = await response.json();
        if (!response.ok) {
            authStatus.innerHTML = `Gagal ${endpoint}: ${data.message}`;
            return;
        }
        if (endpoint === 'signin') {
            userToken = data.accessToken;
            userRole = data.role;
            localStorage.setItem('jwtToken', userToken);
            localStorage.setItem('userRole', userRole);
            authStatus.innerHTML = `Login berhasil! Role: ${userRole}`;
            loginForm.reset();
        } else {
            authStatus.innerHTML = `Pendaftaran berhasil. Silakan login.`;
        }
        updateUI();
        fetchBooks();
    } catch (error) {
        authStatus.innerHTML = `Terjadi kesalahan jaringan: ${error.message}`;
        console.error('Auth error:', error);
    }
}

logoutButton.addEventListener('click', () => {
    userToken = null;
    userRole = null;
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    authStatus.innerHTML = 'Berhasil Logout.';
    updateUI();
    fetchBooks();
});

// --- CRUD Admin ---
adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('book-id').value;
    const nama_buku = document.getElementById('nama_buku').value;
    const pengarang = document.getElementById('pengarang').value;
    const thn_terbit = parseInt(document.getElementById('thn_terbit').value);

    const bookData = { nama_buku, pengarang, thn_terbit };

    let method = id ? 'PUT' : 'POST';
    let url = id ? `${API_URL}/books/${id}` : `${API_URL}/books`;
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(bookData)
        });
        const data = await response.json();
        if (!response.ok) {
            adminMessage.innerHTML = `Operasi gagal: ${data.message}`;
            return;
        }
        adminMessage.innerHTML = `Buku berhasil ${id ? 'diupdate' : 'ditambahkan'}!`;
        adminForm.reset();
        cancelEdit();
        fetchBooks();
    } catch (error) {
        adminMessage.innerHTML = `Terjadi kesalahan jaringan: ${error.message}`;
        console.error('CRUD error:', error);
    }
});

function editBook(id, nama_buku, pengarang, thn_terbit) {
    document.getElementById('book-id').value = id;
    document.getElementById('nama_buku').value = nama_buku;
    document.getElementById('pengarang').value = pengarang;
    document.getElementById('thn_terbit').value = thn_terbit;
    submitButton.textContent = 'Simpan Perubahan';
    cancelButton.classList.remove('hidden');
    adminMessage.innerHTML = 'Mode Edit Aktif.';
}

cancelButton.addEventListener('click', cancelEdit);
function cancelEdit() {
    document.getElementById('book-id').value = '';
    adminForm.reset();
    submitButton.textContent = 'Tambah Buku';
    cancelButton.classList.add('hidden');
    adminMessage.innerHTML = '';
}

async function deleteBook(id) {
    if (!confirm('Anda yakin ingin menghapus buku ini?')) return;
    try {
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await response.json();
        if (!response.ok) {
            alert(`Hapus gagal: ${data.message}`);
            return;
        }
        alert('Buku berhasil dihapus!');
        fetchBooks();
    } catch (error) {
        alert(`Terjadi kesalahan jaringan: ${error.message}`);
        console.error('Delete error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    fetchBooks();
});
