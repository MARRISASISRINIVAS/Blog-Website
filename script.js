// Theme Management
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    
    const icon = document.querySelector('#darkModeToggle i');
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Mobile Menu
function toggleMobileMenu() {
    const nav = document.querySelector('.navigation');
    nav.classList.toggle('active');
    
    const menuIcon = document.querySelector('.menu-toggle i');
    menuIcon.className = nav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
}

// Search and Filter Functions
function searchPosts() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const posts = document.querySelectorAll('.post');
    
    posts.forEach(post => {
        const title = post.querySelector('h2').textContent.toLowerCase();
        const content = post.querySelector('.post-content').textContent.toLowerCase();
        post.style.display = (title.includes(searchTerm) || content.includes(searchTerm)) ? 'block' : 'none';
    });
}

function filterPosts() {
    const category = document.getElementById('categoryFilter').value;
    const dateSort = document.getElementById('dateFilter').value;
    const posts = Array.from(document.querySelectorAll('.post'));
    
    // Filter by category
    posts.forEach(post => {
        if (!category) {
            post.style.display = 'block';
            return;
        }
        
        const tags = Array.from(post.querySelectorAll('.tag'))
            .map(tag => tag.textContent.trim());
        post.style.display = tags.includes(category) ? 'block' : 'none';
    });
    
    // Sort by date
    if (dateSort) {
        const container = document.querySelector('.main-content');
        const sortedPosts = posts.sort((a, b) => {
            const dateA = new Date(a.querySelector('.post-meta span').textContent);
            const dateB = new Date(b.querySelector('.post-meta span').textContent);
            return dateSort === 'latest' ? dateB - dateA : dateA - dateB;
        });
        
        sortedPosts.forEach(post => container.appendChild(post));
    }
}

function filterPostsByCategory(category) {
    document.getElementById('categoryFilter').value = category;
    filterPosts();
    scrollToContent();
}

function filterPostsByTag(tag) {
    document.getElementById('categoryFilter').value = tag;
    filterPosts();
}

// Social Share Functions
function sharePost(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
        whatsapp: `https://wa.me/?text=${title}%20${url}`
    };
    
    window.open(shareUrls[platform], '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => showNotification('Link copied to clipboard!', 'success'))
        .catch(() => showNotification('Failed to copy link', 'error'));
}

// Comment System
function submitComment(nameId, commentId, listId) {
    const name = document.getElementById(nameId).value;
    const comment = document.getElementById(commentId).value;
    
    if (!name || !comment) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const commentList = document.getElementById(listId);
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="comment">
            <strong>${name}</strong>
            <p>${comment}</p>
            <small>${new Date().toLocaleDateString()}</small>
        </div>
    `;
    
    commentList.appendChild(li);
    
    // Clear form
    document.getElementById(nameId).value = '';
    document.getElementById(commentId).value = '';
    
    showNotification('Comment posted successfully!', 'success');
}

// Newsletter Subscription
function subscribe() {
    const email = document.getElementById('email').value;
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Here you would typically send this to your backend
    showNotification('Thank you for subscribing!', 'success');
    document.getElementById('email').value = '';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Scroll Functions
function scrollToContent() {
    const content = document.querySelector('.main-content');
    content.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Pagination
let currentPage = 1;
const postsPerPage = 5;

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
}

function nextPage() {
    const totalPages = Math.ceil(document.querySelectorAll('.post').length / postsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
    }
}

function updatePagination() {
    const posts = document.querySelectorAll('.post');
    const totalPages = Math.ceil(posts.length / postsPerPage);
    
    posts.forEach((post, index) => {
        const shouldShow = index >= (currentPage - 1) * postsPerPage && 
                          index < currentPage * postsPerPage;
        post.style.display = shouldShow ? 'block' : 'none';
    });
    
    document.getElementById('pageIndicator').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Initialize back to top button
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 300);
        }
    });
    
    // Initialize post visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.post').forEach(post => observer.observe(post));
    
    // Initialize pagination
    updatePagination();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const nav = document.querySelector('.navigation');
        const menuBtn = document.querySelector('.menu-toggle');
        
        if (nav && nav.classList.contains('active') && 
            !nav.contains(e.target) && !menuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
});
