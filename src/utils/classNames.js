import clsx from 'clsx';

/**
 * Utility function to combine class names conditionally
 * @param {...any} classes - Class names and conditions
 * @returns {string} Combined class names
 */
export const classNames = (...classes) => {
  return clsx(...classes);
};
