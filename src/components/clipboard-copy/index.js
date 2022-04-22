import html from './template.html';
import css from './styles.css';

const MESSAGE_SUCCESS = 'Copied to clipboard! 🎉';
const MESSAGE_FAILURE = 'Could not copy 😞'

class ClipboardCopy extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;
  }

  connectedCallback() {
    const input = this.shadowRoot.querySelector('input');
    const root = this.shadowRoot.getElementById('clipboard-copy');
    input.value = this.getAttribute('value');

    const triggerMessage = (success) => {
      const message = success
        ? (this.getAttribute('success') || MESSAGE_SUCCESS)
        : (this.getAttribute('failure') || MESSAGE_FAILURE);
        root.setAttribute('data-message', message);
    }
   
    this.addEventListener('click', () => {
      input.focus();
      input.select();
      try {
        triggerMessage(document.execCommand('copy'));
      } catch (e) {
        triggerMessage(false);
      }
    });

    root.addEventListener('transitionend', () => root.removeAttribute('data-message'));
  }
}

window.customElements.define('clipboard-copy', ClipboardCopy);
