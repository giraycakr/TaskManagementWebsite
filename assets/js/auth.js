// Kimlik doğrulama ile ilgili JavaScript işlevleri

document.addEventListener('DOMContentLoaded', function() {
    // Şifre görünürlüğü toggle
    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordField = document.getElementById('password');
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
    }

    // Login form submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Basit doğrulama
            if (!email || !password) {
                alert('Lütfen tüm alanları doldurun');
                return;
            }

            // Normalde burada bir API'ye istek atardık, şimdilik örnek kullanıcıları kontrol edelim
            if (authenticateUser(email, password)) {
                // Başarılı giriş
                redirectBasedOnRole(email);
            } else {
                alert('Geçersiz email veya şifre');
            }
        });
    }
});

// Örnek kullanıcılar (gerçek projede bu bilgiler veritabanından gelir)
const users = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'manager@example.com', password: 'manager123', role: 'manager' },
    { email: 'user@example.com', password: 'user123', role: 'member' }
];

// Kullanıcı kimlik doğrulama
function authenticateUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        // Kullanıcı bilgilerini localStorage'a kaydedelim (gerçek projede JWT token kullanılır)
        localStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            role: user.role
        }));
        return true;
    }
    return false;
}

// Rol bazlı yönlendirme
function redirectBasedOnRole(email) {
    const user = users.find(u => u.email === email);

    if (user) {
        switch(user.role) {
            case 'admin':
                window.location.href = 'dashboard/admin.html';
                break;
            case 'manager':
                window.location.href = 'dashboard/manager.html';
                break;
            case 'member':
                window.location.href = 'dashboard/member.html';
                break;
            default:
                window.location.href = 'dashboard/member.html';
        }
    }
}