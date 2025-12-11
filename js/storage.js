// Data Storage System
class InventoryStorage {
    constructor() {
        this.key = 'inventory_data';
        this.initSampleData();
    }

    initSampleData() {
        if (!this.getProducts().length) {
            const sampleProducts = [
                { id: 1, name: "Laptop", category: "Electronics", quantity: 15, price: 999.99 },
                { id: 2, name: "Mouse", category: "Electronics", quantity: 50, price: 25.50 },
                { id: 3, name: "Notebook", category: "Stationery", quantity: 8, price: 5.99 },
                { id: 4, name: "Pen", category: "Stationery", quantity: 200, price: 1.99 },
                { id: 5, name: "Coffee Mug", category: "Kitchen", quantity: 30, price: 12.99 }
            ];
            this.saveProducts(sampleProducts);
        }
    }

    getProducts() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    }

    saveProducts(products) {
        localStorage.setItem(this.key, JSON.stringify(products));
    }

    addProduct(product) {
        const products = this.getProducts();
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        product.id = newId;
        products.push(product);
        this.saveProducts(products);
        return product;
    }

    updateProduct(id, updatedProduct) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            this.saveProducts(products);
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        const products = this.getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        this.saveProducts(filteredProducts);
    }

    searchProducts(keyword) {
        const products = this.getProducts();
        if (!keyword) return products;
        
        const lowerKeyword = keyword.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(lowerKeyword) ||
            product.category.toLowerCase().includes(lowerKeyword)
        );
    }

    getInventoryStats() {
        const products = this.getProducts();
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, product) => 
            sum + (product.quantity * product.price), 0);
        const lowStockCount = products.filter(p => p.quantity < 10).length;
        
        return {
            totalProducts,
            totalValue: totalValue.toFixed(2),
            lowStockCount
        };
    }
}

// Create global instance
const inventoryStorage = new InventoryStorage();
