// Contact Form Validation and Submission
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  // Form submission handler
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearErrors();

    if (!validateForm()) return;

    try {
      const formData = new FormData(form);

      const res = await fetch("/submit-contact", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");

      showSuccess();
      form.reset();
    } catch (err) {
      alert("Something went wrong. Please try again later.");
    }
  });

  // Real-time validation on blur
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });
  });

  // Clear error when user starts typing
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      clearFieldError(this);
    });
  });

  // Validate entire form
  function validateForm() {
    let isValid = true;

    // Full Name validation
    const fullName = document.getElementById("fullName");
    if (!fullName.value.trim()) {
      showError(fullName, "fullNameError", "Please enter your full name");
      isValid = false;
    } else if (fullName.value.trim().length < 3) {
      showError(
        fullName,
        "fullNameError",
        "Name must be at least 3 characters"
      );
      isValid = false;
    }

    // Phone validation
    const phone = document.getElementById("phone");
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.value.trim()) {
      showError(phone, "phoneError", "Please enter your phone number");
      isValid = false;
    } else if (!phoneRegex.test(phone.value.replace(/[\s-]/g, ""))) {
      showError(
        phone,
        "phoneError",
        "Please enter a valid 10-digit phone number"
      );
      isValid = false;
    }

    // Email validation (optional, but if provided must be valid)
    const email = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() && !emailRegex.test(email.value)) {
      showError(email, "emailError", "Please enter a valid email address");
      isValid = false;
    }

    // Event City validation
    const eventCity = document.getElementById("eventCity");
    if (!eventCity.value.trim()) {
      showError(eventCity, "eventCityError", "Please enter the event city");
      isValid = false;
    }

    // Event Type validation
    const eventType = document.getElementById("eventType");
    if (!eventType.value) {
      showError(eventType, "eventTypeError", "Please select an event type");
      isValid = false;
    }

    // Guest Count validation
    const guestCount = document.getElementById("guestCount");
    if (!guestCount.value) {
      showError(
        guestCount,
        "guestCountError",
        "Please select number of guests"
      );
      isValid = false;
    }

    return isValid;
  }

  // Validate individual field
  function validateField(field) {
    const fieldId = field.id;
    const errorId = fieldId + "Error";

    switch (fieldId) {
      case "fullName":
        if (!field.value.trim()) {
          showError(field, errorId, "Please enter your full name");
        } else if (field.value.trim().length < 3) {
          showError(field, errorId, "Name must be at least 3 characters");
        }
        break;

      case "phone":
        const phoneRegex = /^[0-9]{10}$/;
        if (!field.value.trim()) {
          showError(field, errorId, "Please enter your phone number");
        } else if (!phoneRegex.test(field.value.replace(/[\s-]/g, ""))) {
          showError(
            field,
            errorId,
            "Please enter a valid 10-digit phone number"
          );
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field.value.trim() && !emailRegex.test(field.value)) {
          showError(field, errorId, "Please enter a valid email address");
        }
        break;

      case "eventCity":
        if (!field.value.trim()) {
          showError(field, errorId, "Please enter the event city");
        }
        break;

      case "eventType":
        if (!field.value) {
          showError(field, errorId, "Please select an event type");
        }
        break;

      case "guestCount":
        if (!field.value) {
          showError(field, errorId, "Please select number of guests");
        }
        break;
    }
  }

  // Show error message
  function showError(field, errorId, message) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add("show");
    field.classList.add("error");
  }

  // Clear error for specific field
  function clearFieldError(field) {
    const errorId = field.id + "Error";
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = "";
    errorElement.classList.remove("show");
    field.classList.remove("error");
  }

  // Clear all errors
  function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((error) => {
      error.textContent = "";
      error.classList.remove("show");
    });

    const errorFields = document.querySelectorAll(".error");
    errorFields.forEach((field) => {
      field.classList.remove("error");
    });
  }

  // Show success message
  function showSuccess() {
    successMessage.classList.add("show");
    successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Hide success message
  function hideSuccess() {
    successMessage.classList.remove("show");
  }
});
