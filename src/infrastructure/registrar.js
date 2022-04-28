const SOURCE_DIR = new URL(document.currentScript.src).href.replace(/[^/]*$/, '');
const ANIMATION_NAME = 'undefined-detection';
const FONT_IMPORT_URL = `@import url('https://fonts.googleapis.com/icon?family=Material+Icons');`;

(function registrar() {
  const styles = new Map();
  const elements = new Set();

  function detection() {
    return `${FONT_IMPORT_URL} ${[':not(:defined)', ...elements].join(',')} { animation: ${ANIMATION_NAME} .1ms; } @keyframes ${ANIMATION_NAME} { to { visibility: visible; } }`;
  }

  function location(root) {
    return root === document.documentElement
      ? { anchor: document.head, target: document.head.lastChild }
      : { anchor: root, target: root.firstChild };
  }

  function observe(root) {
    if (!root) return;
    root.addEventListener('animationstart', onAnimationStart);
    styles.set(root, Object.assign(document.createElement('style'), {
      type: 'text/css',
      textContent: detection(),
    }));
    const { anchor, target } = location(root);
    anchor.insertBefore(styles.get(root), target);
  }

  function register(tagName) {
    if (elements.has(tagName)) return;
    elements.add(tagName);
    const script = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      defer: true,
      onload: () => script.remove(),
      onerror: () => script.remove(),
      src: new URL(`components/${tagName}.iife.js`, SOURCE_DIR)
    });
    document.head.appendChild(script);
  }

  function onAnimationStart({ animationName, target }) {
    if (animationName !== ANIMATION_NAME) return;
    const name = target.tagName.toLowerCase();
    register(name);
    window.customElements.whenDefined(name).then(() => observe(target.shadowRoot));
  }

  observe(document.documentElement);
})();
