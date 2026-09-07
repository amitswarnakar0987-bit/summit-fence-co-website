document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');

  if (navToggle && navMenu) {
    const setMenu = (isOpen) => {
      navMenu.classList.toggle('open', isOpen);
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => {
      setMenu(!navMenu.classList.contains('open'));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenu(false);
      }
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
  }

  const forms = document.querySelectorAll('[data-estimate-form]');

  forms.forEach((form) => {
    const status = form.querySelector('[data-form-status]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      let isValid = true;
      const fields = form.querySelectorAll('[data-required]');

      fields.forEach((field) => {
        const error = form.querySelector(`[data-error-for="${field.name}"]`);
        const value = field.value.trim();

        if (!value) {
          isValid = false;
          if (error) error.textContent = 'This field is required.';
          field.setAttribute('aria-invalid', 'true');
          return;
        }

        if (field.type === 'email') {
          const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          if (!emailOk) {
            isValid = false;
            if (error) error.textContent = 'Enter a valid email address.';
            field.setAttribute('aria-invalid', 'true');
            return;
          }
        }

        if (field.type === 'tel') {
          const digits = value.replace(/[^0-9]/g, '');
          if (digits.length < 10) {
            isValid = false;
            if (error) error.textContent = 'Enter a valid phone number.';
            field.setAttribute('aria-invalid', 'true');
            return;
          }
        }

        if (error) error.textContent = '';
        field.removeAttribute('aria-invalid');
      });

      const detailsField = form.querySelector('[name="projectDetails"]');
      if (detailsField) {
        const detailError = form.querySelector('[data-error-for="projectDetails"]');
        if (detailsField.value.trim().length < 10) {
          isValid = false;
          if (detailError) detailError.textContent = 'Please add a few project details so the estimate can be prepared.';
          detailsField.setAttribute('aria-invalid', 'true');
        } else if (detailError) {
          detailError.textContent = '';
          detailsField.removeAttribute('aria-invalid');
        }
      }

      if (!isValid) {
        if (status) {
          status.className = 'form-note';
          status.textContent = 'Please review the highlighted fields and try again.';
        }
        return;
      }

      const payload = Object.fromEntries(new FormData(form).entries());
      console.log('Estimate form payload:', payload);

      // REPLACE WITH SUMMIT FENCE CO. CRM / WEBHOOK ENDPOINT
      // Example:
      // await fetch('https://your-endpoint.example.com', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      if (status) {
        status.className = 'success-message';
        status.textContent = 'Form ready for CRM connection. Replace the endpoint in js/main.js to send submissions live.';
      }

      form.reset();
    });
  });
});