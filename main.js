// ==================== CART FUNCTIONALITY ====================
let cart = [];

// Initialize cart from localStorage
function initCart() {
  const savedCart = localStorage.getItem('jljmCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
    syncQuantityInputs();
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('jljmCart', JSON.stringify(cart));
}

// Update cart count in navigation
function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Add animation
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
      cartCount.style.transform = 'scale(1)';
    }, 300);
  }
}

// Sync quantity inputs with cart data
function syncQuantityInputs() {
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const itemName = card.dataset.item;
    const qtyInput = card.querySelector('.qty-input');
    
    // Find matching cart item (considering temperature if applicable)
    const savedItems = cart.filter(item => item.name === itemName);
    if (savedItems.length > 0 && qtyInput) {
      // Sum up quantities for all temperature variants
      const totalQty = savedItems.reduce((sum, item) => sum + item.quantity, 0);
      qtyInput.value = totalQty;
    } else if (qtyInput) {
      qtyInput.value = 0;
    }
  });
}

// Get selected temperature for item
function getSelectedTemperature(card) {
  const tempOptions = card.querySelectorAll('input[type="radio"]');
  if (tempOptions.length > 0) {
    const checkedOption = card.querySelector('input[type="radio"]:checked');
    return checkedOption ? checkedOption.value : 'hot';
  }
  return null; // No temperature option
}

// Add/Update item in cart
function updateCart(itemName, price, quantity, temperature) {
  // Create unique key with temperature if applicable
  const cartKey = temperature ? `${itemName} (${temperature})` : itemName;
  const existingItem = cart.find(item => item.cartKey === cartKey);
  
  if (quantity === 0) {
    cart = cart.filter(item => item.cartKey !== cartKey);
  } else if (existingItem) {
    existingItem.quantity = quantity;
  } else {
    cart.push({
      name: itemName,
      price: price,
      quantity: quantity,
      temperature: temperature,
      cartKey: cartKey
    });
  }
  
  saveCart();
  updateCartCount();
}

// Calculate total amount
function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update item quantity in cart modal
function updateCartItemQuantity(cartKey, newQuantity) {
  const item = cart.find(item => item.cartKey === cartKey);
  if (item) {
    if (newQuantity <= 0) {
      cart = cart.filter(item => item.cartKey !== cartKey);
      showToast('Item removed from cart');
    } else {
      item.quantity = newQuantity;
    }
    saveCart();
    updateCartCount();
    displayCart();
    syncQuantityInputs();
  }
}

// Remove item from cart
function removeCartItem(cartKey) {
  cart = cart.filter(item => item.cartKey !== cartKey);
  saveCart();
  updateCartCount();
  displayCart();
  syncQuantityInputs();
  showToast('Item removed from cart');
}

// Display cart items in modal
function displayCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  const totalAmountSpan = document.getElementById('totalAmount');
  
  if (!cartItemsDiv || !totalAmountSpan) return;
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<div class="empty-cart">☕ Your cart is empty<br>Start adding your favorites!</div>';
    totalAmountSpan.textContent = '0';
    return;
  }
  
  let cartHTML = '<div class="cart-items-list">';
  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    const displayName = item.temperature 
      ? `${item.name}`
      : item.name;
    const tempInfo = item.temperature 
      ? `<div class="cart-item-temp">Temperature: ${item.temperature.charAt(0).toUpperCase() + item.temperature.slice(1)}</div>`
      : '';
    
    cartHTML += `
      <div class="cart-item-card" data-cart-key="${item.cartKey}">
        <div class="cart-item-header">
          <div class="cart-item-info">
            <span class="cart-item-name">${displayName}</span>
            ${tempInfo}
            <span class="cart-item-price">₱${item.price} each</span>
          </div>
          <div class="cart-item-controls">
            <div class="cart-qty-controls">
              <button class="cart-qty-btn cart-minus" data-cart-key="${item.cartKey}" type="button">−</button>
              <span class="cart-qty-display">${item.quantity}</span>
              <button class="cart-qty-btn cart-plus" data-cart-key="${item.cartKey}" type="button">+</button>
            </div>
          </div>
        </div>
        <div class="cart-item-footer">
          <button class="cart-remove-btn" data-cart-key="${item.cartKey}" type="button">Remove</button>
          <div class="cart-item-subtotal">Subtotal: ₱${subtotal.toLocaleString()}</div>
        </div>
      </div>
    `;
  });
  cartHTML += '</div>';
  
  const total = calculateTotal();
  cartItemsDiv.innerHTML = cartHTML;
  totalAmountSpan.textContent = total.toLocaleString();
  
  // Attach event listeners immediately after rendering
  attachCartButtonListeners();
}

// Attach event listeners directly to cart buttons
function attachCartButtonListeners() {
  // Plus buttons
  document.querySelectorAll('.cart-plus').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const cartKey = this.getAttribute('data-cart-key');
      const item = cart.find(i => i.cartKey === cartKey);
      if (item) {
        updateCartItemQuantity(cartKey, item.quantity + 1);
      }
    });
  });
  
  // Minus buttons
  document.querySelectorAll('.cart-minus').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const cartKey = this.getAttribute('data-cart-key');
      const item = cart.find(i => i.cartKey === cartKey);
      if (item) {
        updateCartItemQuantity(cartKey, item.quantity - 1);
      }
    });
  });
  
  // Remove buttons
  document.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const cartKey = this.getAttribute('data-cart-key');
      removeCartItem(cartKey);
    });
  });
}

