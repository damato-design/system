(function(){
  const systemColorControl = document.getElementById('system-color');
  const audienceDesignerControl = document.getElementById('audience-designer');
  const audienceEngineerControl = document.getElementById('audience-engineer');

  const navigationLinks = document.querySelectorAll('.navigation a');
  const navigationToggle = document.getElementById('navigation-toggle');
  [...navigationLinks].forEach((link) => link.addEventListener('click', () =>  navigationToggle.checked = false));

  function setSystemColor(bool) {
    if (bool) {
      document.documentElement.removeAttribute('theme');
      localStorage.removeItem('theme');
    } else {
      document.documentElement.setAttribute('theme', 'inverse');
      localStorage.setItem('theme', 'inverse');
    }
  }

  function setAudienceVisibility(type, bool) {
    const audienceSummary = document.querySelectorAll(`js-selectsummary.audience-${type}`);
    [...audienceSummary].forEach((summary) => summary.open = bool);
    if (bool) {
      document.documentElement.removeAttribute(`hide-${type}`);
      localStorage.removeItem(type);
    } else {
      document.documentElement.setAttribute(`hide-${type}`, '');
      localStorage.setItem(type, 'hide');
    }
  }

  systemColorControl.addEventListener('change', (ev) => setSystemColor(ev.detail.chosen));
  audienceDesignerControl.addEventListener('change', (ev) => setAudienceVisibility('designer', ev.detail.chosen));
  audienceEngineerControl.addEventListener('change', (ev) => setAudienceVisibility('engineer', ev.detail.chosen));

  systemColorControl.chosen = !localStorage.getItem('theme');
  audienceDesignerControl.chosen = !localStorage.getItem('designer');
  audienceEngineerControl.chosen = !localStorage.getItem('engineer');

  window.setTimeout(() => document.body.classList.remove('hidden'), 0);
})();