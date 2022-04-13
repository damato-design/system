const LOCALEJSON_URL = 'json/isoLanguageCountryCodes.json';

class LocaleTable extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.loadLocales(LOCALEJSON_URL).then(() => this._render());
  }

  _render() {
    if (!this._table) {
      this._table = document.createElement('table');
      this.appendChild(this._table);
    }

    this._table.innerHTML = '<thead></thead><tbody></tbody>';
    const thead = document.querySelector('thead');
    createHead(thead);
    const tbody = document.querySelector('tbody');
    Object.entries(this._locales).forEach(([id, { formalName, nativeName }]) => {
      const tr = document.createElement('tr');
      createCell(`<code>${id}</code>`, tr);
      createCell(formalName, tr);
      createCell(nativeName, tr);
      tbody.appendChild(tr);
    });
  }

  async loadLocales(locales) {
    let codes = Array.isArray(locales) ? locales : [];
    if (typeof locales === 'string') {
      codes = await fetch(locales).then((res) => res.json()); 
    }
    this._locales = codes;
  }
}

function createHead(thead) {
  const tr = document.createElement('tr');
  tr.innerHTML = ['ID', 'Formal Name', 'Native Name'].map((heading) => `<th>${heading}</th>`).join('');
  thead.appendChild(tr);
}

function createCell(data, tr) {
  const td = document.createElement('td');
  td.innerHTML = data;
  tr.appendChild(td);
}

window.customElements.define('locale-table', LocaleTable);