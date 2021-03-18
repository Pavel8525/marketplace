import * as React from "react";
import i18n from "app/common/core/translation/i18n";
import { ListItemProps } from "@progress/kendo-react-dropdowns";

import {
    IFormRow,
    FieldType,
    FieldControl,
    IField,
    FormColumnLayout,
    autoformFactory,
    FormState,
    Panel,
    LookupEntityType,
    RequiredField
} from "app/common/components";
import { drawerWidth } from "app/common/constants";
import { IOperationState, Clear, InvokeSpecificUrl } from "app/common/core/data";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { Bantikom } from "app/common/core/api/proxy";
import { MarketplaceKind } from "app/common/core/api/proxy-ext";
import { Guid } from "app/common/helpers/string-helper";

type CreateMarketplaceProductRequest = Bantikom.CreateMarketplaceProductRequest;
type CreateMarketplaceProductResponse = Bantikom.CreateMarketplaceProductResponse;

const MARKETPLACE_PRODUCT_CREATE_FORM = 'MARKETPLACE_PRODUCT_CREATE_FORM';

const productItemRender = (li: React.ReactElement<HTMLLIElement>, itemProps: ListItemProps) => {
    const itemChildren = <span>{i18n.t(`enums:MarketPlaceKind.${itemProps.dataItem.MarketPlaceKind}`)} / {itemProps.dataItem.Name}</span>;
    return React.cloneElement(li, li.props, itemChildren);
};

const getFormRows = (productIds: string[], marketplaceKind: MarketplaceKind): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'HeadProductId',
                    label: i18n.t('product:marketplace-product-create-form.drawer.form.head-product'),
                    type: FieldType.reference,
                    control: FieldControl.lookup,
                    entityType: LookupEntityType.product,
                    textField: "Name",
                    keyField: "Id",
                    required: true,
                    validate: [RequiredField],
                    initFilter: { Id: { in: productIds.map(item => ({ type: 'guid', value: item })) } },
                    fetchOnLoad: true,
                    selectFields: ['MarketPlaceKind'],
                    itemRender: productItemRender
                } as IField,
                {
                    name: 'ConnectedMarketplaceId',
                    label: i18n.t('product:marketplace-product-create-form.drawer.form.connected-marketplace'),
                    type: FieldType.reference,
                    control: FieldControl.lookup,
                    entityType: LookupEntityType.connectedMarketplace,
                    textField: "Name",
                    keyField: "Id",
                    initFilter: { MarketplaceKind: marketplaceKind },
                    fetchOnLoad: true
                } as IField
            ],
            columntLayout: FormColumnLayout.solo
        }
    ];

    return rows;
}

const defaultImportProductRequest: CreateMarketplaceProductRequest = {
    Id: null,
    MarketplaceKind: null,
    ConnectedMarketplaceId: null
};

interface IStateProps {
    createMarketplaceProductState: IOperationState<ISingleODataResponse<CreateMarketplaceProductResponse>>;
}

interface IDispatchProps {
    createMarketplaceProduct: InvokeSpecificUrl<{ request: Bantikom.CreateMarketplaceProductRequest }, {}>;
    clear: Clear;
}

interface IOwnProps {
    productIds: string[];
    marketplaceKind: MarketplaceKind;

    onSave: () => void;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class MarketplaceProductCreateForm extends React.Component<IProps> {
    private rows: IFormRow[] = null;
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: MARKETPLACE_PRODUCT_CREATE_FORM
        }).getForm();
        this.rows = getFormRows(this.props.productIds, this.props.marketplaceKind);
    }

    public render() {
        const {
            marketplaceKind
        } = this.props;

        return (
            <div className="categories-chooser-page" style={{ width: drawerWidth }}>
                <div className="category-chooser-description">
                    <p className="description">
                        {i18n.t('product:marketplace-product-create-form.drawer.description')}
                        {" "}
                        <b>{i18n.t(`enums:MarketPlaceKind.${marketplaceKind}`)}</b>
                    </p>

                    <Panel
                        uniqueIdentifier="confirmation-form-panel"
                        showHeader={false}
                    >
                        <this.form
                            formState={FormState.creating}
                            rows={this.rows}
                            initialValues={{ ...defaultImportProductRequest }}
                            onSubmit={this.onConfirmClick}
                            submitTitle={i18n.t('product:export-product.drawer.confirm')}
                            disableCheckDirty={true}
                        />
                    </Panel>
                </div>
            </div >
        )
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private onConfirmClick = (formData: any) => {
        const request: CreateMarketplaceProductRequest = {
            Id: Guid.newGuid(),
            MarketplaceKind: this.props.marketplaceKind,
            ConnectedMarketplaceId: formData.ConnectedMarketplaceId && formData.ConnectedMarketplaceId.Id
        };

        const promise = this.props.createMarketplaceProduct(
            { request },
            formData.HeadProductId.Id,
            {
                func: 'CreateMarketplaceProduct'
            });

        promise.then(() => {
            this.props.onSave();
        });

        return promise;
    }
}

export {
    IStateProps,
    IDispatchProps,
    MarketplaceProductCreateForm
};
