export function diff<T>(array1: T[], array2: T[]): T[] {
    return array1.filter((x) => array2.indexOf(x) < 0);
}

export function diffBy<T>(array1: T[], array2: T[], equalsFn: (o1: T, o2: T) => boolean): T[] {
    const one = array1.filter(
        (object1) => !array2.some(
            (object2) => equalsFn(object1, object2)));

    const two = array2.filter(
        (object2) => !array1.some(
            (object1) => equalsFn(object1, object2)));

    return one.concat(two);
}

// Выбирает уникальные элементы массива по ключу
// необходимо передать функцию, возвращающую ключ для элемента массива
export function uniqueBy<T>(array: T[], keyGetter: (t: T) => any): T[] {
    return array.filter(
        (v, i, a) =>
            a
                .map((x) => keyGetter(x))
                .indexOf(keyGetter(v)) === i);
}

// Группирует элементы массива по ключу
// необходимо передать функцию, возвращающую ключ для элемента массива
// Возвращает ассоциативный массив (словарь) по заданному ключу
export function groupBy<T>(array: T[], keyGetter: (t: T) => any): T[][] {
    return array.reduce((groups, item) => {
        const val = keyGetter(item);
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
    }, [] as T[][]);
}

export function last<T>(array: T[]): T {
    return array.length && array[array.length - 1];
}

export function lastN<T>(array: T[], n: number): T[] {
    return array.length && array.slice(-n);
}

// Возвращает true, если массив существует и количество элементов в нем больше 0.
// Если передан предикат, то в случае присутсвия элементов будет вызван метод
// массива some с переданным предикатом.
export function any<T>(array: T[], callbackfn?: (t: T) => boolean): boolean {
    const hasItems = array && array.length > 0;
    if (callbackfn) {
        return hasItems && array.some(callbackfn);
    }

    return hasItems;
}

// Делает Array.map, если any вернул true, иначе возвращает null
type MapIfAnyCallback<T, K> = (value: T, index: number, array: T[]) => K;
export function mapIfAny<T, K>(array: T[], callbackfn: MapIfAnyCallback<T, K>): K[] {
    if (!any(array)) {
        return null;
    }

    return array.map(callbackfn);
}

type FillFunction<R> = (index: number) => R;
export const indexingCycle = <R>(length: number, fillFunction: FillFunction<R>) => {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(fillFunction(i));
    }
    return result;
}
