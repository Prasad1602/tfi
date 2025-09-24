document.addEventListener('DOMContentLoaded', function() {
    
    let cart = [];

    
    const orderButtons = document.querySelectorAll('.menu-item-card .button-1');
    
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
      
            const itemElement = this.parentElement.previousElementSibling.querySelector('.menu-card-title');
            const itemTitle = itemElement.textContent.trim().split('\n')[0].trim();
            const itemPrice = parseFloat(itemElement.querySelector('span').textContent.trim().replace('/-', ''));
            
     
            let quantity = prompt(`How many ${itemTitle} do you want?`, '1');
            quantity = parseInt(quantity);
            
            if (isNaN(quantity) || quantity <= 0) {
                alert('Please enter a valid quantity (1 or more).');
                return;
            }

          
            const existingItemIndex = cart.findIndex(item => item.title === itemTitle);
            if (existingItemIndex !== -1) {
              
                cart[existingItemIndex].quantity += quantity;
            } else {
            
                cart.push({ title: itemTitle, price: itemPrice, quantity: quantity });
                button.textContent = 'Added to Cart';
                button.disabled = true; 
                button.style.background = 'linear-gradient(45deg, #7f8c8d, #95a5a6)'; 
            }
            
            updateCartDisplay();
        });
    });

   
    function updateCartDisplay() {
        const cartDisplay = document.querySelector('#cart-items');
        if (cart.length === 0) {
            cartDisplay.innerHTML = '<p>No items in cart</p>';
        } else {
           
            const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            cartDisplay.innerHTML = '<h3>Cart Items:</h3><ul>' + 
                cart.map((item, index) => 
                    `<li>${item.title} (${item.price}/-) x ${item.quantity} 
                    <button class="remove-item" data-index="${index}">Remove</button></li>`
                ).join('') + 
                `</ul><p class="cart-total">Total: ${totalSum}/-</p>`;
        }

       
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                const removedItem = cart.splice(index, 1)[0];
                updateCartDisplay();
                
                orderButtons.forEach(btn => {
                    const itemTitle = btn.parentElement.previousElementSibling.querySelector('.menu-card-title').textContent.trim().split('\n')[0].trim();
                    if (itemTitle === removedItem.title) {
                        btn.textContent = 'Order Now';
                        btn.disabled = false;
                        btn.style.background = 'linear-gradient(45deg, #e67e22, #f1c40f)';
                    }
                });
            });
        });
    }

  
    const placeOrderButton = document.querySelector('#place-order');
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            
            const address = prompt('Please enter your delivery address:');
            if (!address || address.trim() === '') {
                alert('Please provide a valid delivery address.');
                return;
            }

           
            const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        
            const whatsappNumber = '918881112204';
            const orderDetails = cart.map(item => `${item.title} (${item.price}/-) x ${item.quantity}`).join('\n');
            const message = encodeURIComponent(`I want to order:\n${orderDetails}\n\nTotal: ${totalSum}/-\n\nDelivery Address: ${address}`);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
            
            
            window.location.href = whatsappUrl;
        });
    }

    
    const backButton = document.querySelector('.back-button a[href="index.html"]')?.parentElement;
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

});
