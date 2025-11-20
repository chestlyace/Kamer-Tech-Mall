 // Search functionality
async function handleSearch() {
   const searchInput = document.getElementById('searchInput') || document.getElementById('mobileSearchInput');
   const searchResults = document.getElementById('searchResults') || document.getElementById('mobileSearchResults');
   
   if (!searchInput || !searchResults) return;
   
   const searchTerm = searchInput.value.trim();

   // Clear results if search term is empty
   if (searchTerm.length === 0) {
       searchResults.classList.add('hidden');
       return;
   }

   try {
       // Fetch products from API
       const response = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}`);
       const data = await response.json();
       
       if (data.success && data.products && data.products.length > 0) {
           searchResults.innerHTML = data.products.slice(0, 5).map(product => `
               <a href="/product/${product.id}" class="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center border-b dark:border-gray-700">
                   <div>
                       <div class="font-medium dark:text-white">${product.name}</div>
                       <div class="text-sm text-gray-500 dark:text-gray-400">${product.category}</div>
                   </div>
                   <div class="text-blue-600 dark:text-blue-400 font-medium">FCFA${product.current_price ? product.current_price.toLocaleString() : '0'}</div>
               </a>
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
   } catch (error) {
       console.error('Search error:', error);
       searchResults.innerHTML = `
           <div class="p-3 text-red-500">
               Error searching products
           </div>
       `;
       searchResults.classList.remove('hidden');
   }
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
   const searchResults = document.getElementById('searchResults') || document.getElementById('mobileSearchResults');
   const searchInput = document.getElementById('searchInput') || document.getElementById('mobileSearchInput');
   if (searchInput && searchResults && !searchInput.contains(event.target) && !searchResults.contains(event.target)) {
       searchResults.classList.add('hidden');
   }
});