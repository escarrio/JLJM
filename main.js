// ==================== GLOBAL VARIABLES ====================
let cart = [];

// ==================== DOM ELEMENTS ====================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navbar = document.getElementById("navbar");
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const checkoutModal = document.getElementById("checkoutModal");
const cartCount = document.getElementById("cartCount");
const closeModal = document.getElementsByClassName("close")[0];
const closeCheckout = document.getElementById("closeCheckout");
const checkoutBtn = document.getElementById("checkoutBtn");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");

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

// ==================== SIZE/SLICE SELECTION WITH PRICE UPDATE ====================
document.addEventListener("DOMContentLoaded", () => {
  // Handle size option changes for coffee and cakes
  document.querySelectorAll(".size-option input[type='radio']").forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const productCard = e.target.closest(".product-card");
      const priceDisplay = productCard.querySelector(".price-value");
      const newPrice = e.target.getAttribute("data-price");
      priceDisplay.textContent = newPrice;
    });
  });

  // ==================== ADD TO CART ====================
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product-card");
      const name = productCard.querySelector(".product-name").textContent;
      const priceValue = productCard.querySelector(".price-value").textContent;
      const price = parseFloat(priceValue);
      const quantity = parseInt(productCard.querySelector(".qty-input").value);

      // Get temperature (if available)
      const tempRadio = productCard.querySelector('input[type="radio"][name^="temp-"]:checked');
      const temperature = tempRadio ? tempRadio.value : null;

      // Get size or slice selection
      const sizeRadio = productCard.querySelector('input[type="radio"][name^="size-"]:checked');
      const size = sizeRadio ? sizeRadio.value : null;

      // Create unique item identifier
      const itemId = `${name}-${temperature || 'none'}-${size || 'none'}`;

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

if (confirmOrderBtn) {
  confirmOrderBtn.addEventListener("click", () => {
    // Get selected payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    
    if (!selectedPayment) {
      showNotification("Please select a payment method!");
      return;
    }

    const paymentMethod = selectedPayment.value;
    const total = document.getElementById("checkoutTotal").textContent;

    // Show success message
    showNotification(`Order confirmed! Total: ₱${total} via ${paymentMethod}`);

    // Clear cart
    cart = [];
    updateCart();

    // Close checkout modal
    checkoutModal.style.display = "none";
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
