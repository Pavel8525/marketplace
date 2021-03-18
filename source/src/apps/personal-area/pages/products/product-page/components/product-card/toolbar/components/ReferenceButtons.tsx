import React from "react";
import i18n from "app/common/core/translation/i18n";
import { SplitButton, SplitButtonItem, ToolbarItem } from "@progress/kendo-react-buttons";

import { ISplitButtonProps } from "../contracts";

class ReferenceButtons extends React.Component<ISplitButtonProps> {
    public render() {
        const { onClick } = this.props;

        return (
            <ToolbarItem>
                <SplitButton text={i18n.t("product-card-toolbar:reference.title")} onItemClick={onClick}>
                    <SplitButtonItem iconClass="fal fa-store toolbar-icon" text={i18n.t("product-card-toolbar:reference.set-marketplace")} />
                    <SplitButtonItem iconClass="fal fa-shopping-basket toolbar-icon" text={i18n.t("product-card-toolbar:reference.set-headproduct")} />
                </SplitButton>
            </ToolbarItem>
        );
    }
}

export {
    ReferenceButtons
};
