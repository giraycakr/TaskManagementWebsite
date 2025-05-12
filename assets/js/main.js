// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Auth utility functions (auth.js'den buraya taşıdık)
const AuthUtils = {
    setToken(token) {
        localStorage.setItem('authToken', token);
    },

    getToken() {
        return localStorage.getItem('authToken');
    },

    removeToken() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    },

    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    },

    async makeAuthenticatedRequest(url, options = {}) {
        const token = this.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        // Token geçersizse login'e yönlendir
        if (response.status === 401) {
            this.removeToken();
            window.location.href = '/index.html';
            return;
        }

        return response;
    }
};

// Sayfa yüklendiğinde çalışacak genel işlemler
document.addEventListener('DOMContentLoaded', function() {
    // Giriş kontrolü
    const token = AuthUtils.getToken();
    const currentUser = AuthUtils.getCurrentUser();

    // Dashboard sayfalarında giriş kontrolü
    if (window.location.pathname.includes('/dashboard/') ||
        window.location.pathname.includes('/users/') ||
        window.location.pathname.includes('/projects/') ||
        window.location.pathname.includes('/tasks/')) {

        if (!token || !currentUser) {
            window.location.href = '/index.html';
            return;
        }
    }

    // Sidebar toggle işlevi
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');

            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('expanded');
            }
        });
    }

    // Çıkış işlevi
    document.addEventListener('DOMContentLoaded', function() {
        // Çıkış işlevi
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Event'in yayılmasını engelle

                // Confirm dialog
                if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
                    logout();
                }
            });
        }

    // Kullanıcı profil bilgisini güncelle
    updateUserProfile();

    // Rol bazlı menü görünürlüğünü ayarla
    updateMenuVisibility();

    // Mobil cihazlarda otomatik sidebar collapse
    if (window.innerWidth <= 768) {
        sidebar?.classList.add('collapsed');
    }
});

// Kullanıcı profil bilgisini güncelle
function updateUserProfile() {
    const profileNameElement = document.querySelector('.user-name');
    const profileRoleElement = document.querySelector('.user-role');
    const profileImgElement = document.querySelector('.profile-img span');

    if (profileNameElement && profileRoleElement && profileImgElement) {
        const currentUser = AuthUtils.getCurrentUser();

        if (currentUser) {
            const formattedName = `${currentUser.firstName} ${currentUser.lastName}`;

            let formattedRole = 'Kullanıcı';
            switch(currentUser.role) {
                case 'admin':
                    formattedRole = 'Yönetici';
                    break;
                case 'manager':
                    formattedRole = 'Proje Yöneticisi';
                    break;
                case 'member':
                    formattedRole = 'Ekip Üyesi';
                    break;
            }

            profileNameElement.textContent = formattedName;
            profileRoleElement.textContent = formattedRole;
            profileImgElement.textContent = currentUser.firstName.charAt(0);
        }
    }
}

// Rol bazlı menü görünürlüğü
function updateMenuVisibility() {
    const currentUser = AuthUtils.getCurrentUser();

    if (!currentUser) {
        window.location.href = '/index.html';
        return;
    }

    // Kullanıcı yönetimi linkini sadece admin görebilir
    const userManagementLink = document.querySelector('.menu-item a[href="../users/list.html"]')?.parentElement;

    if (userManagementLink && currentUser.role !== 'admin') {
        userManagementLink.style.display = 'none';
    }

    // Rol bazlı sayfa erişim kontrolü
    const currentPath = window.location.pathname;

    if (currentPath.includes('/dashboard/')) {
        const validPaths = {
            'admin': ['admin.html'],
            'manager': ['manager.html'],
            'member': ['member.html']
        };

        const allowedPaths = validPaths[currentUser.role] || [];
        const isAllowed = allowedPaths.some(path => currentPath.includes(path));

        if (!isAllowed) {
            window.location.href = `${currentUser.role}.html`;
        }
    }
}

// Çıkış fonksiyonu
// Çıkış fonksiyonu
async function logout() {
    try {
        // API'de logout endpoint'ini çağır
        await AuthUtils.makeAuthenticatedRequest(`${API_BASE_URL}/auth/logout`, {
            method: 'POST'
        });
    } catch (error) {
        console.log('Logout API error:', error);
    } finally {
        // Her durumda local storage'ı temizle
        AuthUtils.removeToken();

        // WebStorm için doğru yol
        const currentPath = window.location.pathname;

        if (currentPath.includes('/dashboard/')) {
            // Dashboard'dan çıkış
            window.location.href = '../index.html';
        } else if (currentPath.includes('/users/') || currentPath.includes('/projects/') || currentPath.includes('/tasks/')) {
            // Diğer sayfalardan çıkış
            window.location.href = '../index.html';
        } else {
            // Index sayfasından çıkış (tekrar index'e gitme)
            window.location.reload();
        }
    }
}

// Format Date utility
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
}

// Format DateTime utility
function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR');
}

// Get priority badge HTML
function getPriorityBadge(priority) {
    const priorities = {
        'high': { class: 'bg-danger', text: 'Yüksek' },
        'medium': { class: 'bg-warning', text: 'Orta' },
        'low': { class: 'bg-info', text: 'Düşük' }
    };

    const priorityInfo = priorities[priority] || priorities['medium'];
    return `<span class="badge ${priorityInfo.class}">${priorityInfo.text}</span>`;
}

// Get status badge HTML
function getStatusBadge(status, type = 'task') {
    let statusConfig = {};

    if (type === 'task') {
        statusConfig = {
            'pending': { class: 'bg-secondary', text: 'Beklemede' },
            'in_progress': { class: 'bg-warning', text: 'Devam Ediyor' },
            'completed': { class: 'bg-success', text: 'Tamamlandı' },
            'cancelled': { class: 'bg-danger', text: 'İptal' }
        };
    } else if (type === 'project') {
        statusConfig = {
            'active': { class: 'bg-success', text: 'Aktif' },
            'in_progress': { class: 'bg-warning', text: 'Devam Ediyor' },
            'completed': { class: 'bg-success', text: 'Tamamlandı' },
            'on_hold': { class: 'bg-danger', text: 'Beklemede' }
        };
    }

    const statusInfo = statusConfig[status] || statusConfig['pending'];
    return `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
}

// Format progress bar HTML
function getProgressBar(progress, size = 'normal') {
    const height = size === 'small' ? '5px' : '8px';
    const progressClass = progress < 30 ? 'bg-danger' :
        progress < 70 ? 'bg-warning' : 'bg-success';

    return `
    <div class="progress" style="height: ${height};">
      <div class="progress-bar ${progressClass}" role="progressbar" 
           style="width: ${progress}%;" 
           aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
      </div>
    </div>
  `;
}

// Show loading spinner
function showLoading(container) {
    if (container) {
        container.innerHTML = `
      <div class="d-flex justify-content-center p-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    `;
    }
}

// Show error message
function showError(container, message = 'Bir hata oluştu') {
    if (container) {
        container.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle"></i> ${message}
      </div>
    `;
    }
}

// Show empty state
function showEmpty(container, message = 'Veri bulunamadı') {
    if (container) {
        container.innerHTML = `
      <div class="text-center p-4">
        <i class="bi bi-inbox" style="font-size: 3rem; color: #dee2e6;"></i>
        <p class="text-muted mt-2">${message}</p>
      </div>
    `;
    }
}