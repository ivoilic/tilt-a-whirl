/* eslint-disable import/prefer-default-export */
// http://youmightnotneedjquery.com/

export const ready = fn => {
  // eslint-disable-next-line no-undef
  if (document.readyState !== 'loading') {
    fn();
  } else {
    // eslint-disable-next-line no-undef
    document.addEventListener('DOMContentLoaded', fn);
  }
};
