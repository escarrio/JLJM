// ==================== GLOBAL VARIABLES ====================
let cart = [];

// ==================== DOM ELEMENTS ====================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navbar = document.getElementById("navbar");
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const checkoutModal = document.getElementById("checkoutModal");
const receiptModal = document.getElementById("receiptModal");
const cartCount = document.getElementById("cartCount");
const closeModal = document.getElementsByClassName("close")[0];
const closeCheckout = document.getElementById("closeCheckout");
const closeReceipt = document.getElementById("closeReceipt");
const checkoutBtn = document.getElementById("checkoutBtn");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const printReceiptBtn = document.getElementById("printReceiptBtn");

// ==================== NAVIGATION ====================
if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

// Close mobile menu when clicking on nav links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ==================== QUANTITY CONTROLS ====================
function increaseQty(button) {
  const input = button.parentElement.querySelector(".qty-input");
  input.value = parseInt(input.value) + 1;
}

function decreaseQty(button) {
  const input = button.parentElement.querySelector(".qty-input");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

// ==================== SLICE INPUT CONTROLS ====================
function increaseSlices(button) {
  const input = button.parentElement.querySelector(".slice-number-input");
  const max = parseInt(input.getAttribute("max")) || 10;
  if (parseInt(input.value) < max) {
    input.value = parseInt(input.value) + 1;
    updateCakePrice(input);
  }
}

function decreaseSlices(button) {
  const input = button.parentElement.querySelector(".slice-number-input");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
    updateCakePrice(input);
  }
}

function updateCakePrice(input) {
  const productCard = input.closest(".product-card");
  const priceDisplay = productCard.querySelector(".price-value");
  const wholeCakeCheckbox = productCard.querySelector(".whole-cake-checkbox");
  
  if (wholeCakeCheckbox && wholeCakeCheckbox.checked) {
    return; // Price is already set to whole cake price
  }
  
  const pricePerSlice = parseFloat(input.getAttribute("data-price-per-slice"));
  const numSlices = parseInt(input.value);
  const totalPrice = pricePerSlice * numSlices;
  
  priceDisplay.textContent = totalPrice;
}

// ==================== PAYMENT METHOD CHANGE HANDLER ====================
function handlePaymentMethodChange() {
  const selectedPayment = document.querySelector('input[name="payment"]:checked');
  if (!selectedPayment) return;
  
  const paymentMethod = selectedPayment.value;
  const transactionDetailsSection = document.getElementById("transactionDetailsSection");
  const gcashDetails = document.getElementById("gcashDetails");
  const creditCardDetails = document.getElementById("creditCardDetails");
  const debitCardDetails = document.getElementById("debitCardDetails");
  const amountTenderedSection = document.getElementById("amountTenderedSection");
  
  // Hide all transaction detail sections first
  gcashDetails.style.display = "none";
  creditCardDetails.style.display = "none";
  debitCardDetails.style.display = "none";
  
  // Show/hide transaction details based on payment method
  if (paymentMethod === "Cash") {
    transactionDetailsSection.style.display = "none";
    amountTenderedSection.style.display = "block";
  } else {
    transactionDetailsSection.style.display = "block";
    amountTenderedSection.style.display = "none";
    
    if (paymentMethod === "GCash") {
      gcashDetails.style.display = "block";
    } else if (paymentMethod === "Credit Card") {
      creditCardDetails.style.display = "block";
    } else if (paymentMethod === "Debit Card") {
      debitCardDetails.style.display = "block";
    }
  }
}

// ==================== AMOUNT TENDERED CHANGE HANDLER ====================
function calculateChange() {
  const amountTenderedInput = document.getElementById("amountTendered");
  const changeAmountDiv = document.getElementById("changeAmount");
  const changeValueSpan = document.getElementById("changeValue");
  const total = parseFloat(document.getElementById("checkoutTotal").textContent);
  
  const amountTendered = parseFloat(amountTenderedInput.value) || 0;
  
  if (amountTendered >= total) {
    const change = amountTendered - total;
    changeValueSpan.textContent = change.toFixed(2);
    changeAmountDiv.style.display = "flex";
  } else {
    changeAmountDiv.style.display = "none";
  }
}

