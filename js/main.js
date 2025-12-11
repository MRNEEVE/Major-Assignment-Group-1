// Main Application Logic
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Load data if needed
    if (pageId === 'inventory' || pageId === 'dashboard') {
        inventoryManager.loadInventory();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up form submission
    const form = document.getElementById('productForm');
    if (form) {
        form.onsubmit = inventoryManager.addNewProduct.bind(inventoryManager);
    }
    
    // Load initial data
    inventoryManager.loadInventory();
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const footer = document.querySelector('footer p');
    if (footer) {
        footer.textContent = `Inventory Tracker System © ${currentYear}`;
    }
});

// Make functions globally available
window.showPage = showPage;
window.editProduct = (id) => inventoryManager.editProduct(id);
window.deleteProduct = (id) => inventoryManager.deleteProduct(id);
window.searchProducts = () => inventoryManager.searchProducts();
window.exportToCSV = () => inventoryManager.exportToCSV();
