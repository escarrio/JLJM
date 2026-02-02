// ==================== CART FUNCTIONALITY ====================
let cart = [];

// Initialize cart from localStorage
function initCart() {
  const savedCart = localStorage.getItem('coffeeCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('coffeeCart', JSON.stringify(cart));
}

// Update cart count in navigation
function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

// Add/Update item in cart
function updateCart(itemName, price, quantity) {
  const existingItem = cart.find(item => item.name === itemName);
  
  if (quantity === 0) {
    // Remove item if quantity is 0
    cart = cart.filter(item => item.name !== itemName);
  } else if (existingItem) {
    // Update existing item
    existingItem.quantity = quantity;
  } else {
    // Add new item
    cart.push({
      name: itemName,
      price: price,
      quantity: quantity
    });
  }
  
  saveCart();
  updateCartCount();
}

// Calculate total amount
function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Display cart items in modal
function displayCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  const totalAmountSpan = document.getElementById('totalAmount');
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<div class="empty-cart">Your cart is empty. Add some delicious items!</div>';
    totalAmountSpan.textContent = '0';
    return;
  }
  
  let cartHTML = '';
  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    cartHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-details">
            Quantity: ${item.quantity} × ₱${item.price} = ₱${subtotal}
          </div>
        </div>
      </div>
    `;
  });
  
  cartItemsDiv.innerHTML = cartHTML;
  totalAmountSpan.textContent = calculateTotal();
}

// ==================== QUANTITY CONTROLS ====================
if (document.querySelector('tbody')) {
  const rows = document.querySelectorAll('tbody tr[data-item]');
  
  rows.forEach(row => {
    const itemName = row.dataset.item;
    const itemPrice = parseInt(row.dataset.price);
    const qtyInput = row.querySelector('.qty-input');
    const minusBtn = row.querySelector('.minus');
    const plusBtn = row.querySelector('.plus');
    
    // Load saved quantity from cart
    const savedItem = cart.find(item => item.name === itemName);
    if (savedItem) {
      qtyInput.value = savedItem.quantity;
    }
    
    // Plus button
    plusBtn.addEventListener('click', () => {
      const currentQty = parseInt(qtyInput.value);
      const newQty = currentQty + 1;
      qtyInput.value = newQty;
      updateCart(itemName, itemPrice, newQty);
      
      // Add animation
      qtyInput.style.transform = 'scale(1.2)';
      setTimeout(() => {
        qtyInput.style.transform = 'scale(1)';
      }, 200);
    });
    
    // Minus button
    minusBtn.addEventListener('click', () => {
      const currentQty = parseInt(qtyInput.value);
      if (currentQty > 0) {
        const newQty = currentQty - 1;
        qtyInput.value = newQty;
        updateCart(itemName, itemPrice, newQty);
        
        // Add animation
        qtyInput.style.transform = 'scale(0.8)';
        setTimeout(() => {
          qtyInput.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });
}

// ==================== CART MODAL ====================
const modal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');
const closeBtn = document.querySelector('.close');
const checkoutBtn = document.getElementById('checkoutBtn');

if (cartBtn) {
  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    displayCart();
    modal.style.display = 'block';
  });
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    const total = calculateTotal();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let orderSummary = 'Order Summary:\n\n';
    cart.forEach(item => {
      orderSummary += `${item.name} x${item.quantity} = ₱${item.price * item.quantity}\n`;
    });
    orderSummary += `\nTotal Items: ${itemCount}\nTotal Amount: ₱${total}`;
    
    if (confirm(orderSummary + '\n\nProceed with checkout?')) {
      alert('Thank you for your order! Your total is ₱' + total);
      
      // Clear cart
      cart = [];
      saveCart();
      updateCartCount();
      
      // Reset all quantity inputs
      document.querySelectorAll('.qty-input').forEach(input => {
        input.value = 0;
      });
      
      modal.style.display = 'none';
    }
  });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// ==================== HEADER SCROLL EFFECT ====================
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ==================== TABLE ROW ANIMATIONS (for Dashboard page) ====================
if (document.querySelector("tbody")) {
  window.addEventListener("load", () => {
    const rows = document.querySelectorAll("tbody tr");
    
    rows.forEach((row, index) => {
      row.style.opacity = "0";
      row.style.transform = "translateX(-30px)";
      row.style.transition = "all 0.5s ease";
      
      setTimeout(() => {
        row.style.opacity = "1";
        row.style.transform = "translateX(0)";
      }, index * 80);
    });
  });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// ==================== PARALLAX EFFECT FOR HERO ====================
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  const scrolled = window.pageYOffset;
  
  if (hero) {
    hero.style.backgroundPositionY = scrolled * 0.5 + "px";
  }
});

// ==================== FEATURE CARDS SCROLL ANIMATION ====================
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe feature cards
document.querySelectorAll(".feature-card").forEach(card => {
  observer.observe(card);
});

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
  
  // Initialize cart
  initCart();
});

// ==================== CONSOLE WELCOME MESSAGE ====================
console.log("%c☕ Welcome to JLJM Timeless Cup! ☕", 
  "color: #BA6324; font-size: 20px; font-weight: bold; padding: 10px;");
console.log("%cWhere every sip tells a timeless story.", 
  "color: #AF6E4B; font-size: 14px; font-style: italic;");
