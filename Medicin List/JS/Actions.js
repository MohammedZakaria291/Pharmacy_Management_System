const STORAGE_KEY = 'pharma_medicines_v1';

// تحميل الأدوية من localStorage
function loadMedicines() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Failed to load medicines', e);
        return [];
    }
}

// حفظ الأدوية في localStorage
function saveMedicines(medicines) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
        // إطلاق حدث storage يدوياً لتحديث الصفحات الأخرى
        window.dispatchEvent(new StorageEvent('storage', {
            key: STORAGE_KEY,
            newValue: JSON.stringify(medicines)
        }));
    } catch (e) {
        console.error('Failed to save medicines', e);
    }
}

// عرض الأدوية في الجدول
function displayMedicines() {
    const medicines = loadMedicines();
    const tableBody = document.querySelector(".medicine-table tbody");
    
    if (!tableBody) return;
    
    if (medicines.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #777;">No medicines available. Add your first medicine!</td></tr>';
        return;
    }
    
    tableBody.innerHTML = medicines.map((med, index) => {
        const qty = parseInt(med.quantity) || 0;
        const rowClass = qty < 50 ? 'danger-row' : 'warning-row';
        
        return `
            <tr class="${rowClass}" data-index="${index}">
                <td>${med.medicineName || med.name || 'N/A'}</td>
                <td>${med.price}$</td>
                <td>${med.quantity || 0}</td>
                <td>${med.expiryDate || 'N/A'}</td>
                <td>${qty}%</td>
                <td class="actions">
                    <i class="fas fa-trash" style="cursor:pointer;" onclick="deleteMedicine(${index})"></i>
                </td>
            </tr>
        `;
    }).join('');
}

// حذف دواء
function deleteMedicine(index) {
    if (confirm("Are you sure you want to delete this medicine?")) {
        const medicines = loadMedicines();
        medicines.splice(index, 1);
        saveMedicines(medicines);
        displayMedicines();
    }
}

// إضافة دواء جديد
function addMedicine() {
    const name = document.getElementById("mName").value.trim();
    const price = document.getElementById("mPrice").value.trim();
    const qty = document.getElementById("mQty").value.trim();
    const date = document.getElementById("mDate").value.trim();
    
    if (!name || !price) {
        alert("Please enter medicine name and price");
        return;
    }
    
    const medicines = loadMedicines();
    const newMedicine = {
        medicineName: name,
        name: name,
        price: price,
        quantity: qty || 0,
        expiryDate: date || '',
        category: 'General',
        supplier: 'N/A',
        dateAdded: new Date().toISOString()
    };
    
    medicines.push(newMedicine);
    saveMedicines(medicines);
    displayMedicines();
    
    // إغلاق المودال وتنظيف الحقول
    const modal = document.getElementById("medModal");
    if (modal) modal.style.display = "none";
    document.querySelectorAll("#medModal input").forEach(i => i.value = "");
}

// البحث في الجدول
function setupSearch() {
    const searchInput = document.querySelector(".left-controls .search-container input");
    if (!searchInput) return;
    
    searchInput.addEventListener("keyup", function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll(".medicine-table tbody tr");
        
        rows.forEach(row => {
            const firstCell = row.querySelector("td:first-child");
            if (firstCell) {
                const medicineName = firstCell.textContent.toLowerCase();
                row.style.display = medicineName.includes(searchTerm) ? "" : "none";
            }
        });
    });
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // عرض الأدوية
    displayMedicines();
    
    // زر فتح المودال
    const openBtn = document.querySelector(".add-btn");
    const modal = document.getElementById("medModal");
    if (openBtn && modal) {
        openBtn.onclick = () => modal.style.display = "flex";
    }
    
    // زر إغلاق المودال
    const closeBtn = document.getElementById("closeBtn");
    if (closeBtn && modal) {
        closeBtn.onclick = () => modal.style.display = "none";
    }
    
    // زر حفظ الدواء
    const saveBtn = document.getElementById("saveMedBtn");
    if (saveBtn) {
        saveBtn.onclick = addMedicine;
    }
    
    // إعداد البحث
    setupSearch();
    
    // إغلاق المودال عند الضغط خارجه
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
    
    // الاستماع لتغييرات localStorage من صفحات أخرى
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            displayMedicines();
        }
    });
});
