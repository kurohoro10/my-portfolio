document.addEventListener('DOMContentLoaded', function() {
  const nav_lists = document.querySelectorAll('.main-menu ul li a');
  const nav_lists_mobile = document.querySelectorAll('.mobile-nav ul li a');
  const accessibility_btn = document.querySelector('.dropdown-btn');
  const form = document.getElementById('footer-form');
  document.getElementById('formLoadedAt').value = Date.now();
  const token = generateToken();
  sessionStorage.setItem('formToken', token);
  document.getElementById('formToken').value = token;
  
  nav_lists.forEach((el) => el.addEventListener('click', () => {
      add_active_class(nav_lists, el)
      remove_nav_slug();
  }));

  nav_lists_mobile.forEach(el => el.addEventListener('click', () => {
      add_active_class(nav_lists_mobile, el)
  }));

  accessibility_btn.addEventListener('click', (e) => {
      e.preventDefault();
      accessibility_btn.classList.toggle('active')
  });
  
  form.addEventListener('submit', handleSubmit);
    
});

function add_active_class(array_lists, el) {
    if (!el.classList.contains('active')) {
        array_lists.forEach(el => el.parentElement.classList.remove('active'));
        el.parentElement.classList.add('active');
    }
}

function remove_nav_slug() {
    const url = window.location.href;
    console.log(url);
}

function sanitizeInput(value) {
    // Trim spaces & escape HTML
    return value
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function sanitizeFormData(formData) {
    const sanitized = {};
    for (let [key, value] of formData.entries()) {
        sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
}

function validateFormData(data) {
    // Name validation
    if (!data.name || data.name.length < 2) {
        return 'Name must be at least 2 characters long.';
    }
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        return 'Please enter a valid email address.';
    }
}

let lastSubmitTime = 0;

async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const sanitizedData = sanitizeFormData(formData);
    const errorMessage = validateFormData(sanitizedData);
    const minDelay = 3000;
    const now = Date.now();

    if (errorMessage) {
        showMessage(errorMessage, 'error');
        return;
    }

    if (sanitizedData.company) {
      showMessage('Spam detected.', 'error');
      return;
    }

    if (Date.now() - Number(sanitizedData.formLoadedAt) < minDelay) {
      return showMessage('Form submitted too quickly. Please try again', 'error');
    }

    if (now - lastSubmitTime < 5000) {
      showMessage('Please wait before submitting again.', 'error');
      return;
    }

    if (!sessionStorage.getItem('formToken')) {
      showMessage('Spam detected.', 'error');
      return;
    }

    if (sanitizedData.formToken !== sessionStorage.getItem('formToken')) {
      showMessage('Spam detected.', 'error');
      return;
    }

    lastSubmitTime = now;

    // Prepare FormData for submission
    const finalData = new FormData();
    ['name', 'email', 'message'].forEach(key => {
        if (sanitizedData[key]) {
          finalData.append(key, sanitizedData[key]);
        }
    });

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: finalData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            showMessage('Thanks for your submission!', 'success');
            form.reset();
            sessionStorage.removeItem('formToken');
            
            // Reset token after submission
            const newToken = generateToken();
            sessionStorage.setItem('formToken', newToken);
            document.getElementById('formToken').value = newToken;
        } else {
            const data = await response.json().catch(() => null);
            if (data?.errors) {
                showMessage((data.errors.map(e => e.message).join(', ')), 'error');
            } else {
                console.error('Server error:', data);
                showMessage('Something went wrong.', 'error');
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

function showMessage(message, message_type) {
  const status = document.getElementById('my-form-status');

  if (status) {
    status.classList.remove('hidden', 'error', 'success');
    status.classList.add(message_type);
    status.textContent = message;
  }

  if (message_type === 'success') {
    setTimeout(() => {
      status.classList.add('hidden');
    }, 5000)
  }
}

function generateToken() {
  return Math.random().toString(36).substring(2);
}