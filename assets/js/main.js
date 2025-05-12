// Ana JavaScript dosyası - Dashboard ve diğer sayfalar için ortak işlevler

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components first
    if (window.ComponentLoader) {
        new ComponentLoader();
    }

    // Sidebar toggle işlevi
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');

            // Mobil görünümde farklı davranış
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('expanded');
            }
        });
    }

    // Çıkış işlevi
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
                // LocalStorage'dan kullanıcı bilgilerini temizle
                localStorage.removeItem('currentUser');
                // Login sayfasına yönlendir
                window.location.href = '../index.html';
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

    // Profile butonuna click event ekle
    const userProfile = document.querySelector('.user-profile');
    if (userProfile && !userProfile.onclick) {
        userProfile.style.cursor = 'pointer';
        userProfile.addEventListener('click', function() {
            // Get current path to determine correct profile path
            const currentPath = window.location.pathname;
            let profilePath = '../profile/index.html';

            if (currentPath.includes('/dashboard/')) {
                profilePath = '../profile/index.html';
            } else if (currentPath.includes('/profile/')) {
                profilePath = './index.html';
            }

            window.location.href = profilePath;
        });
    }
});

// Kullanıcı profil bilgisini localStorage'dan al ve görüntüle
function updateUserProfile() {
    const profileNameElement = document.querySelector('.user-name');
    const profileRoleElement = document.querySelector('.user-role');
    const profileImgElement = document.querySelector('.profile-img span');

    if (profileNameElement && profileRoleElement && profileImgElement) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser) {
            // Email'den isim kısmını al (@ işaretinden öncesi)
            const userName = currentUser.email.split('@')[0];

            // İsmin ilk harfini büyük yap
            const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

            // Rolü formatla
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
            profileImgElement.textContent = formattedName.charAt(0);
        }
    }
}

// Kullanıcı rolüne göre menü öğelerinin görünürlüğünü ayarla
function updateMenuVisibility() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        // Kullanıcı girişi yapılmamışsa login sayfasına yönlendir
        window.location.href = '../index.html';
        return;
    }

    // Rol bazlı menü görünürlüğü
    const userManagementLink = document.querySelector('.menu-item a[href="../users/list.html"], .menu-item a[href="./users/list.html"]')?.parentElement;

    if (userManagementLink) {
        // Sadece admin kullanıcı yönetimini görebilir
        if (currentUser.role !== 'admin') {
            userManagementLink.style.display = 'none';
        }
    }

    // Rol bazlı dashboard yönlendirmesi
    const currentPath = window.location.pathname;

    if (currentPath.includes('/dashboard/')) {
        const validPaths = {
            'admin': ['admin.html'],
            'manager': ['manager.html'],
            'member': ['member.html']
        };

        // Kullanıcının rolüne göre izin verilen sayfaları kontrol et
        const allowedPaths = validPaths[currentUser.role] || [];
        const isAllowed = allowedPaths.some(path => currentPath.includes(path));

        // Kullanıcı yetkisiz bir sayfaya erişmeye çalışıyorsa kendi dashboard'una yönlendir
        if (!isAllowed) {
            setTimeout(() => {
                window.location.href = `${currentUser.role}.html`;
            }, 100);
        }
    }
}

// Yardımcı fonksiyon: Geçerli kullanıcının rolünü kontrol et
function getCurrentUserRole() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.role : null;
}

// Yardımcı fonksiyon: Kullanıcının belirli bir yetkisi var mı kontrol et
function hasPermission(action) {
    const userRole = getCurrentUserRole();

    const permissions = {
        'admin': ['all'],
        'manager': ['manage_projects', 'manage_tasks', 'view_all_projects', 'view_all_tasks'],
        'member': ['view_own_projects', 'view_own_tasks', 'update_own_tasks']
    };

    const userPermissions = permissions[userRole] || [];
    return userPermissions.includes('all') || userPermissions.includes(action);
}

// Rol bazlı UI elementlerini gizle/göster
function updateUIBasedOnRole() {
    const userRole = getCurrentUserRole();

    // Hide admin-only elements
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    if (userRole !== 'admin') {
        adminOnlyElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    // Hide admin/manager-only elements
    const adminManagerOnlyElements = document.querySelectorAll('.admin-manager-only');
    if (userRole !== 'admin' && userRole !== 'manager') {
        adminManagerOnlyElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}

// Page-specific initialization
window.addEventListener('load', function() {
    updateUIBasedOnRole();
});

// Utility function to set active menu item
function setActiveMenuItem(pageName) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    let activeItem = null;
    switch(pageName) {
        case 'dashboard':
            activeItem = document.querySelector('.menu-item:first-child');
            break;
        case 'projects':
        case 'my-projects':
            activeItem = document.querySelector('.menu-item:nth-child(2)');
            break;
        case 'tasks':
        case 'my-tasks':
            activeItem = document.querySelector('.menu-item:nth-child(3)');
            break;
        case 'users':
            activeItem = document.querySelector('#usersMenuItem');
            break;
    }

    if (activeItem) {
        activeItem.classList.add('active');
    }
}