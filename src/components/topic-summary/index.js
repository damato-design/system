import html from './template.html';
import css from './styles.css';

class TopicSummary extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;
  }
}

window.customElements.define('topic-summary', TopicSummary);
