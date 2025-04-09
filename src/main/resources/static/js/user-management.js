loadUsers();
document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();


    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        birth: document.getElementById('birth').value
    };

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        loadUsers();
        document.getElementById('addUserForm').reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add user: ' + error.message);
    }
});

// Загрузка списка пользователей
async function loadUsers() {
    const response = await fetch('/api/users');
    const users = await response.json();
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.birth}</td>
            <td>${user.age}</td>
            <td>
                <button onclick="updateUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Удаление пользователя
async function deleteUser(id) {
    if (confirm('Are you sure?')) {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
        loadUsers();
    }
}

// Обновление пользователя (упрощённая версия)
async function updateUser(id) {
    const newName = prompt('Enter new name:');
    const newEmail = prompt('Enter new email:');

    if (newName || newEmail) {
        await fetch(`/api/users/${id}?${newName ? `name=${encodeURIComponent(newName)}` : ''}${newName && newEmail ? '&' : ''}${newEmail ? `email=${encodeURIComponent(newEmail)}` : ''}`, {
            method: 'PUT'
        });
        loadUsers();
    }
}