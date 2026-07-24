/* =========================================================
   XOVA — script.js
   Vanilla JavaScript. No frameworks, no build step.
   Sections:
   1. Product data (edit this array to add/remove products)
   2. Config
   3. State + LocalStorage cart
   4. Rendering (products, cart)
   5. Filtering / search
   6. Cart interactions
   7. WhatsApp checkout
   8. UI chrome (navbar, mobile menu, modal, toast, scroll-top)
   9. Animations (reveal on scroll, counters, cursor glow, ripple)
   ========================================================= */

/* ---------------------------------------------------------
   1. PRODUCT DATA
   Add a new product by copying an object below and giving it
   a unique id. Images live in /images and are referenced by
   plain file path — swap the .jpg files, keep the filenames,
   and the new photos show up automatically.
   --------------------------------------------------------- */
const PRODUCTS = [
  {
    id: 1,
    name: "Droup Shoulder",
    price: 499,
    oldPrice: 599,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#0c0c0f", "#3a3a42"],
    desc: "Over size drop shoulder T-shirt. Fabric-cotton. GSM-230+.",
    image: "product1.jpeg",
    tag: "sale",
    isNew: false,
    bestseller: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "Droup Shoulder",
    price: 499,
    oldPrice: null,
    category: "T-Shirts",
    sizes: ["XS", "S", "M"],
    colors: ["#1a1a1f", "#5a4fcf"],
    desc: "Over size drop shoulder T-shirt. Fabric-cotton. GSM-230+.",
    image: "product2.jpeg",
    tag: "new",
    isNew: true,
    bestseller: false,
    rating: 4.9
  },
  {
    id: 3,
    name: "Droup Shoulder",
    price: 499,
    oldPrice: null,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#0c0c0f", "#c9c9d1"],
    desc: "Over size drop shoulder T-shirt. Fabric-cotton. GSM-230+.",
    image: "product3.jpeg",
    tag: "",
    isNew: false,
    bestseller: true,
    rating: 4.6
  },
  {
    id: 4,
    name: "Droup Shoulder",
    price: 499,
    oldPrice: null,
    category: "T-Shirts",
    sizes: ["M", "L", "XL"],
    colors: ["#232228", "#8b5cf6"],
    desc: "Over size drop shoulder T-shirt. Fabric-cotton. GSM-230+.",
    image: "product4.jpeg",
    tag: "sale",
    isNew: false,
    bestseller: false,
    rating: 4.7
  },
  {
    id: 5,
    name: "Droup Shoulder",
    price: 499,
    oldPrice: null,
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#101014", "#4d9fff"],
    desc: "Over size drop shoulder T-shirt. Fabric-cotton. GSM-230+.",
    image: "product5.jpeg",
    tag: "new",
    isNew: true,
    bestseller: false,
    rating: 4.8
  },
  {
    id: 6,
    name: "Droup Shoulder",
    price: 499,
    oldPrice: 1990,
    category: "T-Shirts",
    sizes: ["S", "M", "L"],
    colors: ["#0c0c0f", "#4d9fff"],
    desc: "Over size drop shoulder T-shirt. Fabric-cotton. GSM-230+.",
    image: "product6.jpeg",
    tag: "sale",
    isNew: false,
    bestseller: false,
    rating: 4.5
  },
  {
    id: 7,
    name: "Droup Shoulder",
    price: 499,
    oldPrice: null,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#1c1c22", "#3a3a42"],
    desc: "Over size drop shoulder T-shirt. Fabric-cotton. GSM-230+.",
    image: "product7.jpeg",
    tag: "best",
    isNew: false,
    bestseller: true,
    rating: 4.9
  },
  {
    id: 8,
    name: "Droup Shoulder",
    price: 499,
    oldPrice: null,
    category: "T-Shirts",
    sizes: ["S", "M", "L"],
    colors: ["#111116", "#8b5cf6"],
    desc: "Over size drop shoulder T-shirt. Fabric-cotton. GSM-230+.",
    image: "product8.jpeg",
    tag: "best",
    isNew: false,
    bestseller: true,
    rating: 4.7
  }
];

/* ---------------------------------------------------------
   2. CONFIG
   --------------------------------------------------------- */
const CONFIG = {
  whatsappNumber: "8801344631271", // digits only, country code first, no +
  currency: "৳",
  shopName: "XOVA"
};

/* ---------------------------------------------------------
   3. STATE + LOCALSTORAGE CART
   --------------------------------------------------------- */
const CART_KEY = "xova_cart_v1";
const WISHLIST_KEY = "xova_wishlist_v1";

let cart = loadCart();
let wishlist = loadWishlist();
let activeCategory = "All";
let searchTerm = "";
let visibleCount = 8;

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
}
function loadWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveWishlist() {
  try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); } catch (e) {}
}

/* ---------------------------------------------------------
   4. RENDERING — PRODUCTS
   --------------------------------------------------------- */
