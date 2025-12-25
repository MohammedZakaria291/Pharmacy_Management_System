// script.js — manages medicines list using localStorage

const STORAGE_KEY = 'pharma_medicines_v1';

function loadMedicines() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse medicines from storage', e);
    return [];
  }
}

function saveMedicines(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function formatDateForDisplay(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString();
  } catch (e) {
    return iso;
  }
}

function renderMedicines() {
  const tbody = document.getElementById('medicinesTbody');
  const list = loadMedicines();
  tbody.innerHTML = '';

  if (list.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.style.textAlign = 'center';
    td.style.padding = '18px';
    td.textContent = 'No medicines yet. Add a medicine using the form above.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  list.forEach(item => {
    const tr = document.createElement('tr');
    if (item.expired) tr.classList.add('danger-row');
    else if (item.warning) tr.classList.add('warning-row');

    const nameTd = document.createElement('td');
    nameTd.textContent = item.name;

    const priceTd = document.createElement('td');
    priceTd.textContent = item.price;

    const qtyTd = document.createElement('td');
    qtyTd.textContent = item.quantity;

    const expTd = document.createElement('td');
    expTd.textContent = formatDateForDisplay(item.expiryDate);

    const manTd = document.createElement('td');
    manTd.textContent = item.supplier || '';

    const actionsTd = document.createElement('td');
    actionsTd.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'action-edit';
    editBtn.textContent = 'Edit';
    editBtn.dataset.id = item.id;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'action-delete';
    delBtn.textContent = 'Delete';
    delBtn.dataset.id = item.id;

    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(delBtn);

    tr.appendChild(nameTd);
    tr.appendChild(priceTd);
    tr.appendChild(qtyTd);
    tr.appendChild(expTd);
    tr.appendChild(manTd);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);
  });
}

function showSuccess(msg = 'Medicine updated successfully!') {
  const el = document.getElementById('successMessage');
  el.textContent = msg;
  el.style.display = 'inline-block';
  setTimeout(() => { el.style.display = 'none'; }, 2500);
}

function clearForm() {
  const form = document.getElementById('medicineForm');
  form.reset();
  document.getElementById('medicineId').value = '';
}

function handleFormSubmit(ev) {
  ev.preventDefault();
  const idField = document.getElementById('medicineId');
  const id = idField.value || null;
  const name = document.getElementById('medicineName').value.trim();
  const category = document.getElementById('category').value.trim();
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;
  const expiryDate = document.getElementById('expiryDate').value;
  const supplier = document.getElementById('supplier').value.trim();

  if (!name) {
    const err = document.getElementById('validation-error-message');
    err.textContent = 'Medicine name is required';
    err.style.display = 'inline-block';
    setTimeout(() => err.style.display = 'none', 3000);
    return;
  }

  const list = loadMedicines();

  if (id) {
    // update existing
    const idx = list.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        name, category, price, quantity, expiryDate, supplier,
        warning: false,
        expired: false
      };
    }
    saveMedicines(list);
    renderMedicines();
    clearForm();
    showSuccess('Medicine updated successfully!');
    return;
  }

  // create new
  const newItem = {
    id: Date.now().toString(),
    name,
    category,
    price,
    quantity,
    expiryDate,
    supplier,
    createdAt: new Date().toISOString(),
    warning: false,
    expired: false
  };
  list.unshift(newItem);
  saveMedicines(list);
  renderMedicines();
  clearForm();
  showSuccess('Medicine added successfully!');
}

function handleTableClick(e) {
  const target = e.target;
  if (target.matches('.action-edit')) {
    const id = target.dataset.id;
    editMedicine(id);
    return;
  }
  if (target.matches('.action-delete')) {
    const id = target.dataset.id;
    deleteMedicine(id);
    return;
  }
}

function editMedicine(id) {
  const list = loadMedicines();
  const item = list.find(i => String(i.id) === String(id));
  if (!item) return;
  document.getElementById('medicineId').value = item.id;
  document.getElementById('medicineName').value = item.name;
  document.getElementById('category').value = item.category || '';
  document.getElementById('price').value = item.price || '';
  document.getElementById('quantity').value = item.quantity || '';
  document.getElementById('expiryDate').value = item.expiryDate || '';
  document.getElementById('supplier').value = item.supplier || '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteMedicine(id) {
  if (!confirm('Delete this medicine?')) return;
  let list = loadMedicines();
  list = list.filter(i => String(i.id) !== String(id));
  saveMedicines(list);
  renderMedicines();
}

function wireUp() {
  const form = document.getElementById('medicineForm');
  form.addEventListener('submit', handleFormSubmit);

  const tbody = document.getElementById('medicinesTbody');
  tbody.addEventListener('click', handleTableClick);

  // Add button scrolls to the form for convenience
  const addBtn = document.querySelector('.add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      clearForm();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  renderMedicines();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireUp);
} else {
  wireUp();
}
