/**
 * MediaBundle Backend Integration Layer
 * Connects Webflow static HTML files with the Node.js/Mongoose Express API
 */

const API_BASE = '/api/v1';

// Style Injection for Toast Notifications and Dynamic Views
const styleSheet = document.createElement("style");
styleSheet.innerText = `
/* Toast Notifications */
#mediabundle-toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100000;
}
.mediabundle-toast {
    background: rgba(26, 26, 26, 0.95);
    color: #ffffff;
    padding: 16px 24px;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    border-left: 4px solid #ffcc00;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 500;
    min-width: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transform: translateY(-20px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.mediabundle-toast.show {
    transform: translateY(0);
    opacity: 1;
}
.mediabundle-toast.success {
    border-left-color: #2ecc71;
}
.mediabundle-toast.error {
    border-left-color: #e74c3c;
}
.mediabundle-toast-close {
    margin-left: 15px;
    cursor: pointer;
    opacity: 0.7;
    font-size: 18px;
    line-height: 1;
}
.mediabundle-toast-close:hover {
    opacity: 1;
}

/* Custom UI overlays */
.mediabundle-dynamic-item {
    animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);

// Helper to inject premium loader spinner and hide static default content
function showLoader(container) {
    if (!container) return null;
    
    // Clear static default elements
    container.innerHTML = '';
    
    const loader = document.createElement('div');
    loader.className = 'mediabundle-loader';
    loader.style.width = '100%';
    loader.style.display = 'flex';
    loader.style.justifyContent = 'center';
    loader.style.alignItems = 'center';
    loader.style.padding = '60px 0';
    
    loader.innerHTML = `
        <div class="mediabundle-spinner" style="
            width: 40px; 
            height: 40px; 
            border: 3px solid rgba(255, 204, 0, 0.15); 
            border-radius: 50%; 
            border-top-color: #ffcc00; 
            animation: spin 0.8s linear infinite;
        "></div>
    `;
    
    container.appendChild(loader);
    return loader;
}

// Create Toast Container
const toastContainer = document.createElement("div");
toastContainer.id = "mediabundle-toast-container";
document.body.appendChild(toastContainer);

// Toast display helper
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `mediabundle-toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <span class="mediabundle-toast-close">&times;</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger transition
    setTimeout(() => toast.classList.add("show"), 10);
    
    const closeToast = () => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    };
    
    toast.querySelector(".mediabundle-toast-close").addEventListener("click", closeToast);
    
    // Auto remove
    setTimeout(closeToast, 4000);
}

// API client utility
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const json = await response.json();
        
        if (!response.ok) {
            throw new Error(json.message || `HTTP error! status: ${response.status}`);
        }
        return json;
    } catch (error) {
        console.error(`API Call failed [${method} ${endpoint}]:`, error);
        throw error;
    }
}

// Global Variables
let currentSession = null;
let dbProjects = [];

// Initialize session and global elements
async function initSession() {
    try {
        // Check active session
        const meRes = await apiCall('/auth/me');
        currentSession = meRes.data;
        console.log("Active session authenticated:", currentSession.username);
    } catch (e) {
        console.log("No active session, auto-logging in default test user...");
        try {
            const loginRes = await apiCall('/auth/login', 'POST', {
                username: "testuser",
                password: "user123"
            });
            currentSession = loginRes.data.user;
            console.log("Auto-authenticated successfully as testuser");
        } catch (loginError) {
            console.error("Auto-authentication failed. Please seed the database.", loginError);
        }
    }
    
    // Update global cart indicator
    if (currentSession) {
        syncCartCount();
    }
    
    // Load projects list globally (useful for resolving IDs)
    try {
        const projRes = await apiCall('/projects?limit=100');
        dbProjects = projRes.data.projects;
    } catch (error) {
        console.error("Failed to load catalog projects:", error);
    }
}

