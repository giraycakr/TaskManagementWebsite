// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Auth utility functions
const AuthUtils = {
    // Set token to localStorage
    setToken(token) {
        localStorage.setItem('authToken', token);
    },

    // Get token from localStorage
    getToken() {
        return localStorage.getItem('authToken');
    },

    // Remove token from localStorage
    removeToken() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    },

    // Set current user data
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    // Get current user data
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    },

    // Make authenticated API request
    async makeAuthenticatedRequest(url, options = {}) {
        const token = this.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(url, {
            ...options,
            headers
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Şifre görünürlüğü toggle (mevcut kod korunuyor)
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });

    // Login form submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form submit
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Forgot password form submit
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
});

// Login handler
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password) {
        alert('Lütfen tüm alanları doldurun');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Başarılı giriş
            AuthUtils.setToken(data.token);
            AuthUtils.setCurrentUser(data.user);

            // Rol bazlı yönlendirme
            redirectBasedOnRole(data.user.role);
        } else {
            alert(data.message || 'Giriş başarısız');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    }
}

// Register handler
async function handleRegister(e) {
    e.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        jobTitle: document.getElementById('jobTitle').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            alert('Kayıt işlemi başarılı! Giriş yapabilirsiniz.');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Kayıt başarısız');
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    }
}

// Forgot password handler
async function handleForgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            // Form elementini gizle
            e.target.style.display = 'none';

            // Başarı mesajını göster
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-4';
            successMessage.innerHTML = `
        <h5 class="mb-3">Şifre sıfırlama bağlantısı gönderildi!</h5>
        <p>${email} adresine şifre sıfırlama bağlantısı gönderdik. Lütfen e-posta kutunuzu kontrol edin.</p>
        <p class="mb-0">E-posta gelmediyse, spam klasörünü kontrol etmeyi unutmayın.</p>
      `;

            e.target.parentNode.insertBefore(successMessage, e.target.nextSibling);
        } else {
            alert(data.message || 'İşlem başarısız');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        alert('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    }
}

// Rol bazlı yönlendirme (mevcut kod korunuyor)
function redirectBasedOnRole(role) {
    switch(role) {
        case 'admin':
            window.location.href = './dashboard/admin.html';
            break;
        case 'manager':
            window.location.href = './dashboard/manager.html';
            break;
        case 'member':
            window.location.href = './dashboard/member.html';
            break;
        default:
            window.location.href = './dashboard/member.html';
    }
}

// Check if user is logged in
function isLoggedIn() {
    return !!AuthUtils.getToken();
}

// Logout function
// main.js'te
async function logout() {
    try {
        await AuthUtils.makeAuthenticatedRequest(`${API_BASE_URL}/auth/logout`, {
            method: 'POST'
        });
    } catch (error) {
        console.log('Logout API error:', error);
    } finally {
        AuthUtils.removeToken();
        // Sayfanın konumuna göre doğru path'i kullan
        const currentPath = window.location.pathname;
        if (currentPath.includes('/dashboard/')) {
            window.location.href = '../index.html';
        } else if (currentPath.includes('/users/') || currentPath.includes('/projects/') || currentPath.includes('/tasks/')) {
            window.location.href = '../index.html';
        } else {
            window.location.href = './index.html';
        }
    }
}