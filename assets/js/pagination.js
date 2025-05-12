// Pagination işlevselliği

function initializePagination(tableId, itemsPerPage = 5) {
    const table = document.querySelector(tableId);
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.getElementsByTagName('tr'));
    const pagination = document.querySelector('.pagination');

    if (!pagination) return;

    let currentPage = 1;
    const totalPages = Math.ceil(rows.length / itemsPerPage);

    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? '' : 'none';
        });

        updatePaginationButtons(page);
    }

    function updatePaginationButtons(activePage) {
        const pageButtons = pagination.querySelectorAll('.page-item');

        // Clear existing buttons except first (Previous) and last (Next)
        for (let i = pageButtons.length - 2; i > 0; i--) {
            pageButtons[i].remove();
        }

        // Add page numbers
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === activePage ? 'active' : ''}`;

            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = i;
            a.onclick = (e) => {
                e.preventDefault();
                currentPage = i;
                showPage(currentPage);
            };

            li.appendChild(a);
            pagination.insertBefore(li, pagination.lastElementChild);
        }

        // Update Previous button
        const prevButton = pagination.firstElementChild;
        prevButton.classList.toggle('disabled', activePage === 1);
        prevButton.querySelector('a').onclick = (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
            }
        };

        // Update Next button
        const nextButton = pagination.lastElementChild;
        nextButton.classList.toggle('disabled', activePage === totalPages);
        nextButton.querySelector('a').onclick = (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
            }
        };
    }

    // Initialize pagination
    if (totalPages > 1) {
        showPage(1);
    } else {
        // Hide pagination if only one page
        pagination.style.display = 'none';
    }
}

// Page yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', function() {
    // Görevler tablosu için pagination
    if (window.location.pathname.includes('/tasks/list.html')) {
        initializePagination('#all-tasks table');
    }

    // Projeler tablosu için pagination
    if (window.location.pathname.includes('/projects/list.html')) {
        initializePagination('table');
    }

    // Kullanıcılar tablosu için pagination
    if (window.location.pathname.includes('/users/list.html')) {
        initializePagination('table');
    }
});