import html from './template.html';
import css from './styles.css';

const ACCENT_COLORS = {
  designer: 'rgb(205, 40, 175)',
  engineer: 'rgb(5, 106, 255)'
}

class ControlPanel extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;
  }

  connectedCallback() {
    const onChange = () => {
      const accent = this.accent;
      if (accent) {
        document.body.style.setProperty('--accent-color', accent);
      } else {
        document.body.style.removeProperty('--accent-color');
      }
    }

    window.customElements.whenDefined('audience-control').then(() => {
      this._$designer = this.shadowRoot.querySelector('[audience="designer"]');
      this._$engineer = this.shadowRoot.querySelector('[audience="engineer"]');

      this._$designer.addEventListener('change', onChange);
      this._$engineer.addEventListener('change', onChange);      

      this._$designer.style.setProperty('--accent-color', ACCENT_COLORS.designer);
      this._$engineer.style.setProperty('--accent-color', ACCENT_COLORS.engineer);
    });
  }

  get accent() {
    if (this._$designer.open && !this._$engineer.open) return ACCENT_COLORS.designer;
    if (!this._$designer.open && this._$engineer.open) return ACCENT_COLORS.engineer;
    return null;
  }
}

window.customElements.define('control-panel', ControlPanel);
