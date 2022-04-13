const OFFLINE_MESSAGE = ' - This content is not available, please visit when reconnected to the internet.';

async function toggleOffline() {
  const relativeLinks = document.querySelectorAll('a:not([href^="http"]):not([href^="#"])');
  if (!window.navigator.onLine) {
    // Assume only one cache
    const cacheNames = await caches.keys();
    caches.open(cacheNames.shift())
      .then((cacheStorage) => cacheStorage.keys())
      .then((keys) => checkPathnames(relativeLinks, keys));
  } else {
    relativeLinks.forEach((a) =>  {
      a.classList.remove('offline');
      a.title = a.title.replace(OFFLINE_MESSAGE, '');
    });
  }
}

function checkPathnames(links, keys) {
  const pathnames = keys.map((res) => localManipulation(new URL(res.url).pathname));
  if (pathnames.includes('/introduction')) {
    pathnames.push('/');
  }
  links.forEach((a) => {
    const relativePath = localManipulation(new URL(a.getAttribute('href'), window.location.href).pathname);
    if (!pathnames.includes(relativePath)) {
      a.classList.add('offline');
      a.title = a.title + OFFLINE_MESSAGE;
    }
  })
}

function localManipulation(pathname) {
  if (window.location.host.startsWith('localhost')) {
    return pathname.replace(/\.html$/, '').replace('_site/', '');
  }
  return pathname;
}

window.addEventListener('offline', toggleOffline);
window.addEventListener('online', toggleOffline);

toggleOffline();