const productGrid = document.getElementById("product-grid");
const resultsCount = document.getElementById("results-count");
const loadMoreBtn = document.getElementById("load-more-btn");

function formatPrice(n) {
  return CONFIG.currency + n.toLocaleString("en-US");
}

function badgeMarkup(p) {
  if (p.tag === "sale") return `<span class="badge sale">Sale</span>`;
  if (p.tag === "new") return `<span class="badge new">New</span>`;
  if (p.tag === "best") return `<span class="badge best">Best Seller</span>`;
  return "";
}

function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();
  const toShow = filtered.slice(0, visibleCount);

  if (resultsCount) {
    resultsCount.textContent = `${filtered.length} piece${filtered.length !== 1 ? "s" : ""}`;
  }

  if (!toShow.length) {
    productGrid.innerHTML = `
      <div class="cart-empty" style="grid-column:1/-1; padding-block: 4rem;">
        <i class="fa-regular fa-face-frown"></i>
        <p>No pieces match your search. Try another keyword or category.</p>
      </div>`;
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
    return;
  }

  productGrid.innerHTML = toShow.map((p, i) => `
    <article class="product-card" data-reveal="up" style="--i:${i % 4}">
      <div class="card-media">
        <div class="card-badges">${badgeMarkup(p)}</div>
        <button class="card-wishlist ${wishlist.includes(p.id) ? "active" : ""}" data-wishlist="${p.id}" aria-label="Toggle wishlist">
          <i class="fa-regular fa-heart"></i>
        </button>
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <div class="card-quickview">
          <button class="btn btn-primary btn-sm btn-block" data-add-to-cart="${p.id}">
            <i class="fa-solid fa-bag-shopping"></i> Buy Now
          </button>
        </div>
      </div>
      <div class="card-body">
        <span class="card-cat">${p.category}</span>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-meta">
          <span class="meta-pill">Sizes: ${p.sizes.join(" / ")}</span>
        </div>
        <div class="card-meta">
          <div class="color-dots">
            ${p.colors.map(c => `<span class="color-dot" style="background:${c}"></span>`).join("")}
          </div>
        </div>
        <div class="card-footer">
          <div class="price-wrap">
            <span class="price">${formatPrice(p.price)}</span>
            ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ""}
          </div>
          <button class="icon-btn" data-add-to-cart="${p.id}" aria-label="Add to cart">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </article>
  `).join("");

  if (loadMoreBtn) {
    loadMoreBtn.style.display = filtered.length > visibleCount ? "inline-flex" : "none";
  }

  observeReveals();
}

/* ---------------------------------------------------------
   5. FILTERING / SEARCH
   --------------------------------------------------------- */
const filterChips = document.querySelectorAll("[data-filter]");
const searchInput = document.getElementById("product-search");

filterChips.forEach(chip => {
  chip.addEventListener("click", () => {
    filterChips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeCategory = chip.dataset.filter;
    visibleCount = 8;
    renderProducts();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    visibleCount = 8;
    renderProducts();
  });
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    visibleCount += 4;
    renderProducts();
  });
}

/* ---------------------------------------------------------
   6. CART INTERACTIONS
   --------------------------------------------------------- */
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEls = document.querySelectorAll(".cart-count");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartTotalEl = document.getElementById("cart-total");
const cartOpenBtns = document.querySelectorAll("[data-cart-open]");
const cartCloseBtns = document.querySelectorAll("[data-cart-close]");
const checkoutBtn = document.getElementById("checkout-btn");

function cartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
function cartSubtotal() {
  return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

cartOpenBtns.forEach(btn => btn.addEventListener("click", openCart));
cartCloseBtns.forEach(btn => btn.addEventListener("click", closeCart));
cartOverlay.addEventListener("click", closeCart);

function addToCart(id, size, color) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const chosenSize = size || product.sizes[0];
  const chosenColor = color || product.colors[0];
  const key = `${id}-${chosenSize}-${chosenColor}`;
  const existing = cart.find(item => item.key === key);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: chosenSize,
      color: chosenColor,
      qty: 1
    });
  }
  saveCart();
  renderCart();
  showToast(`${product.name} added to cart`);
  openCart();
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.key !== key);
  }
  saveCart();
  renderCart();
}

function removeItem(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCart();
}

function renderCart() {
  cartCountEls.forEach(el => el.textContent = cartCount());

  if (!cart.length) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <p>Your cart is empty.<br>Add something beautiful.</p>
      </div>`;
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">Size ${item.size} &middot; ${formatPrice(item.price)}</div>
          <div class="qty-control">
            <button data-qty-dec="${item.key}" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button data-qty-inc="${item.key}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div>
          <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
          <div class="cart-item-remove" data-remove="${item.key}"><i class="fa-solid fa-trash-can"></i> Remove</div>
        </div>
      </div>
    `).join("");
  }

  const subtotal = cartSubtotal();
  if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal);
  if (cartTotalEl) cartTotalEl.textContent = formatPrice(subtotal);
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

