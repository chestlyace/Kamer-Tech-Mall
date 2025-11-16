// Filter state
let filters = {
    categories: new Set(),
    brands: new Set(),
    minPrice: 0,
    maxPrice: 2000,
    rating: 0,
    inStockOnly: false,
    sortBy: 'price-low-high'
};

// Initialize filters and event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check for category in URL params
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
        document.querySelectorAll('input[name="category"]').forEach(checkbox => {
            if (checkbox.value.toLowerCase() === categoryParam.toLowerCase()) {
                checkbox.checked = true;
                filters.categories.add(checkbox.value);
            }
        });
    }
    // Initialize price range slider
    const priceRange = document.querySelector('input[type="range"]');
    priceRange.addEventListener('input', (e) => {
        filters.maxPrice = parseInt(e.target.value);
        applyFilters();
    });

    // Initialize category checkboxes
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                filters.categories.add(e.target.value);
            } else {
                filters.categories.delete(e.target.value);
            }
            applyFilters();
        });
    });

    // Initialize brand checkboxes
    document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                filters.brands.add(e.target.value);
            } else {
                filters.brands.delete(e.target.value);
            }
            applyFilters();
        });
    });

    // Initialize rating radio buttons
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            filters.rating = parseInt(e.target.value);
            applyFilters();
        });
    });

    // Initialize in stock checkbox
    document.querySelector('input[name="inStock"]').addEventListener('change', (e) => {
        filters.inStockOnly = e.target.checked;
        applyFilters();
    });

    // Initialize sort select
    document.querySelector('select[name="sort"]').addEventListener('change', (e) => {
        filters.sortBy = e.target.value;
        applyFilters();
    });

    // Initialize clear filters button
    document.querySelector('#clearFilters').addEventListener('click', clearFilters);
});

// Apply all filters and update product display
function applyFilters() {
    let filteredProducts = products.filter(product => {
        // Filter by category
        if (filters.categories.size > 0 && !filters.categories.has(product.category)) {
            return false;
        }

        // Filter by brand
        if (filters.brands.size > 0 && !filters.brands.has(product.brand)) {
            return false;
        }

        // Filter by price
        if (product.price < filters.minPrice || product.price > filters.maxPrice) {
            return false;
        }

        // Filter by rating
        if (filters.rating > 0 && product.rating < filters.rating) {
            return false;
        }

        // Filter by stock
        if (filters.inStockOnly && !product.inStock) {
            return false;
        }

        return true;
    });

    // Apply sorting
    filteredProducts.sort((a, b) => {
        switch (filters.sortBy) {
            case 'price-low-high':
                return a.price - b.price;
            case 'price-high-low':
                return b.price - a.price;
            case 'popularity':
                return b.reviews - a.reviews;
            case 'latest':
                return b.id - a.id;
            default:
                return 0;
        }
    });

    displayProducts(filteredProducts);
}

// Clear all filters
function clearFilters() {
    filters = {
        categories: new Set(),
        brands: new Set(),
        minPrice: 0,
        maxPrice: 2000,
        rating: 0,
        inStockOnly: false,
        sortBy: 'price-low-high'
    };

    // Reset UI elements
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    document.querySelector('input[type="range"]').value = 2000;
    document.querySelector('select[name="sort"]').value = 'price-low-high';

    applyFilters();
}

// Display filtered products
function displayProducts(products) {
    const productGrid = document.querySelector('#productGrid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div class="bg-white dark:bg-dark-card rounded-lg shadow-lg overflow-hidden group">
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onclick="openQuickView('${product.name}')" class="bg-white text-gray-900 px-4 py-2 rounded-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            Quick View
                        </button>
                    </div>
                    ${product.originalPrice ? `<span class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">-${Math.round((1 - product.price/product.originalPrice) * 100)}%</span>` : ''}
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">${product.name}</h3>
                    <div class="flex items-center mb-2">
                        <div class="flex text-yellow-400">
                            ${getStarRating(product.rating)}
                        </div>
                        <span class="text-gray-500 dark:text-gray-400 text-sm ml-2">(${product.reviews})</span>
                    </div>
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            ${product.originalPrice ? `<span class="text-gray-500 line-through">$${product.originalPrice}</span>` : ''}
                            <span class="text-xl font-bold text-blue-600 dark:text-blue-400">$${product.price}</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="addToCart('${product.name}', ${product.price})" class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Add to Cart
                        </button>
                        <button class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 border rounded-lg">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        productGrid.innerHTML += productCard;
    });

    // Update product count
    document.querySelector('#productCount').textContent = products.length;
}

// Helper function to generate star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}