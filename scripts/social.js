import 'sharect';

(function() {
  Sharect.config({
    facebook: true,
    twitter: true,
    backgroundColor: 'var(--accent--defaultColor)',
    iconColor: 'var(--onAccent--defaultColor)',
    selectableElements: ['section']
  }).init();
})();