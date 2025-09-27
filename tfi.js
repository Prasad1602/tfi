document.addEventListener('DOMContentLoaded', function() {
    let cart = [];

    const orderButtons = document.querySelectorAll('.menu-item-card .button-1');

    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemElement = this.parentElement.previousElementSibling.querySelector('.menu-card-title, .fizzy-drinks');
            const isFizzyDrink = itemElement.classList.contains('fizzy-drinks');
            
            let itemTitle, itemPrice, quantity;

            if (isFizzyDrink) {
                const drinkName = itemElement.firstChild.textContent.trim();
                $('#fizzyDrinkModalLabel').text(`Select Size for ${drinkName}`);
                $('#fizzyDrinkModal').modal('show');

                const confirmButton = document.getElementById('confirmFizzy');
                const modal = $('#fizzyDrinkModal');

                confirmButton.onclick = () => {
                    const selectedSize = document.querySelector('input[name="size"]:checked');
                    quantity = parseInt(document.getElementById('fizzyQuantity').value);

                    if (!selectedSize || isNaN(quantity) || quantity <= 0) {
                        alert('Please select a size and enter a valid quantity (1 or more).');
                        return;
                    }

                    itemTitle = `${drinkName} (${selectedSize.value})`;
                  
                    itemPrice = parseFloat(selectedSize.getAttribute('data-price'));
                    if (isNaN(itemPrice) || itemPrice <= 0) {
                        console.error(`Invalid price for ${itemTitle}: ${selectedSize.getAttribute('data-price')}`);
                        alert('Error: Invalid price for the selected item. Please try again.');
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
                    modal.modal('hide');
                };
            } else {
                const priceSpan = itemElement.querySelector('span');
                const priceText = priceSpan ? priceSpan.textContent.trim() : '';
                itemTitle = itemElement.textContent.replace(priceText, '').trim().split('\n')[0].trim();
                
                itemPrice = parseFloat(priceText.replace('/-', ''));
                if (isNaN(itemPrice) || itemPrice <= 0) {
                    console.error(`Invalid price for ${itemTitle}: ${priceText}`);
                    alert('Error: Invalid price for the selected item. Please try again.');
                    return;
                }

                quantity = prompt(`How many ${itemTitle} do you want?`, '1');
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
            }
        });
    });

    function updateCartDisplay() {
        const cartDisplay = document.querySelector('#cart-items');
        if (cart.length === 0) {
            cartDisplay.innerHTML = '<p>No items in cart</p>';
        } else {
            
            const totalSum = cart.reduce((sum, item) => {
                const price = Number(item.price);
                const quantity = Number(item.quantity);
                if (isNaN(price) || isNaN(quantity)) {
                    console.error(`Invalid data for item: ${item.title}, price: ${item.price}, quantity: ${item.quantity}`);
                    return sum; 
                }
                return sum + (price * quantity);
            }, 0);

            cartDisplay.innerHTML = '<h3>Cart Items:</h3><ul>' +
                cart.map((item, index) =>
                    `<li>${item.title} (${item.price}/-) x ${item.quantity} 
                    <button class="remove-item" data-index="${index}">Remove</button></li>`
                ).join('') +
                `</ul><p class="cart-total">Total: ${totalSum.toFixed(2)}/-</p>`; 
        }

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                const removedItem = cart.splice(index, 1)[0];
                updateCartDisplay();

                orderButtons.forEach(btn => {
                    const btnItemElement = btn.parentElement.previousElementSibling.querySelector('.menu-card-title, .fizzy-drinks');
                    let btnItemTitle;
                    if (btnItemElement.classList.contains('fizzy-drinks')) {
                        const sizes = JSON.parse(btnItemElement.getAttribute('data-prices'));
                        Object.keys(sizes).forEach(size => {
                            const possibleTitle = `${btnItemElement.firstChild.textContent.trim()} (${size})`;
                            if (possibleTitle === removedItem.title) {
                                btnItemTitle = possibleTitle;
                            }
                        });
                    } else {
                        const btnPriceSpan = btnItemElement.querySelector('span');
                        const btnPriceText = btnPriceSpan ? btnPriceSpan.textContent.trim() : '';
                        btnItemTitle = btnItemElement.textContent.replace(btnPriceText, '').trim().split('\n')[0].trim();
                    }
                    if (btnItemTitle === removedItem.title) {
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

            const totalSum = cart.reduce((sum, item) => {
                const price = Number(item.price);
                const quantity = Number(item.quantity);
                if (isNaN(price) || isNaN(quantity)) {
                    console.error(`Invalid data for item: ${item.title}, price: ${item.price}, quantity: ${item.quantity}`);
                    return sum;
                }
                return sum + (price * quantity);
            }, 0);

            const whatsappNumber = '+918881112204';
            
            const orderDetails = cart.map(item => `${item.title} (${item.price}/-) x ${item.quantity}`);
            const messageText = `New Order: Items:${orderDetails} Total: ${totalSum.toFixed(2)}/-  Delivery Address: ${address}`;
            const message = encodeURIComponent(messageText);

            console.log('Cart:', cart);
            console.log('Order Details:', orderDetails);
            console.log('Message:', messageText);
            console.log('Encoded Message:', message);
            console.log('WhatsApp URL:', `https://wa.me/${whatsappNumber}?text=${message}`);

            alert('Redirecting to WhatsApp... On mobile, the message will auto-fill. On desktop, copy the preview and paste it into the chat.');
            window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
        });
    }

    const backButton = document.querySelector('.back-button a[href="index.html"]')?.parentElement;
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});

