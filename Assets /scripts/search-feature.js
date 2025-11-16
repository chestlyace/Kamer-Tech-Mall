 // Search functionality
 function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchTerm = searchInput.value.toLowerCase();

    // Clear results if search term is empty
    if (searchTerm.length === 0) {
        searchResults.classList.add('hidden');
        return;
    }

    // Filter products based on search term
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm)
    );

    // Display results
    if (filteredProducts.length > 0) {
        searchResults.innerHTML = filteredProducts.map(product => `
            <div class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center border-b dark:border-gray-700">
                <div>
                    <div class="font-medium dark:text-white">${product.name}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">${product.category}</div>
                </div>
                <div class="text-blue-600 dark:text-blue-400 font-medium">$${product.price}</div>
            </div>
        `).join('');
        searchResults.classList.remove('hidden');
    } else {
        searchResults.innerHTML = `
            <div class="p-3 text-gray-500 dark:text-gray-400">
                No products found
            </div>
        `;
        searchResults.classList.remove('hidden');
    }
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    const searchResults = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');
    if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
        searchResults.classList.add('hidden');
    }
});