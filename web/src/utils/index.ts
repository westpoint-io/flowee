import _ from "lodash";
import { COLUMNS_PER_ROW } from "../constants";

export function omit(keys: string[], obj: any) {
    return Object.keys(obj).reduce((acc: any, key: any) => {
        if (!keys.includes(key)) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

export function chunkArray(array: any[], size: number = COLUMNS_PER_ROW) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
}


export const removeDuplicates = (list: any[]) => {
    return _.uniqWith(list, (a, b) => {
        return a.source === b.source && a.target === b.target;
    });
};