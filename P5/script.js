// Marcelo Jonathan Holle - 411222083
const API_URL = 'http://localhost:3000/api/motorcycles';
const motorcyclesTableBody = document.getElementById('motorcyclesTableBody');
const motorcycleModal = new bootstrap.Modal(document.getElementById('motorcycleModal'));
const motorcycleForm = document.getElementById('motorcycleForm');
const motorcycleIdInput = document.getElementById('motorcycleId');
const modalTitle = document.getElementById('motorcycleModalLabel');
const alertMessage = document.getElementById('alertMessage');

async function fetchMotorcycles() {
  try {
    const response = await fetch(API_URL);
    const motorcycles = await response.json();
    renderMotorcycles(motorcycles);
  } catch {
    motorcyclesTableBody.innerHTML = '<tr><td colspan="4" class="text-danger text-center">Gagal memuat data.</td></tr>';
  }
}

function renderMotorcycles(motorcycles) {
  motorcyclesTableBody.innerHTML = '';
  if (!motorcycles.length) return motorcyclesTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Belum ada data</td></tr>';
  motorcycles.forEach(motorcycle => {
    const row = motorcyclesTableBody.insertRow();
    row.insertCell().textContent = motorcycle.id;
    row.insertCell().textContent = motorcycle.brand;
    row.insertCell().textContent = motorcycle.model;
    const action = row.insertCell();
    action.innerHTML = `
      <button class="btn btn-sm btn-info me-2" onclick="prepareEdit(${motorcycle.id}, '${motorcycle.brand}', '${motorcycle.model}')">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteMotorcycle(${motorcycle.id}, '${motorcycle.brand}')">Hapus</button>`;
  });
}

motorcycleForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = motorcycleIdInput.value;
  const data = {
    brand: document.getElementById('brand').value,
    model: document.getElementById('model').value
  };
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;
  const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!response.ok) return showAlert('Gagal menyimpan data!', 'danger');
  showAlert('Data berhasil disimpan', 'success');
  motorcycleModal.hide();
  fetchMotorcycles();
});

function prepareCreate() {
  modalTitle.textContent = 'Tambah Motor Baru';
  motorcycleForm.reset();
  motorcycleIdInput.value = '';
}

function prepareEdit(id, brand, model) {
  modalTitle.textContent = 'Edit Motor';
  motorcycleIdInput.value = id;
  document.getElementById('brand').value = brand;
  document.getElementById('model').value = model;
  motorcycleModal.show();
}

async function deleteMotorcycle(id, brand) {
  if (!confirm(`Hapus motor "${brand}"?`)) return;
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (response.status === 204) showAlert('Data berhasil dihapus', 'warning');
  fetchMotorcycles();
}

function showAlert(msg, type) {
  alertMessage.textContent = msg;
  alertMessage.className = `alert alert-${type}`;
  alertMessage.classList.remove('d-none');
  setTimeout(() => alertMessage.classList.add('d-none'), 3000);
}

document.addEventListener('DOMContentLoaded', fetchMotorcycles);