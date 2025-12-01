export const BASE_PATH = '/blog';

export const stripBasePath = (pathname = '/') => {
  if (!pathname.startsWith('/')) return pathname || '/';

  if (pathname === BASE_PATH) {
    return '/';
  }

  if (pathname.startsWith(`${BASE_PATH}/`)) {
    const stripped = pathname.slice(BASE_PATH.length);
    return stripped || '/';
  }

  return pathname || '/';
};

export const withBasePath = (path = '/') => {
  if (!path.startsWith('/')) {
    return `${BASE_PATH}/${path}`;
  }

  if (path === '/') {
    return BASE_PATH;
  }

  return `${BASE_PATH}${path}`;
};
