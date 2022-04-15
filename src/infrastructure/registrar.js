const SOURCE_DIR = new URL(document.currentScript.src).href.replace(/[^/]*$/, '');
const ANIMATION_NAME = 'detect';

(function registrar() {
  const styles = new Map();
  const elements = new Set();

  function detection() {
    return `${[':not(:defined)', ...elements].join(',')} { animation: ${ANIMATION_NAME} .1ms; } @keyframes ${ANIMATION_NAME} { to { visibility: visible; } }`;
  }

  function location(root) {
    return root === document.documentElement
      ? { anchor: document.head, target: document.head.lastChild }
      : { anchor: root, target: root.firstChild };
  }

  function observe(root) {
    root.addEventListener('animationstart', onAnimationStart);
    styles.set(root, Object.assign(document.createElement('style'), {
      type: 'text/css',
      textContent: detection(),
    }));
    const { anchor, target } = location(root);
    anchor.insertBefore(styles.get(root), target);
  }

  function lookup(tagName) {
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
    const name = target.tagName.toLowerCase();
    if (animationName === ANIMATION_NAME) lookup(name);
    window.customElements.whenDefined(name).then(() => observe(target.shadowRoot));
  }

  observe(document.documentElement);
})();
