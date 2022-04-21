class AudienceControl extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <toggle-range type="checkbox">
        ${this.audience} Info
      </toggle-range>
    `;
  }

  static get observedAttributes() {
    return ['open'];
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'open' && this._$toggle) {
      this._$toggle.value = Number(this.open);
      window.localStorage.setItem(`audience-control-${this.audience}`, this._$toggle.value)
      const details = document.querySelectorAll(`details[data-audience=${this.audience}]`);
      [...details].forEach((detail) => detail.open = this.open);
    }
  }

  connectedCallback() {
    window.customElements.whenDefined('toggle-range').then(() => {
      this._$toggle = this.shadowRoot.querySelector('toggle-range');
      this._$toggle.addEventListener('change', ({ detail }) => this.open = detail.value);
      const storage = window.localStorage.getItem(`audience-control-${this.audience}`);
      this.open = !storage || !!Number(storage);
    });
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(newVal) {
    if (newVal) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  get audience() {
    return this.getAttribute('audience');
  }
}

window.customElements.define('audience-control', AudienceControl);
