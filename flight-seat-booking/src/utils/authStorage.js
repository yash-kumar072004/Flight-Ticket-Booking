// Storage management for SkyBook user authentication

const USERS_KEY = "skybook_users";
const CURRENT_USER_KEY = "skybook_current_user";

// Default demo user for easy testing
const DEFAULT_USERS = [
  {
    id: "user-1",
    name: "Yash Kumar",
    email: "yash@example.com",
    phone: "+91 98765 43210",
    password: "password123",
    avatar: "👨‍✈️",
    createdAt: "2026-03-01T10:00:00.000Z"
  }
];

export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users:", error);
    return DEFAULT_USERS;
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

export function registerUser(userData) {
  const users = getUsers();
  const existing = users.find(
    (u) => u.email.toLowerCase() === userData.email.toLowerCase().trim()
  );

  if (existing) {
    return { success: false, message: "An account with this email already exists." };
  }

  const newUser = {
    id: "user-" + Date.now(),
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    phone: userData.phone?.trim() || "",
    password: userData.password,
    avatar: userData.gender === "Female" ? "👩‍💼" : "👨‍💼",
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

export function authenticateUser(email, password) {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) {
    return { success: false, message: "Invalid email or password." };
  }

  setCurrentUser(user);
  return { success: true, user };
}

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading current user:", error);
    return null;
  }
}

export function setCurrentUser(user) {
  try {
    if (user) {
      const safeUser = { ...user };
      delete safeUser.password;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error("Error updating current user session:", error);
  }
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
