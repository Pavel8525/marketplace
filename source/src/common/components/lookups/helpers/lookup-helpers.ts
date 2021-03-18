import { any } from "app/common/helpers/array-helper";
import { IFormRow, IField, FieldType } from "../..";

export const forwardLookupValue = (item: any, rows: IFormRow[]) => {
    if (!item) {
        return item;
    }

    const clone = { ...item };

    rows.forEach((row: IFormRow) => {
        row.fields.filter((row: IField) => row.type === FieldType.reference && row.valueName).forEach((field: IField) => {
            clone[field.name] = clone[field.valueName];
        });
    });

    return clone;
}

export const backwardLookupValue = (item: any, rows: IFormRow[]) => {
    if (!item) {
        return item;
    }

    const clone = { ...item };

    rows.forEach((row: IFormRow) => {
        row.fields.filter((row: IField) => row.type === FieldType.reference && row.valueName).forEach((field: IField) => {
            if (clone[field.name]) {
                clone[field.name] = clone[field.name][field.keyField];
            }
        });
    });

    return clone;
}

export const getLookupRequest = (filter: any, initFilter: any, selectFields: string[]) => {
    const filters = [];

    if (initFilter) {
        filters.push(initFilter);
    }

    if (filter) {
        filters.push(filter);
    }

    const request = {
        filter: filters,
        orderBy: ['LastModificationDate desc'],
        select: [
            'Id', 'Name',
            'LastModificationDate', 'CreationDate'
        ]
    };

    if (any(selectFields)) {
        request.select = [...request.select, ...selectFields];
    }

    return request;
}
