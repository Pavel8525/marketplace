import i18n from "app/common/core/translation/i18n";

export interface IDropDownItem<TValue> {
    text: string;
    value: TValue;
}

export function getNotSelectedDropDownItem(value: string = "all"): IDropDownItem<string> {
    return { text: i18n.t("components:data-grid.columns.all"), value };
}