// Sync cart indicators in header
async function syncCartCount() {
    try {
        const cartRes = await apiCall('/cart');
        const count = cartRes.data.items ? cartRes.data.items.length : 0;
        
        // Update header count indicators
        const indicators = document.querySelectorAll('.cart-quantity, .w-commerce-commercecartopenlinkcount');
        indicators.forEach(ind => {
            ind.innerHTML = count;
        });
        
        // Build dynamic drawer cart items
        renderCartDrawer(cartRes.data);
    } catch (error) {
        console.error("Cart syncing failed:", error);
    }
}

// Render dynamic cart drawer using Webflow's markup structure
function renderCartDrawer(cart) {
    const listContainer = document.querySelector('.w-commerce-commercecartlist');
    const emptyState = document.querySelector('.w-commerce-commercecartemptystate');
    const formWrapper = document.querySelector('.w-commerce-commercecartformwrapper');
    const formElement = document.querySelector('.w-commerce-commercecartform');
    const subtotalElement = document.querySelector('.w-commerce-commercecartordervalue');
    
    if (!listContainer) return;
    
    // Check if cart is empty
    if (!cart.items || cart.items.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (formElement) formElement.style.display = 'none';
        if (formWrapper) formWrapper.style.display = 'none';
        return;
    }
    
    // Show cart elements
    if (emptyState) emptyState.style.display = 'none';
    if (formWrapper) formWrapper.style.display = 'block';
    if (formElement) formElement.style.display = 'block';
    
    // Set subtotal
    if (subtotalElement) {
        subtotalElement.innerHTML = `$ ${cart.totalPrice.toFixed(2)} USD`;
    }
    
    // Render items list
    listContainer.innerHTML = ''; // Clear static items
    cart.items.forEach(item => {
        const project = item.project;
        if (!project) return;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'w-commerce-commercecartitem mediabundle-dynamic-item';
        itemElement.style.display = 'flex';
        itemElement.style.padding = '12px 0';
        itemElement.style.borderBottom = '1px solid #eee';
        
        itemElement.innerHTML = `
            <img src="${project.imageUrl || 'https://via.placeholder.com/60'}" 
                 alt="${project.title}" 
                 class="w-commerce-commercecartitemimage" 
                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 12px;" />
            <div class="w-commerce-commercecartiteminfo" style="flex: 1;">
                <div class="w-commerce-commercecartproductname" style="font-weight: 600; color: #1a1a1a;">${project.title}</div>
                <div style="font-size: 13px; color: #777; margin: 2px 0;">${project.type || 'Template'}</div>
                <div style="font-weight: 500;">$ ${item.price.toFixed(2)} USD</div>
                <a href="#" class="btn-link remove-cart-item-btn" data-id="${project._id}" style="color: #e74c3c; font-size: 12px; text-decoration: none; display: inline-block; margin-top: 6px;">Remove</a>
            </div>
        `;
        
        // Remove button handler
        itemElement.querySelector('.remove-cart-item-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            const projId = e.target.getAttribute('data-id');
            try {
                await apiCall(`/cart/items/${projId}`, 'DELETE');
                showToast("Item removed from cart");
                syncCartCount();
                
                // If we are on checkout.html, reload checkout details
                if (window.location.pathname.includes('checkout')) {
                    loadCheckoutPage();
                }
            } catch (err) {
                showToast("Failed to remove item", "error");
            }
        });
        
        listContainer.appendChild(itemElement);
    });
}

// Add item to cart handler
async function handleAddToCart(projectId) {
    if (!currentSession) {
        showToast("Session not authenticated. Please wait.", "error");
        return;
    }
    try {
        await apiCall('/cart/items', 'POST', { projectId });
        showToast("Added to cart successfully!");
        syncCartCount();
        
        // Open Webflow cart modal drawer
        const cartWrapper = document.querySelector('.w-commerce-commercecartwrapper');
        if (cartWrapper) {
            // Find and click the Cart open link to show drawer
            const cartLink = cartWrapper.querySelector('.w-commerce-commercecartopenlink');
            if (cartLink) {
                cartLink.click();
            }
        }
    } catch (error) {
        showToast(error.message || "Failed to add item to cart", "error");
    }
}

