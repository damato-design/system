class SvgIcon extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style type="text/css">
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        .material-icons { font-size: 1.5em; }
      </style>
      <slot class="material-icons"></slot>
    `;
  }
}

window.customElements.define('svg-icon', SvgIcon);