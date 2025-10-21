// src/api/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function registerUser({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getProfile(token) {
  const res = await fetch(`${BASE_URL}/api/protected/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
