class SystemColorControl extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <toggle-range type="checkbox">
        System Color
      </toggle-range>
    `;
  }

  static get observedAttributes() {
    return ['inverse'];
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'inverse' && this._$toggle) {
      this._$toggle.value = Number(this.inverse);
      window.localStorage.setItem(`system-color-control`, this._$toggle.value)
      if (this.inverse) {
        document.body.setAttribute('data-dark', '');
      } else {
        document.body.removeAttribute('data-dark');
      }
    }
  }

  connectedCallback() {
    window.customElements.whenDefined('toggle-range').then(() => {
      this._$toggle = this.shadowRoot.querySelector('toggle-range');
      this._$toggle.addEventListener('change', ({ detail }) => this.inverse = detail.value);
      const storage = window.localStorage.getItem(`system-color-control`);
      this.inverse = !storage || !!Number(storage);
    });
  }

  get inverse() {
    return this.hasAttribute('inverse');
  }

  set inverse(newVal) {
    if (newVal) {
      this.setAttribute('inverse', '');
    } else {
      this.removeAttribute('inverse');
    }
  }
}

window.customElements.define('system-color-control', SystemColorControl);
