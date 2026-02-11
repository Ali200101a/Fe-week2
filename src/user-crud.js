// عنوان الـ API للمستخدمين
const apiUrl = '/api/users';

// دالة لإنشاء عنصر HTML لكل مستخدم
function createUserElement(user) {
  // إنشاء عنصر div جديد
  const div = document.createElement('div');
  div.className = 'user-item';
  
  // إضافة محتوى HTML مع اسم المستخدم وأزرار التعديل والحذف
  div.innerHTML = `
    <span class="user-name">${user.username} (${user.email})</span>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;

  // عند الضغط على زر التعديل
  div.querySelector('.edit-btn').onclick = function() {
    // طلب اسم مستخدم جديد من المستخدم
    const newUsername = prompt('Edit username:', user.username);
    // إذا أدخل اسم جديد ومختلف، استدعاء دالة التعديل
    if (newUsername && newUsername !== user.username) {
      editUser(user.id, { username: newUsername });
    }
  };

  // عند الضغط على زر الحذف
  div.querySelector('.delete-btn').onclick = function() {
    // طلب تأكيد الحذف
    if (confirm('Delete user?')) {
      deleteUser(user.id);
    }
  };

  return div;
}

// دالة لعرض قائمة المستخدمين في الصفحة
function renderUsers(users) {
  // الحصول على عنصر القائمة
  const list = document.getElementById('user-list');
  // مسح المحتوى السابق
  list.innerHTML = '';
  
  // إذا لم يوجد مستخدمون، عرض رسالة
  if (!users || users.length === 0) {
    list.innerHTML = '<p>No users found</p>';
    return;
  }
  
  // إضافة كل مستخدم إلى القائمة
  users.forEach(user => {
    list.appendChild(createUserElement(user));
  });
}

// دالة لجلب المستخدمين من الـ API
function fetchUsers() {
  console.log('Fetching users from:', apiUrl);
  
  // إرسال طلب GET للحصول على المستخدمين
  fetch(apiUrl)
    .then(res => {
      console.log('Response status:', res.status);
      // إذا فشل الطلب، رمي خطأ
      if (!res.ok) throw new Error('HTTP ' + res.status);
      // تحويل الرد إلى JSON
      return res.json();
    })
    .then(users => {
      console.log('Users:', users);
      // عرض المستخدمين في الصفحة
      renderUsers(users);
    })
    .catch(err => {
      // عرض رسالة خطأ إذا فشل الجلب
      console.error('Fetch error:', err);
      alert('Failed to load users: ' + err.message);
    });
}

// دالة لتعديل مستخدم
function editUser(id, data) {
  // إرسال طلب PUT لتعديل المستخدم
  fetch(apiUrl + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => {
      console.log('Edit response:', res.status);
      // إذا نجح، إعادة تحميل القائمة
      if (res.ok) fetchUsers();
      else alert('Edit failed: HTTP ' + res.status);
    })
    .catch(err => console.error('Edit error:', err));
}

// دالة لحذف مستخدم
function deleteUser(id) {
  // إرسال طلب DELETE لحذف المستخدم
  fetch(apiUrl + '/' + id, { method: 'DELETE' })
    .then(res => {
      console.log('Delete response:', res.status);
      // إذا نجح، إعادة تحميل القائمة
      if (res.ok) fetchUsers();
      else alert('Delete failed: HTTP ' + res.status);
    })
    .catch(err => console.error('Delete error:', err));
}

// دالة لإضافة مستخدم جديد
function addUser(userData) {
  console.log('Adding user:', userData);
  
  // إرسال طلب POST لإضافة مستخدم جديد
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
    .then(res => {
      console.log('Add response:', res.status);
      // تحويل الرد إلى JSON مع حالة النجاح
      return res.json().then(data => ({ ok: res.ok, data }));
    })
    .then(({ ok, data }) => {
      console.log('Backend response:', data);
      if (ok) {
        // عرض رسالة نجاح وتحديث القائمة
        alert('User added!');
        fetchUsers();
      } else {
        // عرض رسالة الخطأ من الـ backend
        alert('Add failed: ' + (data.message || data.error || JSON.stringify(data)));
      }
    })
    .catch(err => console.error('Add error:', err));
}

// عند الضغط على زر تحميل المستخدمين
document.getElementById('load-users').onclick = fetchUsers;

// عند إرسال نموذج إضافة مستخدم
document.getElementById('add-user-form').addEventListener('submit', function(event) {
  // منع إعادة تحميل الصفحة
  event.preventDefault();
  
  // الحصول على قيم الحقول
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // إضافة المستخدم
  addUser({ username, email, password });
  
  // مسح النموذج بعد الإرسال
  document.getElementById('username').value = '';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
});
