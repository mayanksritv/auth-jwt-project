const $ = (selector) => document.querySelector(selector);

const message = $('#message');
const statusPill = $('#statusPill');
const signedOut = $('#signedOut');
const profile = $('#profile');

function showMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function setSession(user) {
  $('#profileName').textContent = user.name;
  $('#profileEmail').textContent = user.email;
  $('#profileId').textContent = user.id;
  $('#profileCreated').textContent = new Date(user.createdAt).toLocaleString();
  $('#avatar').textContent = user.name.charAt(0).toUpperCase();

  signedOut.classList.add('hidden');
  profile.classList.remove('hidden');
  statusPill.className = 'status online';
  statusPill.textContent = 'Signed in';
}

function clearSession() {
  profile.classList.add('hidden');
  signedOut.classList.remove('hidden');
  statusPill.className = 'status offline';
  statusPill.textContent = 'Signed out';
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}

async function loadProfile(silent = false) {
  try {
    const data = await request('/api/protected/profile');
    setSession(data.user);
    if (!silent) showMessage('Protected endpoint verified.', 'success');
  } catch {
    clearSession();
  }
}

$('.tabs').addEventListener('click', (event) => {
  const tab = event.target.closest('.tab');
  if (!tab) return;

  document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
  document.querySelectorAll('.form').forEach((form) => form.classList.remove('active'));

  tab.classList.add('active');
  $(`#${tab.dataset.tab}Form`).classList.add('active');
  showMessage('');
});

$('#loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('Signing in…');

  try {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: $('#loginEmail').value,
        password: $('#loginPassword').value
      })
    });

    setSession(data.user);
    showMessage(data.message, 'success');
    event.target.reset();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

$('#registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('Creating account…');

  try {
    const data = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: $('#registerName').value,
        email: $('#registerEmail').value,
        password: $('#registerPassword').value
      })
    });

    setSession(data.user);
    showMessage(data.message, 'success');
    event.target.reset();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

$('#logoutBtn').addEventListener('click', async () => {
  try {
    await request('/api/auth/logout', { method: 'POST' });
    clearSession();
    showMessage('Logged out successfully.', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

loadProfile(true);
