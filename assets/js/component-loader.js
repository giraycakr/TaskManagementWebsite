// Component Loader - Master Page benzeri yapı için
// Bu dosya HTML dosyalarında ortak component'ları yüklemek için kullanılacak

class ComponentLoader {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadComponents();
        this.updateUIBasedOnRole();
        this.updateNavigation();
    }

    // Component'ları yükle (simüle ediyoruz - gerçek projede include kullanılır)
    async loadComponents() {
        // Footer component
        this.loadFooter();

        // Header component
        this.loadHeader();

        // Sidebar component
        this.loadSidebar();
    }

    loadFooter() {
        const footer = document.querySelector('.dashboard-footer');
        if (footer && !footer.innerHTML.trim()) {
            footer.innerHTML = `
                <p>&copy; 2025 Görev Takip Sistemi. Tüm hakları saklıdır.</p>
            `;
        }
    }

    loadHeader() {
        const header = document.querySelector('.dashboard-header');
        if (header && !header.innerHTML.trim()) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { email: 'admin@example.com', role: 'admin' };
            const userName = currentUser.email.split('@')[0];
            const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

            let roleText = 'Kullanıcı';
            switch(currentUser.role) {
                case 'admin': roleText = 'Yönetici'; break;
                case 'manager': roleText = 'Proje Yöneticisi'; break;
                case 'member': roleText = 'Ekip Üyesi'; break;
            }

            header.innerHTML = `
                <div class="menu-toggle" id="menu-toggle">
                    <i class="bi bi-list"></i>
                </div>

                <div class="header-right">
                    <div class="notifications">
                        <i class="bi bi-bell"></i>
                        <span class="badge">3</span>
                    </div>

                    <div class="user-profile" onclick="window.location.href='../profile/index.html';" style="cursor: pointer;">
                        <div class="profile-img">
                            <span>${formattedName.charAt(0)}</span>
                        </div>
                        <div class="profile-info">
                            <span class="user-name">${formattedName}</span>
                            <span class="user-role">${roleText}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    loadSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !sidebar.innerHTML.trim()) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { role: 'admin' };

            sidebar.innerHTML = `
                <div class="brand-container">
                    <div class="brand-logo">T</div>
                    <h4 class="brand-name">TaskTrack</h4>
                </div>

                <div class="menu-container">
                    <ul class="nav-menu">
                        <li class="menu-item">
                            <a href="#" id="dashboardLink">
                                <i class="bi bi-speedometer2"></i>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="#" id="projectsLink">
                                <i class="bi bi-kanban"></i>
                                <span id="projectsText">Projeler</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="#" id="tasksLink">
                                <i class="bi bi-list-task"></i>
                                <span id="tasksText">Görevler</span>
                            </a>
                        </li>
                        ${currentUser.role === 'admin' ? `
                        <li class="menu-item" id="usersMenuItem">
                            <a href="../users/list.html">
                                <i class="bi bi-people"></i>
                                <span>Kullanıcılar</span>
                            </a>
                        </li>
                        ` : ''}
                        <li class="menu-item">
                            <a href="../index.html" id="logoutBtn">
                                <i class="bi bi-box-arrow-right"></i>
                                <span>Çıkış Yap</span>
                            </a>
                        </li>
                    </ul>
                </div>
            `;
        }
    }

    updateUIBasedOnRole() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = '../index.html';
            return;
        }

        const userRole = currentUser.role;

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

        // Update menu text for members
        if (userRole === 'member') {
            const projectsText = document.getElementById('projectsText');
            const tasksText = document.getElementById('tasksText');

            if (projectsText) projectsText.textContent = 'Projelerim';
            if (tasksText) tasksText.textContent = 'Görevlerim';
        }
    }

    updateNavigation() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const userRole = currentUser.role;
        const dashboardLink = document.getElementById('dashboardLink');
        const projectsLink = document.getElementById('projectsLink');
        const tasksLink = document.getElementById('tasksLink');

        // Update navigation links based on role
        switch(userRole) {
            case 'admin':
                if (dashboardLink) dashboardLink.href = '../dashboard/admin.html';
                if (projectsLink) projectsLink.href = '../projects/list.html';
                if (tasksLink) tasksLink.href = '../tasks/list.html';
                break;
            case 'manager':
                if (dashboardLink) dashboardLink.href = '../dashboard/manager.html';
                if (projectsLink) projectsLink.href = '../projects/list.html';
                if (tasksLink) tasksLink.href = '../tasks/list.html';
                break;
            case 'member':
                if (dashboardLink) dashboardLink.href = '../dashboard/member.html';
                if (projectsLink) projectsLink.href = '../projects/my-projects.html';
                if (tasksLink) tasksLink.href = '../tasks/my-tasks.html';
                break;
        }
    }

    // Active menu item'ı belirle
    static setActiveMenuItem(pageName) {
        document.addEventListener('DOMContentLoaded', function() {
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
        });
    }
}

// Initialize component loader
document.addEventListener('DOMContentLoaded', function() {
    new ComponentLoader();
});

// Export for use in other scripts
window.ComponentLoader = ComponentLoader;