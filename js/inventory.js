// Inventory Management Functions
class InventoryManager {
    constructor() {
        this.currentProducts = [];
    }

    loadInventory() {
        this.currentProducts = inventoryStorage.getProducts();
        this.displayInventory();
        this.updateDashboard();
    }

    displayInventory(filteredProducts = null) {
        const products = filteredProducts || this.currentProducts;
        const table = document.getElementById('inventoryTable');
        
        if (!table) return;
        
        table.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td class="${product.quantity < 10 ? 'low-stock' : ''}">${product.quantity}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <button onclick="editProduct(${product.id})">Edit</button>
                    <button onclick="deleteProduct(${product.id})" class="delete-btn">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    updateDashboard() {
        const stats = inventoryStorage.getInventoryStats();
        
        const totalProductsEl = document.getElementById('totalProducts');
        const totalValueEl = document.getElementById('totalValue');
        const lowStockCountEl = document.getElementById('lowStockCount');
        
        if (totalProductsEl) totalProductsEl.textContent = stats.totalProducts;
        if (totalValueEl) totalValueEl.textContent = `$${stats.totalValue}`;
        if (lowStockCountEl) lowStockCountEl.textContent = stats.lowStockCount;
    }

    addNewProduct(event) {
        event.preventDefault();
        
        const product = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            quantity: parseInt(document.getElementById('productQuantity').value),
            price: parseFloat(document.getElementById('productPrice').value)
        };
        
        inventoryStorage.addProduct(product);
        this.loadInventory();
        
        // Reset form
        document.getElementById('productForm').reset();
        showPage('inventory');
        
        alert('Product added successfully!');
    }

    editProduct(id) {
        const products = inventoryStorage.getProducts();
        const product = products.find(p => p.id === id);
        
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productPrice').value = product.price;
            
            // Change form to update mode
            const form = document.getElementById('productForm');
            form.onsubmit = (e) => {
                e.preventDefault();
                const updatedProduct = {
                    name: document.getElementById('productName').value,
                    category: document.getElementById('productCategory').value,
                    quantity: parseInt(document.getElementById('productQuantity').value),
                    price: parseFloat(document.getElementById('productPrice').value)
                };
                
                inventoryStorage.updateProduct(id, updatedProduct);
                this.loadInventory();
                form.onsubmit = this.addNewProduct.bind(this);
                form.reset();
                showPage('inventory');
                alert('Product updated successfully!');
            };
            
            showPage('add-product');
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            inventoryStorage.deleteProduct(id);
            this.loadInventory();
            alert('Product deleted successfully!');
        }
    }

    searchProducts() {
        const keyword = document.getElementById('searchInput').value;
        const filteredProducts = inventoryStorage.searchProducts(keyword);
        this.displayInventory(filteredProducts);
    }

    exportToCSV() {
        const products = inventoryStorage.getProducts();
        let csv = 'ID,Name,Category,Quantity,Price\n';
        
        products.forEach(product => {
            csv += `${product.id},${product.name},${product.category},${product.quantity},${product.price}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory.csv';
        a.click();
        
        alert('Inventory exported to CSV file!');
    }
}

// Create global instance
const inventoryManager = new InventoryManager();
