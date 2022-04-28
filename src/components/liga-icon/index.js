class LigaIcon extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
    rel="stylesheet">
      <style type="text/css">
        :host { display: inline-flex; pointer-events: none; }
        .material-icons { font-size: 1.5em; }
      </style>
      <slot class="material-icons"></slot>
    `;
    const slot =  this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', () => {
      const [node] = slot.assignedNodes();
      this.title = node.nodeValue;
    });
  }
}

window.customElements.define('liga-icon', LigaIcon);