// ==================== SIZE/FLAVOR/SLICE SELECTION WITH PRICE UPDATE ====================
document.addEventListener("DOMContentLoaded", () => {
  // Handle size option changes for coffee
  document.querySelectorAll(".size-option input[type='radio']").forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const productCard = e.target.closest(".product-card");
      const priceDisplay = productCard.querySelector(".price-value");
      const newPrice = e.target.getAttribute("data-price");
      priceDisplay.textContent = newPrice;
    });
  });

  // Handle flavor option changes for pastries
  document.querySelectorAll(".flavor-option input[type='radio']").forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const productCard = e.target.closest(".product-card");
      const priceDisplay = productCard.querySelector(".price-value");
      const newPrice = e.target.getAttribute("data-price");
      priceDisplay.textContent = newPrice;
    });
  });

  // Handle slice input changes for cakes
  document.querySelectorAll(".slice-number-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      updateCakePrice(e.target);
    });
  });

  // Handle whole cake checkbox for cakes
  document.querySelectorAll(".whole-cake-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const productCard = e.target.closest(".product-card");
      const priceDisplay = productCard.querySelector(".price-value");
      const sliceInput = productCard.querySelector(".slice-number-input");
      
      if (e.target.checked) {
        const wholePrice = e.target.getAttribute("data-whole-price");
        priceDisplay.textContent = wholePrice;
        sliceInput.disabled = true;
        sliceInput.parentElement.style.opacity = "0.5";
      } else {
        sliceInput.disabled = false;
        sliceInput.parentElement.style.opacity = "1";
        updateCakePrice(sliceInput);
      }
    });
  });

  // Handle payment method changes
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", handlePaymentMethodChange);
  });

  // Handle amount tendered input
  const amountTenderedInput = document.getElementById("amountTendered");
  if (amountTenderedInput) {
    amountTenderedInput.addEventListener("input", calculateChange);
  }

  // ==================== ADD TO CART ====================
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product-card");
      const name = productCard.querySelector(".product-name").textContent;
      const priceValue = productCard.querySelector(".price-value").textContent;
      const price = parseFloat(priceValue);
      const quantity = parseInt(productCard.querySelector(".qty-input").value);

      // Get temperature (if available - for coffee)
      const tempRadio = productCard.querySelector('input[type="radio"][name^="temp-"]:checked');
      const temperature = tempRadio ? tempRadio.value : null;

      // Get size (if available - for coffee)
      const sizeRadio = productCard.querySelector('input[type="radio"][name^="size-"]:checked');
      const size = sizeRadio ? sizeRadio.value : null;

      // Get flavor (if available - for pastries)
      const flavorRadio = productCard.querySelector('input[type="radio"][name^="flavor-"]:checked');
      const flavor = flavorRadio ? flavorRadio.value : null;

      // Get slice info (if available - for cakes)
      const sliceInput = productCard.querySelector('.slice-number-input');
      const wholeCakeCheckbox = productCard.querySelector('.whole-cake-checkbox');
      let sliceInfo = null;
      
      if (sliceInput) {
        if (wholeCakeCheckbox && wholeCakeCheckbox.checked) {
          sliceInfo = "Whole Cake";
        } else {
          const numSlices = parseInt(sliceInput.value);
          sliceInfo = `${numSlices} Slice${numSlices > 1 ? 's' : ''}`;
        }
      }

      // Create unique item identifier
      const itemId = `${name}-${temperature || 'none'}-${size || 'none'}-${flavor || 'none'}-${sliceInfo || 'none'}`;

      // Check if item already exists in cart
      const existingItem = cart.find((item) => item.id === itemId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: itemId,
          name: name,
          price: price,
          quantity: quantity,
          temperature: temperature,
          size: size,
          flavor: flavor,
          sliceInfo: sliceInfo,
        });
      }

      updateCart();
      showNotification(`${name} added to cart!`);
      
      // Reset quantity to 1 after adding
      productCard.querySelector(".qty-input").value = 1;
    });
  });

  // ==================== CATEGORY FILTER ====================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");

        // Update active button
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Filter products
        productCards.forEach((card) => {
          if (category === "all" || card.getAttribute("data-category") === category) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }
});

