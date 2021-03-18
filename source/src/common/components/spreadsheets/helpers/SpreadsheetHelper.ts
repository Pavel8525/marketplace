import $ from 'jquery';

import { IColumn } from "../contracts";
import { IColumnInfo } from "../contracts/IColumn";
import { any } from "app/common/helpers/array-helper";

export default class SpreadsheetHelper {
    static prepare(spreadsheet: kendo.ui.Spreadsheet) {
        var formulaBar = spreadsheet.element.children()[1];
        formulaBar.remove();
        spreadsheet.element[0].style.width = '100%'
        spreadsheet.resize();
    }

    static clearSheet(sheet: kendo.spreadsheet.Sheet) {
        sheet.range((kendo.spreadsheet as any).SHEETREF).clear();
    }

    static insertHeader(sheet: kendo.spreadsheet.Sheet, columns: IColumn[], validation?: any, backgroundColor?: string) {
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const range = sheet.range(0, i);
            const columnInfo = column as IColumnInfo;

            if (!columnInfo.title) {
                range.value(column as string);
            } else {
                const { title, enabled = true, comment } = columnInfo;
                range.value(title);

                if (!enabled) {
                    range.enable(enabled);
                }

                if (comment) {
                    range.comment(comment);
                }
            }

            if (validation) {
                range.validation({ ...validation });
            }

            if (backgroundColor) {
                range.background(backgroundColor);
            }

        }
    }

    static getFromHeader(columns: IColumn[]): string {
        if (!any(columns)) {
            return null;
        }
        const from = columns.map((column: IColumn) => (column as IColumnInfo).title
            ? (column as IColumnInfo).title
            : column);

        return `"${from.join(',')}"`;
    }

    static getExcelFile(spreadsheet: kendo.ui.Spreadsheet): string {
        const data = spreadsheet.toJSON();
        const workbook = new kendo.ooxml.Workbook(data);
        const base64 = workbook.toDataURL();
        return base64;
    }
}