// ---------------------------------------------------
// Page specific routing / load logic
// ---------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    initSession().then(() => {
        const path = window.location.pathname;
        console.log("Loading Integration Layer for path:", path);
        
        // Global: Intercept all Add to Cart buttons
        setupGlobalAddToCartHandlers();

        if (path === '/' || path.endsWith('index') || path.endsWith('index.html')) {
            loadHomePage();
        } else if (path.includes('pricing')) {
            loadPricingPage();
        } else if (path.includes('checkout')) {
            loadCheckoutPage();
        } else if (path.includes('contact')) {
            loadContactPage();
        }
    });
});

// Setup handlers for detail pages or static buttons
function setupGlobalAddToCartHandlers() {
    // Intercept standard Add to Cart forms (e.g. product detail pages)
    const addToCartForms = document.querySelectorAll('form[data-node-type="commerce-add-to-cart-form"]');
    addToCartForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Resolve project by header text or slug
            const pageTitleElement = document.querySelector('h1, h2');
            const pageTitle = pageTitleElement ? pageTitleElement.textContent.trim() : "";
            const matchedProj = dbProjects.find(p => p.title.toLowerCase() === pageTitle.toLowerCase());
            
            if (matchedProj) {
                handleAddToCart(matchedProj._id);
            } else {
                showToast("Could not resolve product package details.", "error");
            }
        });
    });
}

// 1. Home Page
function loadHomePage() {
    // We can dynamically update featured projects/blogs if template exists,
    // but we can leave home static to keep loading instantaneous.
}

// 3. Pricing Page (Hooks buttons to add-to-cart)
function loadPricingPage() {
    // Pricing page lists plans statically. We intercept clicks on plan buttons:
    const selectButtons = document.querySelectorAll('.pricing-item a.primary-button');
    selectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Get package name from closest card h5 title
            const card = btn.closest('.pricing-item');
            const planTitleElement = card ? card.querySelector('h5') : null;
            const planTitle = planTitleElement ? planTitleElement.textContent.trim() : "";
            
            const matchedProj = dbProjects.find(p => p.title.toLowerCase() === planTitle.toLowerCase());
            if (matchedProj) {
                handleAddToCart(matchedProj._id);
            } else {
                showToast(`Product plan "${planTitle}" is not configured in backend`, "error");
            }
        });
    });
}

