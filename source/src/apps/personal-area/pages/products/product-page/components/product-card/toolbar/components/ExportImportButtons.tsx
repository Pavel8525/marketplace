import React from "react";
import i18n from "app/common/core/translation/i18n";
import { SplitButton, SplitButtonItem, ToolbarItem } from "@progress/kendo-react-buttons";

import { ISplitButtonProps } from "../contracts";

class ExportImportButtons extends React.Component<ISplitButtonProps> {
    public render() {
        const { onClick } = this.props;

        return (
            <ToolbarItem>
                <SplitButton text={i18n.t("product-card-toolbar:export-import.title")} onItemClick={onClick}>
                    <SplitButtonItem iconClass="k-icon k-i-upload" text={i18n.t("product-card-toolbar:export-import.export")} />
                    <SplitButtonItem iconClass="k-icon k-i-download" text={i18n.t("product-card-toolbar:export-import.import")} />
                </SplitButton>
            </ToolbarItem>
        )
    }
}

export {
    ExportImportButtons
};