// Event delegation for grid + cart buttons
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest("[data-add-to-cart]");
  if (addBtn) {
    addToCart(Number(addBtn.dataset.addToCart));
  }

  const wishBtn = e.target.closest("[data-wishlist]");
  if (wishBtn) {
    const id = Number(wishBtn.dataset.wishlist);
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter(w => w !== id);
    } else {
      wishlist.push(id);
      showToast("Added to wishlist");
    }
    saveWishlist();
    renderProducts();
  }

  const incBtn = e.target.closest("[data-qty-inc]");
  if (incBtn) changeQty(incBtn.dataset.qtyInc, 1);

  const decBtn = e.target.closest("[data-qty-dec]");
  if (decBtn) changeQty(decBtn.dataset.qtyDec, -1);

  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) removeItem(removeBtn.dataset.remove);
});

/* ---------------------------------------------------------
   7. WHATSAPP CHECKOUT
   --------------------------------------------------------- */
const orderModal = document.getElementById("order-modal");
const orderForm = document.getElementById("order-form");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (!cart.length) return;
    orderModal.classList.add("open");
  });
}

document.querySelectorAll("[data-modal-close]").forEach(btn => {
  btn.addEventListener("click", () => orderModal.classList.remove("open"));
});
if (orderModal) {
  orderModal.addEventListener("click", (e) => {
    if (e.target === orderModal) orderModal.classList.remove("open");
  });
}

if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("order-name").value.trim();
    const address = document.getElementById("order-address").value.trim();
    const phone = document.getElementById("order-phone").value.trim();

    if (!name || !address || !phone) return;

    const lines = cart.map(item =>
      `Product: ${item.name}\nQuantity: ${item.qty}\nProductID: ${item.id}\nSize: ${item.size}\nColor: ${item.color}\nPrice: ${formatPrice(item.price * item.qty)}`
    ).join("\n\n");

    const message =
`Hello ${CONFIG.shopName},

I want to order:

${lines}

Order Total: ${formatPrice(cartSubtotal())}
Delivery Charge: FREE

My Name: ${name}
My Address: ${address}
My Phone: ${phone}

Please confirm my order.`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    orderModal.classList.remove("open");
  });
}

/* Generic WhatsApp inquiry (bubble button) */
function openWhatsAppGeneral() {
  const message = `Hello ${CONFIG.shopName}, I have a question about your products.`;
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
const waBubble = document.getElementById("whatsapp-bubble");
if (waBubble) waBubble.addEventListener("click", openWhatsAppGeneral);

/* ---------------------------------------------------------
   8. UI CHROME
   --------------------------------------------------------- */
// Navbar solid-on-scroll
const navbar = document.getElementById("navbar");
const scrollTopBtn = document.getElementById("scroll-top-btn");

function handleScrollChrome() {
  const y = window.scrollY;
  if (y > 40) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");

  if (scrollTopBtn) {
    if (y > 600) scrollTopBtn.classList.add("show");
    else scrollTopBtn.classList.remove("show");
  }
}
window.addEventListener("scroll", handleScrollChrome, { passive: true });
handleScrollChrome();

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Mobile menu
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });
  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    });
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a, .mobile-menu a");
function handleActiveNav() {
  let current = "";
  sections.forEach(sec => {
    const top = sec.offsetTop - 140;
    if (window.scrollY >= top) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
}
window.addEventListener("scroll", handleActiveNav, { passive: true });

// Toast
const toastEl = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  if (!toastEl) return;
  toastEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

// Newsletter form (front-end only demo)
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Subscribed — welcome to XOVA");
    newsletterForm.reset();
  });
}

// Button ripple effect
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement("span");
  const size = Math.max(rect.width, rect.height);
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
});

/* ---------------------------------------------------------
   9. ANIMATIONS
   --------------------------------------------------------- */
// Reveal on scroll
let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  }
  document.querySelectorAll("[data-reveal]:not(.in-view)").forEach(el => revealObserver.observe(el));
}

// Animated counters
function animateCounter(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  let start = 0;
  const duration = 1600;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString() + suffix;
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll(".counter-num[data-count]").forEach(el => counterObserver.observe(el));

// Cursor glow (desktop only)
const cursorGlow = document.getElementById("cursor-glow");
if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
  window.addEventListener("mousemove", (e) => {
    cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
}

// Loading screen
window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");
  if (loader) {
    setTimeout(() => loader.classList.add("hidden"), 500);
  }
});

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
renderProducts();
renderCart();
observeReveals();
document.querySelectorAll("[data-reveal]").forEach((el, i) => {
  // stagger sections already on page load (non-grid ones)
  if (!el.closest("#product-grid")) el.style.setProperty("--i", i % 6);
});
