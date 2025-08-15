document.addEventListener("DOMContentLoaded", function() {
    const nav_lists = document.querySelectorAll(".main-menu ul li a");
    const nav_lists_mobile = document.querySelectorAll(".mobile-nav ul li a");
    const accessibility_btn = document.querySelector(".dropdown-btn");
    const form = document.getElementById("footer-form");
    
    nav_lists.forEach((el) => el.addEventListener("click", () => {
        add_active_class(nav_lists, el)
        remove_nav_slug();
    }));

    nav_lists_mobile.forEach(el => el.addEventListener("click", () => {
        add_active_class(nav_lists_mobile, el)
    }));

    accessibility_btn.addEventListener("click", (e) => {
        e.preventDefault();
        accessibility_btn.classList.toggle("active")
    });
  
  form.addEventListener("submit", () => handleSubmit(form));
    
});

function add_active_class(array_lists, el) {
    if (!el.classList.contains("active")) {
        array_lists.forEach(el => el.parentElement.classList.remove('active'));
        el.parentElement.classList.add("active");
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
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
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
        return "Name must be at least 2 characters long.";
    }
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        return "Please enter a valid email address.";
    }
}

async function handleSubmit(event, form) {
    event.preventDefault();
    var status = document.getElementById("my-form-status");
    var data = new FormData(event.target);
    console.log("data");
    console.log(data);
    
    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    }).then(response => {
        console.log("response");
        console.log(response);
        
      if (response.ok) {
        status.innerHTML = "Thanks for your submission!";
        form.reset()
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
          } else {
            status.innerHTML = "Oops! There was a problem submitting your form"
          }
        })
      }
    }).catch(error => {
      status.innerHTML = "Oops! There was a problem submitting your form"
    });
  }

// async function handleSubmit(event) {
//     event.preventDefault();
//     const status = document.getElementById("my-form-status");

//     const formData = new FormData(event.target);
//     console.log("formData: ");
//     console.log(formData);
//     const sanitizedData = sanitizeFormData(formData);
//     console.log("sanitizedData: ");
//     console.log(sanitizedData);
//     const errorMessage = validateFormData(sanitizedData);
//     console.log("errorMessage: ");
//     console.log(errorMessage);
    
//     if (errorMessage) {
//         status.textContent = errorMessage;
//         return;
//     }
    
//     // Prepare FormData for submission
//     const finalData = new FormData();
//     Object.entries(sanitizedData).forEach(([key, value]) => {
//         finalData.append(key, value);
//     });
    
//     console.log("finalData: ");
//     console.log(finalData);

//     try {
//         const response = await fetch(event.target.action, {
//             method: form.method,
//             body: finalData,
//             headers: { 'Accept': 'application/json' }
//         });

//         if (response.ok) {
//             status.textContent = "Thanks for your submission!";
//             form.reset();
//         } else {
//             const data = await response.json();
//             if (data.errors) {
//                 status.textContent = data.errors.map(e => e.message).join(", ");
//             } else {
//                 status.textContent = "test1 error";
//             }
//         }
//     } catch (error) {
//         status.textContent = "test2 error";
//     }
// }
