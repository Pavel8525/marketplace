import * as React from 'react';
import i18n from 'i18next';

import 'app/common/components/data-grid/styles/data-grid.css';

import {
    Button, IButtonProps
} from 'app/common/components';


interface IToolbarItem extends IButtonProps {
    target?: string;
    href?: string;
}

const ToolbarButton = (props: IToolbarItem) => {
    return (
        <>
            {!props.href && (
                <Button
                    {...props}
                    name={props.name}
                    title={props.title}
                    iconClassName={props.iconClassName}
                />
            )}

            {props.href && (
                <a
                    href={props.href}
                    target={props.target || '_blank'}
                    className="btn btn-primary waves-effect"
                    style={{ color: '#fff' }}
                    title={props.title}
                >
                    <i className={props.iconClassName} />
                    {" "}
                    {props.name}
                </a>
            )}
        </>
    );
}

const AddButton = (props: IToolbarItem) =>
    <ToolbarButton
        {...props}

        name={i18n.t("components:data-grid.toolbar-items.create-item.name")}
        title={i18n.t("components:data-grid.toolbar-items.create-item.title")}
        iconClassName={"k-icon k-i-file-add"}
    />

const ExportPdfButton = (props: IToolbarItem) =>
    <ToolbarButton
        {...props}

        name={i18n.t("components:data-grid.toolbar-items.export-pdf.name")}
        title={i18n.t("components:data-grid.toolbar-items.export-pdf.title")}
        iconClassName={"k-icon k-i-file-pdf"}
    />;

const ImportProductButton = (props: IToolbarItem) =>
    <ToolbarButton
        {...props}

        name={i18n.t("components:data-grid.toolbar-items.import-product.name")}
        title={i18n.t("components:data-grid.toolbar-items.import-product.title")}
        iconClassName={"k-icon k-i-download"}
    />;

const AddReferenceButton = (props: IToolbarItem) =>
    <ToolbarButton
        {...props}

        name={i18n.t("components:data-grid.toolbar-items.open-add-change-reference-drawer.name")}
        title={i18n.t("components:data-grid.toolbar-items.open-add-change-reference-drawer.title")}
        iconClassName={"k-icon k-i-plus-outline"}
    />;

const RemoveReferenceButton = (props: IToolbarItem) =>
    <ToolbarButton
        {...props}

        name={i18n.t("components:data-grid.toolbar-items.open-remove-change-reference-drawer.name")}
        title={i18n.t("components:data-grid.toolbar-items.open-remove-change-reference-drawer.title")}
        iconClassName={"k-icon k-i-minus-outline"}
    />;

const SaveButton = (props: IToolbarItem) =>
    <ToolbarButton
        {...props}

        name={i18n.t("components:data-grid.toolbar-items.save.name")}
        title={i18n.t("components:data-grid.toolbar-items.save.title")}
        iconClassName={"k-icon k-i-save"}
    />

const CancelButton = (props: IToolbarItem) =>
    <ToolbarButton
        {...props}

        name={i18n.t("components:data-grid.toolbar-items.cancel.name")}
        title={i18n.t("components:data-grid.toolbar-items.cancel.title")}
        iconClassName={"k-icon k-i-cancel"}
    />

export {
    IToolbarItem,
    ToolbarButton,
    AddButton,
    ExportPdfButton,
    ImportProductButton,
    AddReferenceButton,
    RemoveReferenceButton,
    SaveButton,
    CancelButton
};
