// Ana JavaScript dosyası - Dashboard ve diğer sayfalar için ortak işlevler

document.addEventListener('DOMContentLoaded', function() {
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
            // LocalStorage'dan kullanıcı bilgilerini temizle
            localStorage.removeItem('currentUser');
            // Login sayfasına yönlendir
            window.location.href = '../index.html';
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
    const userManagementLink = document.querySelector('.menu-item a[href="../users/list.html"]')?.parentElement;

    if (userManagementLink) {
        // Sadece admin kullanıcı yönetimini görebilir
        if (currentUser.role !== 'admin') {
            userManagementLink.style.display = 'none';
        }
    }

    // Rol bazlı dashboard yönlendirmesi (eğer kullanıcı direkt admin.html gibi bir sayfaya girmeye çalışırsa)
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
            window.location.href = `${currentUser.role}.html`;
        }
    }
}