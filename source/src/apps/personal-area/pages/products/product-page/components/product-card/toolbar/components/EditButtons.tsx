import i18n from "app/common/core/translation/i18n";
import React from "react";
import { SplitButton, SplitButtonItem, ToolbarItem } from "@progress/kendo-react-buttons";

import { ISplitButtonProps } from "../contracts";

class EditButtons extends React.Component<ISplitButtonProps> {
    public render() {
        const { onClick } = this.props;

        return (
            <ToolbarItem >
                <SplitButton text={i18n.t("product-card-toolbar:edit.title")} onItemClick={onClick}>
                    <SplitButtonItem icon="copy" text={i18n.t("product-card-toolbar:edit.copy")} />
                    <SplitButtonItem icon="trash" text={i18n.t("product-card-toolbar:edit.remove")} />
                </SplitButton>
            </ToolbarItem>
        );
    }
}

export {
    EditButtons
};
