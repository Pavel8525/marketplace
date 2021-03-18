import {
    FilterDescriptor,
    CompositeFilterDescriptor,
    SortDescriptor,
    State,
    toODataString
} from "@progress/kendo-data-query";
import { any } from "app/common/helpers/array-helper";

const fixOperator = function (operator: string) {
    switch (operator) {
        case 'neq': return 'ne';
        case 'gte': return 'ge';
        case 'lte': return 'le';
        default: return operator;
    }
}

export const parseFilter = function (itemFilter: FilterDescriptor | CompositeFilterDescriptor) {
    const filterDescriptor = itemFilter as FilterDescriptor;

    if ('field' in filterDescriptor) {
        const { field, operator, value } = filterDescriptor;

        switch (operator) {
            case 'contains':
            case 'startswith':
            case 'endswith': {

                // const filter = { PropName: { contains: 'foo' } };
                // buildQuery({ filter })
                // => "$filter=contains(PropName,'foo')"
                // Supported operators: startswith, endswith, contains

                const json = `{ "${field}" : { "${operator}" : "${value}" } }`;
                const result = JSON.parse(json)

                return result;
            }
            case 'doesnotcontain': {

                // const filter = { "indexof(PropName, 'foo')": { eq: 3 } };
                // buildQuery({ filter })
                // => "$filter=indexof(PropName, 'foo') eq 3"

                const json = `{ "indexof(${field}, '${value}')" : { "eq" : -1 } }`;
                const result = JSON.parse(json)

                return result;
            }
            case 'eq':
            case 'neq':
            case 'gte':
            case 'gt':
            case 'lte':
            case 'lt': {
                if (['gte', 'gt', 'lte', 'lt'].find((item) => item === operator) !== undefined && value === null) {
                    return null;
                }

                // const filter = { PropName: { gt: 5 } };
                // buildQuery({ filter })
                // => '?$filter=PropName gt 5'
                // Supported operators: eq, ne, gt, ge, lt, le, in

                const fixedOperator = fixOperator(operator);
                const json = `{ "${field}" : { "${fixedOperator}" : null } }`;
                const result = JSON.parse(json);
                result[field.toString()][fixedOperator] = value;

                return result;
            }

            case 'isnull':
            case 'isnotnull': {
                const o = operator === 'isnull' ? 'eq' : 'ne';
                const json = `{ "${field}" : { "${o}" : null } }`;
                const result = JSON.parse(json);

                return result;
            }
            case 'isempty':
            case 'isnotempty': {
                const o = operator === 'isempty' ? 'eq' : 'ne';
                const json = `{ "${field}" : { "${o}" : "''" } }`;
                const result = JSON.parse(json);

                return result;
            }
            default: throw `Operator '${operator}' not implemented.`;
        }
    }
    return itemFilter;
}

export const parseOrderBy = function (sort: Array<SortDescriptor>): string[] {
    const orderBy = sort.map(itemSort => `${itemSort.field} ${itemSort.dir}`);
    return orderBy;
}

export const mergeRequest = function (request: any, state: State): any {
    //const url = toODataString(state);

    // get sort params
    //
    if (any(state.sort)) {
        const orderBy = parseOrderBy(state.sort);
        request = { ...request, orderBy };
    }

    // get filter params
    //
    if (state.filter) {
        const filters = state.filter.filters
            .map(itemFilter => parseFilter(itemFilter))
            .filter(item => item !== null);

        let requestFilter = (request as any).filter;
        if (requestFilter) {
            if (!Array.isArray(requestFilter)) {
                requestFilter = [requestFilter];
            }
        }

        if (any(filters)) {
            request = {
                ...request,
                filter: requestFilter
                    ? [...requestFilter, ...filters]
                    : [...filters]
            };
        }
    }

    return request;
}

/**
 * Combine two CompositeFilterDescriptor
 * @param base - Base filter
 * @param custom - Custom filter
 */
export const combineFilter = function (base: CompositeFilterDescriptor, custom: CompositeFilterDescriptor): CompositeFilterDescriptor {
    // Remove custom filters
    //
    if (base && any(base.filters)) {
        base.filters = base.filters.filter(f => (f as any).__CustomFilter__ === undefined);
    }

    // Combine custom filters
    //
    let result: CompositeFilterDescriptor = base ? { ...base } : null;
    if (custom && any(custom.filters)) {
        custom.filters.forEach(f => (f as any).__CustomFilter__ = true);

        if (!result) {
            result = {
                logic: 'and',
                filters: []
            } as CompositeFilterDescriptor
        }

        result.filters = [...result.filters, ...custom.filters];
    }

    return result;
}

export const getPageSettings = function (skip: number, take: number): { pageNo: number, pageSize: number } {
    const pageSize = take;
    const pageNo = skip > 0
        ? skip / take + 1
        : 0;

    return {
        pageNo,
        pageSize
    };
}

export const getSkipTakeSettings = function (pageNo: number, pageSize: number): { skip: number, take: number } {
    return {
        skip: pageNo ? (pageNo - 1) * pageSize : 0,
        take: pageSize
    }
}