// ==================== UPDATE CART ====================
function updateCart() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart modal
  const cartItemsDiv = document.getElementById("cartItems");
  const totalAmountSpan = document.getElementById("totalAmount");

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty.<br>Add some delicious items to get started!</p>';
    totalAmountSpan.textContent = "0";
    return;
  }

  let cartHTML = '<div class="cart-items-list">';
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    // Build item details
    let itemDetails = "";
    if (item.temperature) {
      itemDetails += `<div class="cart-item-temp">${item.temperature}</div>`;
    }
    if (item.size) {
      itemDetails += `<div class="cart-item-price">Size: ${item.size}</div>`;
    }
    if (item.flavor) {
      itemDetails += `<div class="cart-item-price">Flavor: ${item.flavor}</div>`;
    }
    if (item.sliceInfo) {
      itemDetails += `<div class="cart-item-price">${item.sliceInfo}</div>`;
    }

    cartHTML += `
      <div class="cart-item-card">
        <div class="cart-item-header">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            ${itemDetails}
          </div>
          <div class="cart-item-controls">
            <div class="cart-qty-controls">
              <button class="cart-qty-btn" onclick="decreaseCartQty(${index})">−</button>
              <span class="cart-qty-display">${item.quantity}</span>
              <button class="cart-qty-btn" onclick="increaseCartQty(${index})">+</button>
            </div>
          </div>
        </div>
        <div class="cart-item-footer">
          <div class="cart-item-subtotal">₱${subtotal.toFixed(2)}</div>
          <button class="cart-remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  cartHTML += "</div>";
  cartItemsDiv.innerHTML = cartHTML;
  totalAmountSpan.textContent = total.toFixed(2);
}

// ==================== CART QUANTITY CONTROLS ====================
function increaseCartQty(index) {
  cart[index].quantity++;
  updateCart();
}

function decreaseCartQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    updateCart();
  }
}

function removeFromCart(index) {
  const itemName = cart[index].name;
  cart.splice(index, 1);
  updateCart();
  showNotification(`${itemName} removed from cart`);
}

// ==================== CART MODAL ====================
if (cartBtn) {
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartModal.style.display = "block";
  });
}

if (closeModal) {
  closeModal.addEventListener("click", () => {
    cartModal.style.display = "none";
  });
}

// ==================== CHECKOUT FUNCTIONALITY ====================
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showNotification("Your cart is empty!");
      return;
    }

    // Close cart modal
    cartModal.style.display = "none";

    // Populate checkout modal
    updateCheckoutModal();

    // Show checkout modal
    checkoutModal.style.display = "block";

    // Initialize payment method view
    handlePaymentMethodChange();
  });
}

if (closeCheckout) {
  closeCheckout.addEventListener("click", () => {
    checkoutModal.style.display = "none";
  });
}

function updateCheckoutModal() {
  const checkoutItemsDiv = document.getElementById("checkoutItems");
  const checkoutTotalSpan = document.getElementById("checkoutTotal");

  let checkoutHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    let itemDetails = "";
    if (item.temperature) {
      itemDetails += ` (${item.temperature})`;
    }
    if (item.size) {
      itemDetails += ` - ${item.size}`;
    }
    if (item.flavor) {
      itemDetails += ` - ${item.flavor}`;
    }
    if (item.sliceInfo) {
      itemDetails += ` - ${item.sliceInfo}`;
    }

    checkoutHTML += `
      <div class="checkout-item">
        <div class="checkout-item-info">
          <span class="checkout-item-name">${item.name}${itemDetails}</span>
          <span class="checkout-item-qty">x${item.quantity}</span>
        </div>
        <span class="checkout-item-price">₱${subtotal.toFixed(2)}</span>
      </div>
    `;
  });

  checkoutItemsDiv.innerHTML = checkoutHTML;
  checkoutTotalSpan.textContent = total.toFixed(2);
}

// ==================== GENERATE RECEIPT ====================
function generateReceipt(paymentData) {
  const receiptDate = new Date();
  const receiptNumber = 'JLJM' + Date.now().toString().slice(-8);
  
  let receiptHTML = `
    <div class="receipt-header">
      <div class="receipt-logo">☕</div>
      <h2>JLJM Timeless Cup</h2>
      <p>Las Piñas City, Philippines</p>
      <p>+63 967 408 1628</p>
      <p>escxrio@gmail.com</p>
    </div>
    
    <div class="receipt-divider"></div>
    
    <div class="receipt-info">
      <div class="receipt-row">
        <span>Receipt No:</span>
        <span>${receiptNumber}</span>
      </div>
      <div class="receipt-row">
        <span>Date:</span>
        <span>${receiptDate.toLocaleDateString()} ${receiptDate.toLocaleTimeString()}</span>
      </div>
      <div class="receipt-row">
        <span>Payment:</span>
        <span>${paymentData.method}</span>
      </div>
  `;
  
  // Add transaction details based on payment method
  if (paymentData.method === "GCash") {
    receiptHTML += `
      <div class="receipt-row">
        <span>GCash Number:</span>
        <span>${paymentData.gcashNumber}</span>
      </div>
    `;
  } else if (paymentData.method === "Credit Card") {
    receiptHTML += `
      <div class="receipt-row">
        <span>Card Number:</span>
        <span>**** **** **** ${paymentData.cardNumber.slice(-4)}</span>
      </div>
    `;
  } else if (paymentData.method === "Debit Card") {
    receiptHTML += `
      <div class="receipt-row">
        <span>Card Number:</span>
        <span>**** **** **** ${paymentData.debitCardNumber.slice(-4)}</span>
      </div>
    `;
  }
  
  receiptHTML += `</div><div class="receipt-divider"></div><div class="receipt-items">`;
  
  let total = 0;
  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    
    let itemDetails = "";
    if (item.temperature) itemDetails += ` (${item.temperature})`;
    if (item.size) itemDetails += ` - ${item.size}`;
    if (item.flavor) itemDetails += ` - ${item.flavor}`;
    if (item.sliceInfo) itemDetails += ` - ${item.sliceInfo}`;
    
    receiptHTML += `
      <div class="receipt-item">
        <div class="receipt-item-details">
          <div class="receipt-item-name">${item.name}${itemDetails}</div>
          <div class="receipt-item-qty">${item.quantity} x ₱${item.price.toFixed(2)}</div>
        </div>
        <div class="receipt-item-total">₱${subtotal.toFixed(2)}</div>
      </div>
    `;
  });
  
  receiptHTML += `
    </div>
    <div class="receipt-divider"></div>
    <div class="receipt-total">
      <div class="receipt-row total">
        <span>TOTAL</span>
        <span>₱${total.toFixed(2)}</span>
      </div>
  `;
  
  if (paymentData.method === "Cash") {
    receiptHTML += `
      <div class="receipt-row">
        <span>Amount Tendered</span>
        <span>₱${paymentData.amountTendered.toFixed(2)}</span>
      </div>
      <div class="receipt-row">
        <span>Change</span>
        <span>₱${paymentData.change.toFixed(2)}</span>
      </div>
    `;
  }
  
  receiptHTML += `
    </div>
    <div class="receipt-divider"></div>
    <div class="receipt-footer">
      <p>Thank you for your order!</p>
      <p>Where every sip tells a timeless story</p>
      <p>Visit us again soon!</p>
    </div>
  `;
  
  return receiptHTML;
}

// ==================== CONFIRM ORDER ====================
if (confirmOrderBtn) {
  confirmOrderBtn.addEventListener("click", () => {
    // Get selected payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    
    if (!selectedPayment) {
      showNotification("Please select a payment method!");
      return;
    }

    const paymentMethod = selectedPayment.value;
    const total = parseFloat(document.getElementById("checkoutTotal").textContent);
    
    const paymentData = {
      method: paymentMethod
    };

    // Validate payment method specific details
    if (paymentMethod === "Cash") {
      const amountTendered = parseFloat(document.getElementById("amountTendered").value);
      
      if (!amountTendered || amountTendered < total) {
        showNotification("Please enter a valid amount tendered (must be greater than or equal to total)!");
        return;
      }
      
      paymentData.amountTendered = amountTendered;
      paymentData.change = amountTendered - total;
      
    } else if (paymentMethod === "GCash") {
      const gcashNumber = document.getElementById("gcashNumber").value;
      
      if (!gcashNumber || gcashNumber.length !== 11) {
        showNotification("Please enter a valid 11-digit GCash number!");
        return;
      }
      
      paymentData.gcashNumber = gcashNumber;
      
    } else if (paymentMethod === "Credit Card") {
      const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, '');
      const cardExpiry = document.getElementById("cardExpiry").value;
      const cardCVV = document.getElementById("cardCVV").value;
      
      if (!cardNumber || cardNumber.length < 13) {
        showNotification("Please enter a valid card number!");
        return;
      }
      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        showNotification("Please enter a valid expiry date (MM/YY)!");
        return;
      }
      if (!cardCVV || cardCVV.length !== 3) {
        showNotification("Please enter a valid CVV!");
        return;
      }
      
      paymentData.cardNumber = cardNumber;
      
    } else if (paymentMethod === "Debit Card") {
      const debitCardNumber = document.getElementById("debitCardNumber").value.replace(/\s/g, '');
      const debitCardExpiry = document.getElementById("debitCardExpiry").value;
      const debitCardCVV = document.getElementById("debitCardCVV").value;
      
      if (!debitCardNumber || debitCardNumber.length < 13) {
        showNotification("Please enter a valid card number!");
        return;
      }
      if (!debitCardExpiry || !/^\d{2}\/\d{2}$/.test(debitCardExpiry)) {
        showNotification("Please enter a valid expiry date (MM/YY)!");
        return;
      }
      if (!debitCardCVV || debitCardCVV.length !== 3) {
        showNotification("Please enter a valid CVV!");
        return;
      }
      
      paymentData.debitCardNumber = debitCardNumber;
    }

    // Generate and show receipt
    const receiptHTML = generateReceipt(paymentData);
    document.getElementById("receiptContent").innerHTML = receiptHTML;
    
    // Close checkout modal
    checkoutModal.style.display = "none";
    
    // Show receipt modal
    receiptModal.style.display = "block";
    
    // Show success message
    showNotification(`Order confirmed! Total: ₱${total.toFixed(2)} via ${paymentMethod}`);
    
    // Clear form inputs
    document.getElementById("amountTendered").value = "";
    document.getElementById("gcashNumber").value = "";
    document.getElementById("cardNumber").value = "";
    document.getElementById("cardExpiry").value = "";
    document.getElementById("cardCVV").value = "";
    document.getElementById("debitCardNumber").value = "";
    document.getElementById("debitCardExpiry").value = "";
    document.getElementById("debitCardCVV").value = "";
  });
}

// ==================== RECEIPT MODAL ====================
if (closeReceipt) {
  closeReceipt.addEventListener("click", () => {
    receiptModal.style.display = "none";
    // Clear cart after closing receipt
    cart = [];
    updateCart();
  });
}

if (printReceiptBtn) {
  printReceiptBtn.addEventListener("click", () => {
    window.print();
  });
}

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
  if (e.target === checkoutModal) {
    checkoutModal.style.display = "none";
  }
  if (e.target === receiptModal) {
    receiptModal.style.display = "none";
    // Clear cart after closing receipt
    cart = [];
    updateCart();
  }
});

// ==================== NOTIFICATION ====================
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  // Add to body
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});
