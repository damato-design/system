class LigaIcon extends window.HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style type="text/css">
        :host { display: inline-flex; pointer-events: none; vertical-align: middle; }
        .material-icons { font-size: 1.5em; }
      </style>
      <slot class="material-icons-outlined"></slot>
    `;
    const slot =  this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', () => {
      const [node] = slot.assignedNodes();
      this.title = node.nodeValue;
    });
  }
}

window.customElements.define('liga-icon', LigaIcon);