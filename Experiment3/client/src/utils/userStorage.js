const STORAGE_KEY = 'jwt_lab_users';

export function getUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function ensureDefaultAccounts() {
  const users = getUsers();

  const adminExists = users.some((user) => user.email && user.email.toLowerCase() === 'admin@example.com');
  const editorExists = users.some((user) => user.email && user.email.toLowerCase() === 'editor@example.com');

  const defaultAccounts = [];

  if (!adminExists) {
    defaultAccounts.push({
      id: crypto.randomUUID(),
      name: 'Administrator',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
  }

  if (!editorExists) {
    defaultAccounts.push({
      id: crypto.randomUUID(),
      name: 'Editor',
      email: 'editor@example.com',
      password: 'editor123',
      role: 'editor',
      createdAt: new Date().toISOString(),
    });
  }

  if (defaultAccounts.length > 0) {
    saveUsers([...defaultAccounts, ...users]);
  }
}

export function registerUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

export function findUserByEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const users = getUsers();
  return users.find((user) => user.email && user.email.toLowerCase() === normalizedEmail) || null;
}

export function updateUser(userId, updatedData) {
  const users = getUsers();
  const nextUsers = users.map((user) => {
    if (user.id !== userId) {
      return user;
    }

    return {
      ...user,
      ...updatedData,
    };
  });

  saveUsers(nextUsers);
  return nextUsers;
}

export function deleteUser(userId) {
  const users = getUsers();
  const filtered = users.filter((user) => user.id !== userId);
  saveUsers(filtered);
  return filtered;
}

ensureDefaultAccounts();
