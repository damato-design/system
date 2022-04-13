const svgElements = [
  'circle',
  'ellipse',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
  'stop',
  'use'
];

const voidElements = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

class BluComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const baseComponent = this.shadowRoot.lastElementChild;
    const baseClassName = baseComponent.classList[0];
    this._attributeList = [];

    [...this.attributes].forEach((attr) => {
      if (attr.name === 'selfdocument') {
        return;
      }

      const parts = attr.name.split('-');
      let target = baseComponent;
      let targetClassSelector = `.${baseClassName}`;
      if (parts.length > 1) {
        targetClassSelector = `${targetClassSelector}--${parts[0]}`;
        target = baseComponent.querySelector(targetClassSelector);
      }

      const entry = {
        target: targetClassSelector,
        name: parts.pop(),
        value: attr.nodeValue
      };
      this._attributeList.push(entry);
      target.setAttribute(entry.name, entry.value);
    });

    if (this.hasAttribute('selfdocument')) {
      showCode.call(this);
    }
  }

  disconnectedCallback() {
    if (this._selfdocumentation) {
      this._selfdocumentation.remove();
    }
  }
}

function initSelfdocument() {
  this._selfdocumentation = document.createElement('js-selectsummary');
  this._selfdocumentation.setAttribute('type', 'summary');
  this._selfdocumentation.classList.add('audience-engineer');
  // title slot
  const value = document.createElement('span');
  value.innerText = 'Blueprint HTML';
  value.setAttribute('slot', 'value');
  this._selfdocumentation.appendChild(value);

  // icon slot
  const open = getIndicator('code-brackets', 'open', 'code');
  const close = getIndicator('code-brackets', 'close', 'code');
  this._selfdocumentation.appendChild(open);
  this._selfdocumentation.appendChild(close);


  const pre = document.createElement('pre');
  pre.setAttribute('aria-hidden', 'true');
  this._adjacentCode = document.createElement('code');
  this._adjacentCode.classList.add('language-html');
  pre.appendChild(this._adjacentCode);
  this._selfdocumentation.appendChild(pre);

  this.after(this._selfdocumentation);
}

function showCode() {
  initSelfdocument.call(this);
  this._currentHTML = '';

  const slots = this.shadowRoot.querySelectorAll('slot');
  if (!slots.length) {
    renderCode.call(this)
  } else {
    [...slots].forEach((slot) => {
      slot.addEventListener('slotchange', () =>  renderCode.call(this, slot));
    });
  }
}

function renderCode(slot) {
  if (!this._currentHTML) {
    const sheets = this.shadowRoot.styleSheets;
    const style = sheets[0].ownerNode.outerHTML;
    this._currentHTML = this.shadowRoot.innerHTML.replace(style, '');
  }

  const template = document.createElement('template');
  template.innerHTML = this._currentHTML;

  if (slot) {
    const query = slot.name ? `slot[name="${slot.name}"]` : 'slot:not([name])';
    const slotTarget = template.content.querySelector(query);
    if (slotTarget) {
      const nodes = slot.assignedNodes();
      const frag = document.createDocumentFragment();
      [...nodes].forEach((node) => {
        const cloned = node.cloneNode(true);
        cloned.removeAttribute && cloned.removeAttribute('slot');
        frag.appendChild(cloned);
      });
      slotTarget.parentNode.replaceChild(frag, slotTarget);
      this._currentHTML = template.innerHTML;
    }
    const remainingSlots = template.content.querySelectorAll('slot');
    [...remainingSlots].forEach((slot) => !slot.assignedNodes().length &&  slot.remove());
  }

  this._adjacentCode.innerHTML = prepareHTML(template.innerHTML);
}

const SELF_CLOSING = [].concat(voidElements, svgElements);

function prepareHTML(html) {
  const tags = html.replace(/>\s*([a-zA-Z0-9 ]+)\s*</gm, '>$1<').replace(/>\s+</gm, '>\n<').split('\n');
  let indent = 0;
  html = tags.map((tag) => {

    if (/^<\//.test(tag)) {
      indent -= 1;
    }

    let padding = '';
    if (indent > 0) {
      padding = Array(indent).fill('  ').join('');
    }

    const tagName = tag.replace(/<([^ ]+).*/gm, '$1');
    if (!/\//gm.test(tag) && !~SELF_CLOSING.indexOf(tagName)) {
      indent += 1;
    }

    return padding + tag;
  }).join('\n');
  html = html.replace(/[\u00A0-\u9999<>\&]/gim, (i) => '&#' + i.charCodeAt(0) + ';');
  return html;
}

function getIndicator(value, state, fallback) {
  const className = `selectSummary--indicator${state.charAt(0).toUpperCase() + state.slice(1)}`;
  const svgIcon = document.createElement('svg-icon');
  svgIcon.value = value;
  svgIcon.innerText = fallback;
  svgIcon.slot = `indicator-${state}`;
  svgIcon.classList.add(className);
  return svgIcon;
}

Promise.all([
  window.customElements.whenDefined('js-selectsummary'),
  window.customElements.whenDefined('svg-icon')
]).then(() => {
  window.customElements.define('blu-component', BluComponent);
});