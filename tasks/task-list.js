// Görev Listesi sayfası için JavaScript dosyası

document.addEventListener('DOMContentLoaded', function() {
    // Tab'larda görevleri durumlara göre filtreleme
    document.querySelectorAll('#taskTabs button').forEach(function(button) {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-bs-target');
            const status = tabId.replace('#', '').replace('-tasks', '');

            // Her tab'ı dinamik olarak doldur
            if (status === 'todo') {
                fillTodoTab();
            } else if (status === 'progress') {
                fillProgressTab();
            } else if (status === 'completed') {
                fillCompletedTab();
            }
        });
    });

    // "Beklemede" tab içeriğini doldur
    function fillTodoTab() {
        const todoTabContent = document.querySelector('#todo-tasks');
        if (!todoTabContent) return;

        // HTML içeriğini oluştur
        let html = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Görev Adı</th>
                        <th>Proje</th>
                        <th>Atanan Kişi</th>
                        <th>Öncelik</th>
                        <th>Son Tarih</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <a href="./detail.html" class="fw-bold text-primary">Kullanıcı Arayüzü Tasarımı</a>
                            <div class="small text-muted">Mobil uygulama için UI tasarımı</div>
                        </td>
                        <td>Mobil Uygulama Geliştirme</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="avatar-sm me-2">M</div>
                                <span>Mehmet Demir</span>
                            </div>
                        </td>
                        <td><span class="badge bg-info">Normal</span></td>
                        <td>01.06.2025</td>
                        <td><span class="badge bg-secondary">Beklemede</span></td>
                        <td>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="./detail.html"><i class="bi bi-eye me-2"></i>Görüntüle</a></li>
                                    <li><a class="dropdown-item" href="./edit.html"><i class="bi bi-pencil me-2"></i>Düzenle</a></li>
                                    <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Sil</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`;

        todoTabContent.innerHTML = html;
    }

    // "Devam Ediyor" tab içeriğini doldur
    function fillProgressTab() {
        const progressTabContent = document.querySelector('#progress-tasks');
        if (!progressTabContent) return;

        // HTML içeriğini oluştur
        let html = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Görev Adı</th>
                        <th>Proje</th>
                        <th>Atanan Kişi</th>
                        <th>Öncelik</th>
                        <th>Son Tarih</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <a href="./detail.html" class="fw-bold text-primary">API Endpoint Geliştirme</a>
                            <div class="small text-muted">RESTful API servislerinin geliştirilmesi</div>
                        </td>
                        <td>API Entegrasyonu</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="avatar-sm me-2">Z</div>
                                <span>Zeynep Kaya</span>
                            </div>
                        </td>
                        <td><span class="badge bg-warning">Orta</span></td>
                        <td>25.05.2025</td>
                        <td><span class="badge bg-warning">Devam Ediyor</span></td>
                        <td>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="./detail.html"><i class="bi bi-eye me-2"></i>Görüntüle</a></li>
                                    <li><a class="dropdown-item" href="./edit.html"><i class="bi bi-pencil me-2"></i>Düzenle</a></li>
                                    <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Sil</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="./detail.html" class="fw-bold text-primary">Veritabanı Şema Tasarımı</a>
                            <div class="small text-muted">Veritabanı şema optimizasyonu</div>
                        </td>
                        <td>Veritabanı Optimizasyonu</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="avatar-sm me-2">Z</div>
                                <span>Zeynep Kaya</span>
                            </div>
                        </td>
                        <td><span class="badge bg-warning">Orta</span></td>
                        <td>15.06.2025</td>
                        <td><span class="badge bg-warning">Devam Ediyor</span></td>
                        <td>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="./detail.html"><i class="bi bi-eye me-2"></i>Görüntüle</a></li>
                                    <li><a class="dropdown-item" href="./edit.html"><i class="bi bi-pencil me-2"></i>Düzenle</a></li>
                                    <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Sil</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`;

        progressTabContent.innerHTML = html;
    }

    // "Tamamlandı" tab içeriğini doldur
    function fillCompletedTab() {
        const completedTabContent = document.querySelector('#completed-tasks');
        if (!completedTabContent) return;

        // HTML içeriğini oluştur
        let html = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Görev Adı</th>
                        <th>Proje</th>
                        <th>Atanan Kişi</th>
                        <th>Öncelik</th>
                        <th>Son Tarih</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <a href="./detail.html" class="fw-bold text-primary">Ana Sayfa Tasarımı</a>
                            <div class="small text-muted">Web sitesi ana sayfasının yeniden tasarımı</div>
                        </td>
                        <td>Web Sitesi Yenileme</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="avatar-sm me-2">A</div>
                                <span>Ahmet Yılmaz</span>
                            </div>
                        </td>
                        <td><span class="badge bg-danger">Yüksek</span></td>
                        <td>20.05.2025</td>
                        <td><span class="badge bg-success">Tamamlandı</span></td>
                        <td>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="./detail.html"><i class="bi bi-eye me-2"></i>Görüntüle</a></li>
                                    <li><a class="dropdown-item" href="./edit.html"><i class="bi bi-pencil me-2"></i>Düzenle</a></li>
                                    <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Sil</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="./detail.html" class="fw-bold text-primary">Tasarım Dokümanı</a>
                            <div class="small text-muted">Mobil uygulama için UI tasarımı</div>
                        </td>
                        <td>Mobil Uygulama Geliştirme</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="avatar-sm me-2">M</div>
                                <span>Mehmet Demir</span>
                            </div>
                        </td>
                        <td><span class="badge bg-info">Normal</span></td>
                        <td>15.05.2025</td>
                        <td><span class="badge bg-success">Tamamlandı</span></td>
                        <td>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="./detail.html"><i class="bi bi-eye me-2"></i>Görüntüle</a></li>
                                    <li><a class="dropdown-item" href="./edit.html"><i class="bi bi-pencil me-2"></i>Düzenle</a></li>
                                    <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Sil</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`;

        completedTabContent.innerHTML = html;
    }

    // Sayfa yüklendiğinde ilk tab'ı aktifleştir
    const firstTab = document.querySelector('#taskTabs button.active');
    if (firstTab) {
        // Bootstrap tab'ı etkinleştir
        const tabToShow = new bootstrap.Tab(firstTab);
        tabToShow.show();

        // Tab içeriğini doldur
        const targetTab = firstTab.getAttribute('data-bs-target').replace('#', '').replace('-tasks', '');
        if (targetTab === 'todo') {
            fillTodoTab();
        } else if (targetTab === 'progress') {
            fillProgressTab();
        } else if (targetTab === 'completed') {
            fillCompletedTab();
        }
    }

    // Tab değişikliğini dinle
    document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(function(tab) {
        tab.addEventListener('shown.bs.tab', function(event) {
            const targetTab = event.target.getAttribute('data-bs-target').replace('#', '').replace('-tasks', '');
            if (targetTab === 'todo') {
                fillTodoTab();
            } else if (targetTab === 'progress') {
                fillProgressTab();
            } else if (targetTab === 'completed') {
                fillCompletedTab();
            }
        });
    });
});