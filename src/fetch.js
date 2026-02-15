// ============================
// Fetch API page logic
// ============================

// عناصر الصفحة
const btnGetAll = document.querySelector('#btn-get-all');
const btnClear = document.querySelector('#btn-clear');
const itemsList = document.querySelector('#items-list');
const toastEl = document.querySelector('#toast');

const getByIdForm = document.querySelector('#get-by-id-form');
const deleteByIdForm = document.querySelector('#delete-by-id-form');
const singleItemBox = document.querySelector('#single-item');

const addForm = document.querySelector('#add-form');
const updateForm = document.querySelector('#update-form');

// ملاحظة: بفضل vite proxy تقدر تستخدم /api مباشرة
const BASE_URL = '/api/items';

// Toast صغير
let toastTimer = null;
function toast(message, type = 'info') {
  if (!toastEl) return;

  toastEl.textContent = message;
  toastEl.className = `toast toast-${type}`;
  toastEl.style.opacity = '1';

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.style.opacity = '0';
  }, 2500);
}

// تحويل الرد إلى JSON حتى لو صار خطأ
async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// رسم قائمة العناصر (بدون undefined)
function renderItems(items) {
  if (!itemsList) return;

  if (!items || items.length === 0) {
    itemsList.innerHTML = `<p class="muted">No items yet.</p>`;
    return;
  }

  itemsList.innerHTML = items
    .map((item) => {
      const weightText =
        item.weight !== undefined && item.weight !== null && item.weight !== ''
          ? ` (${item.weight})`
          : '';

      return `
      <div class="item">
        <div>
          <strong>#${item.id}</strong> — ${item.name}${weightText}
        </div>
        <div class="item-actions">
          <button class="btn btn-small" data-action="info" data-id="${item.id}">Info</button>
          <button class="btn btn-small btn-danger" data-action="delete" data-id="${item.id}">Delete</button>
        </div>
      </div>
    `;
    })
    .join('');
}

// GET all
async function getAllItems() {
  try {
    const res = await fetch(BASE_URL);
    const data = await readJsonSafe(res);

    console.log('GET all items:', data);

    if (!res.ok) {
      toast(data?.message || 'Failed to load items', 'error');
      return;
    }

    renderItems(data);
    toast('Loaded items', 'success');
  } catch (err) {
    console.error('GET all error:', err);
    toast('Network error while loading items', 'error');
  }
}

// GET by id
async function getItemById(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    const data = await readJsonSafe(res);

    console.log(`GET item ${id}:`, data);

    if (!res.ok) {
      if (singleItemBox) singleItemBox.textContent = '';
      toast(data?.message || `Item ${id} not found`, 'error');
      return;
    }

    if (singleItemBox) singleItemBox.textContent = JSON.stringify(data, null, 2);
    toast(`Loaded item #${id}`, 'success');
  } catch (err) {
    console.error('GET by id error:', err);
    toast('Network error while loading item', 'error');
  }
}

// DELETE by id
async function deleteItemById(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    const data = await readJsonSafe(res);

    console.log(`DELETE item ${id}:`, data);

    if (!res.ok) {
      toast(data?.message || `Failed to delete item ${id}`, 'error');
      return;
    }

    toast(`Deleted item #${id}`, 'success');
    await getAllItems();
  } catch (err) {
    console.error('DELETE error:', err);
    toast('Network error while deleting item', 'error');
  }
}

// POST add item
async function addItem(payload) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await readJsonSafe(res);
    console.log('POST add item:', data);

    if (!res.ok) {
      toast(data?.message || 'Failed to add item', 'error');
      return;
    }

    toast('Item added', 'success');
    await getAllItems();
  } catch (err) {
    console.error('POST error:', err);
    toast('Network error while adding item', 'error');
  }
}

// PUT update item
async function updateItem(id, payload) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await readJsonSafe(res);
    console.log(`PUT update item ${id}:`, data);

    if (!res.ok) {
      toast(data?.message || `Failed to update item ${id}`, 'error');
      return;
    }

    toast(`Item #${id} updated`, 'success');
    await getAllItems();
  } catch (err) {
    console.error('PUT error:', err);
    toast('Network error while updating item', 'error');
  }
}

// أحداث الأزرار
if (btnGetAll) btnGetAll.addEventListener('click', getAllItems);

if (btnClear)
  btnClear.addEventListener('click', () => {
    if (itemsList) itemsList.innerHTML = `<p class="muted">Cleared.</p>`;
    if (singleItemBox) singleItemBox.textContent = '';
    toast('Cleared view', 'info');
  });

// Events للـ forms
if (getByIdForm) {
  getByIdForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Number(document.querySelector('#get-id')?.value);
    if (!id) return toast('Enter a valid id', 'error');
    getItemById(id);
  });
}

if (deleteByIdForm) {
  deleteByIdForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Number(document.querySelector('#delete-id')?.value);
    if (!id) return toast('Enter a valid id', 'error');
    deleteItemById(id);
  });
}

if (addForm) {
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#add-name')?.value?.trim();
    const weight = Number(document.querySelector('#add-weight')?.value);

    // الاسم مهم. الوزن اختياري (حسب backend)
    if (!name) return toast('Fill name', 'error');

    const payload = { name };
    if (weight) payload.weight = weight;

    addItem(payload);
    addForm.reset();
  });
}

if (updateForm) {
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Number(document.querySelector('#update-id')?.value);
    const name = document.querySelector('#update-name')?.value?.trim();
    const weight = Number(document.querySelector('#update-weight')?.value);

    if (!id || !name) return toast('Fill id and name', 'error');

    const payload = { name };
    if (weight) payload.weight = weight;

    updateItem(id, payload);
    updateForm.reset();
  });
}

// Events للأزرار داخل القائمة (Info/Delete)
if (itemsList) {
  itemsList.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);

    if (!id) return;

    if (action === 'info') getItemById(id);
    if (action === 'delete') deleteItemById(id);
  });
}

getAllItems();