// ==================== QUANTITY CONTROLS ====================
function setupQuantityControls() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const itemName = card.dataset.item;
    const itemPrice = parseInt(card.dataset.price);
    const qtyInput = card.querySelector('.qty-input');
    const minusBtn = card.querySelector('.minus');
    const plusBtn = card.querySelector('.plus');
    
    if (!qtyInput || !minusBtn || !plusBtn) return;
    
    // Plus button
    plusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentQty = parseInt(qtyInput.value);
      const newQty = currentQty + 1;
      const temperature = getSelectedTemperature(card);
      
      qtyInput.value = newQty;
      updateCart(itemName, itemPrice, newQty, temperature);
      
      // Animation
      qtyInput.style.transform = 'scale(1.2)';
      plusBtn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        qtyInput.style.transform = 'scale(1)';
        plusBtn.style.transform = 'scale(1)';
      }, 200);
      
      // Show success feedback
      const tempLabel = temperature ? ` (${temperature})` : '';
      showToast(`Added ${itemName}${tempLabel} to cart!`);
    });
    
    // Minus button
    minusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentQty = parseInt(qtyInput.value);
      if (currentQty > 0) {
        const newQty = currentQty - 1;
        const temperature = getSelectedTemperature(card);
        
        qtyInput.value = newQty;
        updateCart(itemName, itemPrice, newQty, temperature);
        
        // Animation
        qtyInput.style.transform = 'scale(0.8)';
        minusBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
          qtyInput.style.transform = 'scale(1)';
          minusBtn.style.transform = 'scale(1)';
        }, 200);
        
        if (newQty === 0) {
          const tempLabel = temperature ? ` (${temperature})` : '';
          showToast(`Removed ${itemName}${tempLabel} from cart`);
        }
      }
    });
    
    // Temperature change handler - reset quantity when temperature changes
    const tempRadios = card.querySelectorAll('input[type="radio"]');
    tempRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        qtyInput.value = 0;
        showToast(`Temperature changed to ${radio.value}`);
      });
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
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  });
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty! Please add items before checkout.');
      return;
    }
    
    const total = calculateTotal();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let orderSummary = '═══════════════════════════════\n';
    orderSummary += '        📋 ORDER SUMMARY\n';
    orderSummary += '═══════════════════════════════\n\n';
    
    cart.forEach(item => {
      const tempLabel = item.temperature ? ` (${item.temperature.charAt(0).toUpperCase() + item.temperature.slice(1)})` : '';
      const subtotal = item.price * item.quantity;
      orderSummary += `${item.name}${tempLabel}\n`;
      orderSummary += `  ${item.quantity} × ₱${item.price} = ₱${subtotal.toLocaleString()}\n\n`;
    });
    
    orderSummary += '═══════════════════════════════\n';
    orderSummary += `Total Items: ${itemCount}\n`;
    orderSummary += `Total Amount: ₱${total.toLocaleString()}\n`;
    orderSummary += '═══════════════════════════════';
    
    if (confirm(orderSummary + '\n\nProceed with checkout?')) {
      showToast('Thank you for your order! ☕', 3000);
      
      // Clear cart
      cart = [];
      saveCart();
      updateCartCount();
      
      // Reset all quantity inputs
      document.querySelectorAll('.qty-input').forEach(input => {
        input.value = 0;
      });
      
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
});

// ==================== NAVIGATION ====================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Mobile menu toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Close mobile menu when clicking nav link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
  });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ==================== CATEGORY FILTER (Dashboard) ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter products
    productCards.forEach((card, index) => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
        card.style.animation = 'none';
        setTimeout(() => {
          card.style.animation = `productFadeIn 0.6s ease-out ${index * 0.1}s forwards`;
        }, 10);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ==================== INTERSECTION OBSERVER ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Add stagger animation for cards
      if (entry.target.classList.contains('about-card')) {
        const cards = document.querySelectorAll('.about-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 150);
        });
      }
    }
  });
}, observerOptions);

// Observe sections
document.querySelectorAll('.about-section, .menu-section, .experience-section').forEach(section => {
  observer.observe(section);
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  
  if (hero) {
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
  }
});

// ==================== TOAST NOTIFICATION ====================
function showToast(message, duration = 2000) {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #C9A788, #A67C52);
    color: white;
    padding: 16px 24px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.4s ease-out;
    max-width: 300px;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.4s ease-out';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, duration);
}

// Add toast animations to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  // Initialize cart and quantity controls
  initCart();
  setupQuantityControls();
});

// ==================== MENU CARD HOVER EFFECT ====================
const menuCards = document.querySelectorAll('.menu-card, .product-card');
menuCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// ==================== ACTIVE NAV LINK ====================
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= (sectionTop - 100)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

// ==================== CONSOLE WELCOME MESSAGE ====================
console.log(
  '%c☕ Welcome to JLJM Timeless Cup! ☕',
  'color: #C9A788; font-size: 24px; font-weight: bold; padding: 10px; font-family: Playfair Display, serif;'
);
console.log(
  '%cWhere every sip tells a timeless story.',
  'color: #A67C52; font-size: 16px; font-style: italic; padding: 5px;'
);
console.log(
  '%cEnjoy your coffee experience! 🎨',
  'color: #6F4E37; font-size: 14px; padding: 5px;'
);
