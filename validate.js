// Contact form: checks name, email, phone and address, then sends the message
class FormValidator {
  constructor(form) {
    this.form = form;
    this.status = form.querySelector('.form-status');
    this.button = form.querySelector('button[type="submit"]');
    this.fields = [...form.querySelectorAll('[data-validate]')];
    this.rules = {
      name: (v) => {
        if (!v) return 'Please enter your full name.';
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ' ’.-]{1,59}$/.test(v)) return 'Use letters only, at least 2 characters.';
        return '';
      },
      email: (v) => {
        if (!v) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'That email doesn’t look right. Try name@example.com.';
        return '';
      },
      phone: (v) => {
        if (!v) return 'Please enter your phone number.';
        const digits = v.replace(/\D/g, '');
        if (!/^[+()\d\s.-]+$/.test(v) || digits.length < 7 || digits.length > 15) {
          return 'Use 7 to 15 digits. You can include +, spaces and dashes.';
        }
        return '';
      },
      address: (v) => {
        if (!v) return 'Please enter your address.';
        if (v.length < 8 || !/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(v)) return 'Please enter your full street address, for example 12 Rue de Rivoli.';
        return '';
      },
      message: (v) => {
        if (!v) return 'Please tell us a little about your project.';
        if (v.length < 10) return 'Please write at least a short sentence.';
        return '';
      }
    };
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
    this.fields.forEach((field) => {
      field.addEventListener('blur', () => this.check(field));
      field.addEventListener('input', () => {
        if (field.closest('.field').classList.contains('is-invalid')) this.check(field);
      });
    });
  }

  check(input) {
    const message = this.rules[input.name](input.value.trim());
    const wrapper = input.closest('.field');
    wrapper.querySelector('.field__error').textContent = message;
    wrapper.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  setStatus(type, text) {
    this.status.className = 'form-status is-' + type;
    this.status.textContent = text;
  }

  onSubmit(event) {
    event.preventDefault();
    const invalid = this.fields.filter((field) => !this.check(field));
    if (invalid.length) {
      invalid[0].focus();
      this.setStatus('error', 'Please check the highlighted fields and try again.');
      return;
    }
    this.send();
  }

  async send() {
    if (window.location.protocol === 'file:') {
      this.setStatus('error', 'Sending works once the site is live. Open the deployed site to test the form.');
      return;
    }
    const endpoint = this.form.dataset.endpoint;   // optional: Formspree, FormSubmit and similar
    const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
    if (!endpoint && isLocal) {
      console.warn('Contact form: a local server cannot receive form posts. Set data-endpoint on the form, or test on the live Netlify site.');
      this.setStatus('error', 'Testing locally: this server can’t receive forms. Add a form service address to the form (data-endpoint), or test on the live site.');
      return;
    }
    this.button.disabled = true;
    try {
      const data = new FormData(this.form);
      const response = endpoint
        ? await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        : await fetch(this.form.getAttribute('action') || '/', {   // default: Netlify Forms
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data).toString()
          });
      if (!response.ok) throw new Error('HTTP ' + response.status + ' from ' + (endpoint || this.form.getAttribute('action') || '/'));
      this.form.reset();
      this.setStatus('success', 'Thank you. Your message is on its way, and we’ll reply within two working days.');
      this.status.focus();
    } catch (error) {
      console.error('Contact form not sent:', error.message,
        '(404 means this server has no form handler: use the live Netlify site, or set data-endpoint on the form.)');
      this.setStatus('error', 'We couldn’t send your message just now. Please try again, or email architecturedesign@atelierreverie.com.');
    } finally {
      this.button.disabled = false;
    }
  }
}

const contactForm = document.getElementById('contactForm');
if (contactForm) new FormValidator(contactForm);
