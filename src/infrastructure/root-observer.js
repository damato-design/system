const ANIMATION_NAME = 'detect';

const DETECT_STYLES = `:not(:defined) { animation: ${ANIMATION_NAME} 0.1ms; } @keyframes ${ANIMATION_NAME} { to { visibility: visible; } }`;

function onAnimationStart({ animationName, target }) {
  const tagName = target.tagName.toLowerCase();
  if (animationName === ANIMATION_NAME) window.__library.lookup(tagName);
}

export default class RootObserver {
  constructor() {
    this._styles = new Map();
  }

  observe(root) {
    root.addEventListener('animationstart', onAnimationStart);
    this._styles.set(root, Object.assign(document.createElement('style'), {
      type: 'text/css',
      textContent: DETECT_STYLES,
    }));
    root.insertBefore(this._styles.get(root), root === document.documentElement
      ? document.firstChild.lastChild
      : root.firstChild
    );
  }

  unobserve(root) {
    root.removeEventListener('animationstart', onAnimationStart);
    this._styles.get(root)?.remove();
  }
}