// 6. Checkout Page (Summary loading and order processing)
async function loadCheckoutPage() {
    const summaryContainer = document.querySelector('.w-commerce-commercecheckoutorderitemslist');
    const orderForm = document.querySelector('.checkout-form form');
    const totalElement = document.querySelector('.w-commerce-commercecheckoutordertotal');
    
    // Render item summaries
    if (summaryContainer) {
        showLoader(summaryContainer);
        
        try {
            const cartRes = await apiCall('/cart');
            const cart = cartRes.data;
            
            if (totalElement) totalElement.innerHTML = `$ ${cart.totalPrice.toFixed(2)} USD`;
            
            summaryContainer.innerHTML = '';
            
            if (!cart.items || cart.items.length === 0) {
                summaryContainer.innerHTML = '<div style="padding: 20px 0;">No items in cart.</div>';
                return;
            }
            
            cart.items.forEach(item => {
                const project = item.project;
                if (!project) return;
                
                const itemRow = document.createElement('div');
                itemRow.className = 'w-commerce-commercecheckoutorderitem';
                itemRow.style.display = 'flex';
                itemRow.style.justifyContent = 'space-between';
                itemRow.style.padding = '12px 0';
                itemRow.style.borderBottom = '1px solid #eee';
                
                itemRow.innerHTML = `
                    <div style="display: flex; gap: 12px;">
                        <img src="${project.imageUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
                        <div>
                            <div style="font-weight: 600; color: #1a1a1a;">${project.title}</div>
                            <div style="font-size: 12px; color: #777;">${project.type}</div>
                        </div>
                    </div>
                    <div style="font-weight: 600;">$ ${item.price.toFixed(2)} USD</div>
                `;
                summaryContainer.appendChild(itemRow);
            });
        } catch (error) {
            console.error("Failed to load checkout cart summary", error);
            summaryContainer.innerHTML = '<div style="padding: 20px; color: #e74c3c;">Failed to load order summary.</div>';
        }
    }
    
    // Intercept Place Order Submit action
    const checkoutContainer = document.querySelector('.checkout-form');
    if (checkoutContainer) {
        // Intercept click on the submit button
        const submitBtn = checkoutContainer.querySelector('input[type="submit"], button, .w-commerce-commercecheckoutplaceorderbutton');
        if (submitBtn) {
            const originalForm = submitBtn.closest('form') || checkoutContainer.querySelector('form');
            if (originalForm) {
                originalForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    try {
                        submitBtn.value = "Processing Order...";
                        submitBtn.disabled = true;
                        
                        // Send checkout request to backend
                        const orderRes = await apiCall('/cart/checkout', 'POST');
                        const order = orderRes.data;
                        
                        // Display beautiful success layout
                        checkoutContainer.innerHTML = `
                            <div class="mediabundle-dynamic-item" style="text-align: center; padding: 60px 40px; background: #ffffff; border-radius: 12px; box-shadow: 0 15px 40px rgba(0,0,0,0.05); border: 2px solid #2ecc71;">
                                <div style="width: 80px; height: 80px; background: #2ecc71; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px auto; color: #fff; font-size: 40px; font-weight: bold;">
                                    ✓
                                </div>
                                <h3 style="color: #1a1a1a; margin-bottom: 15px;">Order Placed Successfully!</h3>
                                <p style="color: #666; font-size: 16px; margin-bottom: 25px;">
                                    Thank you for your purchase. We have received your order details and sent a confirmation to your email.
                                </p>
                                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: left; max-width: 500px; margin: 0 auto 35px auto; border: 1px dashed #ddd;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <span style="color: #777;">Order ID:</span>
                                        <strong style="color: #1a1a1a;">${order.orderId}</strong>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <span style="color: #777;">Amount Paid:</span>
                                        <strong style="color: #1a1a1a;">$ ${order.totalPrice.toFixed(2)} USD</strong>
                                    </div>
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="color: #777;">Payment Status:</span>
                                        <strong style="color: #2ecc71;">${order.paymentStatus}</strong>
                                    </div>
                                </div>
                                <a href="/" class="primary-button" style="display: inline-block; padding: 12px 30px; text-decoration: none;">Return Home</a>
                            </div>
                        `;
                        
                        showToast("Order completed successfully!");
                        syncCartCount();
                    } catch (err) {
                        submitBtn.value = "Place Order";
                        submitBtn.disabled = false;
                        showToast(err.message || "Failed to complete checkout order", "error");
                    }
                });
            }
        }
    }
}

// 7. Contact Page (Inquiry form intercept)
function loadContactPage() {
    const contactForm = document.getElementById('wf-form-Contact-Form');
    const successBlock = document.querySelector('.success-message');
    const errorBlock = document.querySelector('.error-message');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Grab values
        const nameVal = document.getElementById('name').value;
        const emailVal = document.getElementById('Email').value;
        const phoneVal = document.getElementById('Phone').value;
        const messageVal = document.getElementById('Message').value;
        
        try {
            const submitBtn = contactForm.querySelector('input[type="submit"]');
            if (submitBtn) {
                submitBtn.value = "Sending...";
                submitBtn.disabled = true;
            }
            
            await apiCall('/contacts', 'POST', {
                name: nameVal,
                email: emailVal,
                subject: `Inquiry from ${nameVal} (Phone: ${phoneVal})`,
                message: messageVal
            });
            
            // Show success block and hide form
            contactForm.style.display = 'none';
            if (successBlock) successBlock.style.display = 'block';
            if (errorBlock) errorBlock.style.display = 'none';
            showToast("Message sent successfully!");
        } catch (error) {
            console.error("Contact submission failed:", error);
            if (errorBlock) errorBlock.style.display = 'block';
            
            const submitBtn = contactForm.querySelector('input[type="submit"]');
            if (submitBtn) {
                submitBtn.value = "Submit";
                submitBtn.disabled = false;
            }
            showToast("Submission failed. Please check fields.", "error");
        }
    });
}
