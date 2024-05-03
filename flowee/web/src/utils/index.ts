import _ from 'lodash';
import { COLUMNS_PER_ROW } from '../constants';
import { Edge } from '../@types/edges';

/**
 * Omit specified keys from an object.
 *
 * @param keys - An array of keys to omit.
 * @param obj - The object from which to omit the keys.
 * @returns A new object with the specified keys omitted.
 */
export function omit<T extends object, K extends keyof T>(keys: K[], obj: T) {
  const newObj = { ...obj };
  keys.forEach((key) => {
    delete newObj[key];
  });

  return newObj as Omit<T, K>;
}

export function chunkArray(array: any[], size: number = COLUMNS_PER_ROW) {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }
  return chunkedArray;
}

/**
 * Removes duplicate elements from an array of edges.
 * @param list - The array of edges.
 * @returns A new array with duplicate edges removed.
 */
export const removeDuplicates = (list: Edge[]) => {
  return _.uniqWith(list, (a, b) => {
    return a.source === b.source && a.target === b.target;
  });
};
