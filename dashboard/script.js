        const STORAGE_KEY = 'pharma_medicines_v1';
        const SALES_KEY = 'pharma_sales_v1';
        const TODAY = new Date('2025-12-22'); 

        function loadMedicines() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                console.error('Failed to load medicines', e);
                return [];
            }
        }

        function loadSales() {
            try {
                const raw = localStorage.getItem(SALES_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                console.error('Failed to load sales', e);
                return [];
            }
        }

        function updateDashboardStats() {
            const medicines = loadMedicines();
            const sales = loadSales();

            // Total Medicines
            const total = medicines.length;

            // Expired or Near Expiry (≤ 30 يوم)
            const nearExpiryDays = 30;
            const expiredOrNear = medicines.filter(item => {
                if (!item.expiryDate) return false;
                const expiry = new Date(item.expiryDate);
                const diffDays = (expiry - TODAY) / (1000 * 60 * 60 * 24);
                return diffDays <= nearExpiryDays;
            }).length;

            // Low Stock (الكمية ≤ 10 و > 0)
            const lowStockThreshold = 10;
            const lowStock = medicines.filter(item => {
                const qty = parseInt(item.quantity) || 0;
                return qty <= lowStockThreshold && qty > 0;
            }).length;

            // Total Sales
            const totalSalesCount = sales.length;

            document.getElementById('totalMedicines').textContent = total;
            document.getElementById('expiredCount').textContent = expiredOrNear;
            document.getElementById('lowStockCount').textContent = lowStock ? lowStock + ' Items' : '0 Items';
            document.getElementById('totalSales').textContent = totalSalesCount;
        }

        document.addEventListener('DOMContentLoaded', updateDashboardStats);

        
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY || e.key === SALES_KEY) {
                updateDashboardStats();
            }
        });
const salesData = [
    { invoice: "INV-005", date: "14:30", customer: "abdullah saleh", items: 2, amount: "$21.98", status: "completed" },
    { invoice: "INV-004", date: "13:45", customer: "omar", items: 5, amount: "$67.95", status: "completed" },
    { invoice: "INV-003", date: "11:20", customer: "Ahmed magady", items: 2, amount: "$28.48", status: "completed" },
    { invoice: "INV-002", date: "10:15", customer: "Mohamed", items: 1, amount: "$12.99", status: "completed" },
    { invoice: "INV-001", date: "09:30", customer: "saif", items: 3, amount: "$45.50", status: "completed" }
];

const tbody = document.getElementById("sales-tbody");

// Render Table Rows
salesData.forEach(sale => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${sale.invoice}</td>
        <td>${sale.date}</td>
        <td>${sale.customer}</td>
        <td>${sale.items}</td>
        <td>${sale.amount}</td>
        <td><span class="status ${sale.status}">${sale.status}</span></td>
    `;
    tbody.appendChild(tr);
});





