// Auth Middleware - Rol tabanlı erişim kontrolü

class AuthMiddleware {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        // Check if user is logged in
        if (!this.currentUser) {
            this.redirectToLogin();
            return;
        }

        // Check page access permissions
        this.checkPageAccess();

        // Set up navigation protection
        this.setupNavigationProtection();
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    redirectToLogin() {
        // Get the current page path to determine the correct login path
        const currentPath = window.location.pathname;
        let loginPath = '/index.html';

        // Calculate relative path to login
        if (currentPath.includes('/dashboard/')) {
            loginPath = '../index.html';
        } else if (currentPath.includes('/projects/') || currentPath.includes('/tasks/') || currentPath.includes('/users/') || currentPath.includes('/profile/')) {
            loginPath = '../index.html';
        }

        window.location.href = loginPath;
    }

    checkPageAccess() {
        const currentPath = window.location.pathname;
        const userRole = this.currentUser.role;

        // Define page access rules
        const accessRules = {
            admin: [
                '/dashboard/admin.html',
                '/projects/',
                '/tasks/',
                '/users/',
                '/profile/'
            ],
            manager: [
                '/dashboard/manager.html',
                '/projects/',
                '/tasks/',
                '/profile/'
            ],
            member: [
                '/dashboard/member.html',
                '/projects/my-projects.html',
                '/projects/detail.html', // Members can view project details
                '/tasks/my-tasks.html',
                '/tasks/detail.html', // Members can view task details
                '/profile/'
            ]
        };

        // Check if current user can access this page
        const allowedPaths = accessRules[userRole] || [];
        const hasAccess = allowedPaths.some(allowedPath => {
            // For directories, check if current path starts with allowed path
            if (allowedPath.endsWith('/')) {
                return currentPath.includes(allowedPath);
            }
            // For specific files, check exact match
            return currentPath.includes(allowedPath);
        });

        if (!hasAccess) {
            // Redirect to appropriate dashboard
            this.redirectToDashboard(userRole);
        }
    }

    redirectToDashboard(userRole) {
        const currentPath = window.location.pathname;
        let dashboardPath = '/dashboard/';

        // Calculate relative path based on current location
        if (currentPath.includes('/dashboard/')) {
            dashboardPath = './';
        } else if (currentPath.includes('/projects/') || currentPath.includes('/tasks/') || currentPath.includes('/users/') || currentPath.includes('/profile/')) {
            dashboardPath = '../dashboard/';
        }

        switch(userRole) {
            case 'admin':
                window.location.href = dashboardPath + 'admin.html';
                break;
            case 'manager':
                window.location.href = dashboardPath + 'manager.html';
                break;
            case 'member':
                window.location.href = dashboardPath + 'member.html';
                break;
            default:
                this.redirectToLogin();
        }
    }

    setupNavigationProtection() {
        // Protect navigation links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:')) return;

            // Check if user can access the linked page
            if (!this.canAccessPath(href)) {
                e.preventDefault();
                alert('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
                return false;
            }
        });
    }

    canAccessPath(path) {
        const userRole = this.currentUser.role;

        // Define which paths each role can access
        const rolePermissions = {
            admin: {
                canAccess: () => true // Admin can access everything
            },
            manager: {
                canAccess: (path) => {
                    // Managers cannot access admin-specific pages
                    if (path.includes('/dashboard/admin.html') ||
                        path.includes('/users/')) {
                        return false;
                    }
                    return true;
                }
            },
            member: {
                canAccess: (path) => {
                    // Members can only access member-specific pages
                    const allowedPaths = [
                        '/dashboard/member.html',
                        '/projects/my-projects.html',
                        '/projects/detail.html',
                        '/tasks/my-tasks.html',
                        '/tasks/detail.html',
                        '/profile/'
                    ];

                    return allowedPaths.some(allowedPath =>
                        path.includes(allowedPath)
                    );
                }
            }
        };

        const permissions = rolePermissions[userRole];
        return permissions ? permissions.canAccess(path) : false;
    }

    // Public method to check if current user has specific permission
    static hasPermission(permission) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return false;

        const rolePermissions = {
            admin: ['all'],
            manager: ['manage_projects', 'manage_tasks', 'view_projects', 'view_tasks'],
            member: ['view_own_projects', 'view_own_tasks', 'update_own_tasks']
        };

        const userPermissions = rolePermissions[currentUser.role] || [];
        return userPermissions.includes('all') || userPermissions.includes(permission);
    }

    // Public method to get current user role
    static getCurrentUserRole() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser ? currentUser.role : null;
    }

    // Public method to logout user
    static logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }
}

// Initialize auth middleware on page load
document.addEventListener('DOMContentLoaded', function() {
    new AuthMiddleware();
});

// Export for use in other scripts
window.AuthMiddleware = AuthMiddleware;