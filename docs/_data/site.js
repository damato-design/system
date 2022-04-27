const path = require('path');

const url = process.env.ELEVENTY_ENV === 'dev'
  ? path.resolve(__dirname, '..', '..', '_site')  + '/'
  : 'https://system.damato.design';

module.exports = {
  title: 'DAMATO Design System',
  subtitle: 'The design system house design system',
  url,
  feedUrl: `${url}feed.xml`
};
