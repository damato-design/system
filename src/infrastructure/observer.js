/* global components */

const NODE_DETECTION_ANIMATION_NAME = 'nodeDetection--animationName';

export default function ComponentObserver(root) {
  const nodeDetectionCss = nodeDetectorStylesheet();
  const nodeDetectionStyle = createStyleSheet('nodeDetection--styleSheet', nodeDetectionCss);
  insertStyleSheet(nodeDetectionStyle, root);

  root.addEventListener('animationstart', (ev) => {
    const node = ev.target;
    if (ev.animationName === NODE_DETECTION_ANIMATION_NAME && !isDefined(node.tagName)) {
      fetchDefinition(node);
    }
  });
}

function nodeDetectorStylesheet() {
  const classRule = `${components.join(', ')} {
    animation-duration: 0.1ms;
    animation-name: ${NODE_DETECTION_ANIMATION_NAME};
  } `;
  const keyframeRule = `@keyframes ${NODE_DETECTION_ANIMATION_NAME} {
    to { visibility: visible; }
  } `;
  return classRule + keyframeRule;
}

function isDefined(tagName) {
  return window.customElements.get(tagName.toLowerCase());
}

function fetchDefinition({ tagName }) {
  window.__library.fetchDefinition(tagName.toLowerCase());
}

function createStyleSheet(name, css) {
  return Object.assign(document.createElement('style'), {
    type: 'text/css',
    className: name,
    textContent: css,
  });
}

function insertStyleSheet(sheet, root) {
  if (root === document.documentElement) {
    const firstLink = document.head.querySelector('link');
    document.head.insertBefore(sheet, firstLink);
  } else {
    root.insertBefore(sheet, root.firstChild);
  }
}