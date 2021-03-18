//https://docs.telerik.com/kendo-ui/api/javascript/ui/spreadsheet
//https://github.com/telerik/kendo-ui-core/tree/master/docs/knowledge-base
//https://demos.telerik.com/kendo-ui/spreadsheet/server-side-import-export
//https://docs.telerik.com/kendo-ui/third-party/react?utm_medium=referral&utm_source=npm&utm_campaign=kendo-ui-react-trial-npm-wrapper&utm_content=description#spreadsheet

import * as React from "react";
import '@progress/kendo-ui/js/kendo.spreadsheet';
import { Spreadsheet as KendoSpreadsheet } from '@progress/kendo-spreadsheet-react-wrapper';

import i18n from "app/common/core/translation/i18n";

import '../styles/spreadsheet.css';
import SpreadsheetHelper from "../helpers/SpreadsheetHelper";
import { IColumn } from "../contracts";

interface IProps {
    columns: IColumn[];
    onImport?: (body: string) => void;
}

class Spreadsheet extends React.Component<IProps>{
    private sheets: any = null;
    private validation: any = null;
    private headerBackgroudColor = "#fef0cd";
    private spreadSheet: React.RefObject<KendoSpreadsheet>;
    private resetButton = {
        type: "button",
        text: i18n.t("campaigns:master-creation.select-participants.reset-button-title"),
        showText: "both",
        click: () => this.reset()
    };

    constructor(props: IProps) {
        super(props);

        this.spreadSheet = React.createRef();
        this.validation = {
            dataType: "list",
            showButton: true,
            comparerType: "list",
            from: SpreadsheetHelper.getFromHeader(this.props.columns),
            allowNulls: true,
            type: "reject"
        };
        this.sheets = [{}];
    }

    render() {
        return (
            <div style={{ width: '100%' }}>
                <KendoSpreadsheet
                    ref={this.spreadSheet}
                    name="spreadsheet"
                    rows={5500}
                    sheets={this.sheets}
                    toolbar={{ home: ["open", "exportAs", this.resetButton, ["cut", "copy", "paste"], "format", "freeze", "filter"], insert: false, data: false } as kendo.ui.SpreadsheetToolbar}
                    sheetsbar={false}
                    excelImport={this.onExcelImport}
                />
            </div>
        );
    }

    public componentDidMount() {
        const spreadSheet = this.getSpreadSheetInstance();
        SpreadsheetHelper.prepare(spreadSheet);
        SpreadsheetHelper.insertHeader(spreadSheet.activeSheet(), this.props.columns, this.validation, this.headerBackgroudColor);
    }

    private onExcelImport = (e: kendo.ui.SpreadsheetExcelImportEvent): void => {
        (e as any).promise.then(() => {
            try {
                const spreadsheet = this.getSpreadSheetInstance();
                const sheet = spreadsheet.activeSheet();

                if (sheet) {
                    sheet.insertRow(0);
                    sheet.insertColumn(0);
                    sheet.insertColumn(0);
                    sheet.insertColumn(0);
                    SpreadsheetHelper.insertHeader(sheet, this.props.columns, this.validation, this.headerBackgroudColor);
                } else {
                    throw 'Failed to get sheet.'
                }
            } catch (error) {
                debugger;

            }
        });
    }

    private getSpreadSheetInstance = (): kendo.ui.Spreadsheet => this.spreadSheet.current && this.spreadSheet.current.widgetInstance as kendo.ui.Spreadsheet || null;

    public import = () => {
        const spreadSheet = this.getSpreadSheetInstance();
        const { onImport } = this.props;
        if (onImport) {
            const body = SpreadsheetHelper.getExcelFile(spreadSheet);
            if (body) {
                onImport(body);
            }
        }
    }

    public reset = () => {
        const spreadsheet = this.getSpreadSheetInstance();
        SpreadsheetHelper.clearSheet(spreadsheet.activeSheet());
        SpreadsheetHelper.insertHeader(spreadsheet.activeSheet(), this.props.columns, this.validation, this.headerBackgroudColor);
    }
}
export { Spreadsheet };