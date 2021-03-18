import * as React from "react";
import i18n from "app/common/core/translation/i18n";
import _ from "lodash";

import {
    AlertPanel,
    IFormRow,
    FieldType,
    FieldControl,
    IField,
    FormColumnLayout,
    RequiredField,
    autoformFactory,
    FormState,
    ISelectOption,
    Panel,
    FetchWithLoader,
    MaxLengthEmail,
    EmailField
} from "app/common/components";
import { drawerWidth } from "app/common/constants";
import { IOperationState, Clear, InvokeSpecificUrl, IFetchState, Fetch } from "app/common/core/data";
import { ISingleODataResponse, IMultipleODataResponse } from "app/common/core/api/contracts/odata-response";
import { Bantikom } from "app/common/core/api/proxy";
import { getEnumExistProductAction } from "app/common/core/api/enum-source";
import { authService } from "app/common/core/auth";
import { Guid } from "app/common/helpers/string-helper";

type ImportProductRequest = Partial<Bantikom.ImportProductRequest>;
type ImportProductResponse = Bantikom.ImportProductResponse;
type SearchImportedProduct = Bantikom.SearchImportedProduct;
type MarketplaceKind = Bantikom.MarketplaceKind;

const IMPORT_PRODUCT_CONFIRMATION_FORM = 'IMPORT_PRODUCT_CONFIRMATION_FORM';
const SELECTED_MARKETPLACE_KINDS_FIELD_NAME = "SelectedMarketplaces";

const validateRequiredEmail = (value: string, allValue: ImportProductRequest) => {
    if (!allValue.NotifyMeByEmail) {
        return undefined;
    }

    return RequiredField(value);
}

const validateSelectedMarketplaceKinds = (value: any, allValues: ImportProductRequest) => {

    const isValid =
        allValues[SELECTED_MARKETPLACE_KINDS_FIELD_NAME] &&
        Object.values(
            allValues[SELECTED_MARKETPLACE_KINDS_FIELD_NAME] as {}
        ).includes(true);


    if (!isValid) {
        return i18n.t(
            "product:import-product.drawer.form.select-marketplaces-error"
        );
    }

    return undefined;
};

const getFormRows = (enumExistProductAction: ISelectOption[], marketplaces: Bantikom.MarketPlace[] = []): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'ExistProductAction',
                    label: i18n.t('product:import-product.drawer.form.exist-product-action'),
                    type: FieldType.enum,
                    control: FieldControl.materialDropDown,
                    required: true,
                    validate: [RequiredField],
                    options: enumExistProductAction,
                    keyField: 'value',
                    textField: 'name',
                    description: i18n.t('product:import-product.drawer.form.exist-product-action-description')
                } as IField
            ],
            columntLayout: FormColumnLayout.solo
        }, {
            fields: [
                {
                    name: SELECTED_MARKETPLACE_KINDS_FIELD_NAME,
                    label: i18n.t('product:import-product.drawer.form.select-marketplaces-action'),
                    type: FieldType.array,
                    validate: [validateSelectedMarketplaceKinds],
                    nestedFields: marketplaces.map((markeplace) => ({
                        name: markeplace.MarketPlaceKind,
                        label: markeplace.Name,
                        type: FieldType.boolean,
                        control: FieldControl.switch,
                        classNameContainer: 'col-12',
                    }))
                } as IField
            ],
            columntLayout: FormColumnLayout.solo
        },
        {
            fields: [
                {
                    name: "NotifyMeByEmail",
                    label: i18n.t('product:import-product.drawer.form.notify-me-by-email'),
                    type: FieldType.boolean
                } as IField,
            ],
            columntLayout: FormColumnLayout.solo
        },
        {
            fields: [
                {
                    name: "Email",
                    label: "Email",
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    validate: [MaxLengthEmail, EmailField, validateRequiredEmail]
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        }
    ];

    return rows;
}

interface IStateProps {
    importProductState: IOperationState<ISingleODataResponse<ImportProductResponse>>;
    allMarketPlaces: IFetchState<IMultipleODataResponse<Bantikom.MarketPlace>>;
}

interface IDispatchProps {
    getAllMarketPlaces: Fetch<{}>;
    invokeImportProduct: InvokeSpecificUrl<{ request: Partial<Bantikom.ImportProductRequest> }, {}>;
    clear: Clear;
}

interface IOwnProps {
    importedItemsCount: number;
    foundedItemsCount: number;
    includedItems: SearchImportedProduct[];
    connectedMarketplaceName: string;
    connectedMarkeplaceKind: MarketplaceKind;
    connectedMarketplaceId: string;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ConfirmationForm extends React.Component<IProps> {
    private form: any;
    private enumExistProductAction: ISelectOption[] = getEnumExistProductAction();

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: IMPORT_PRODUCT_CONFIRMATION_FORM
        }).getForm();
    }

    public render() {
        const {
            foundedItemsCount,
            importedItemsCount,
            connectedMarketplaceName
        } = this.props;

        return (
            <div className="categories-chooser-page" style={{ width: drawerWidth }}>
                <div className="category-chooser-description">
                    <AlertPanel
                        message={i18n.t('product:import-product.drawer.description')}
                        type={'info'}
                    />
                    <p className="description">{i18n.t('product:import-product.drawer.selected-connected-marketplace')} {" "} <b>{connectedMarketplaceName}</b></p>
                    <p className="description">{i18n.t('product:import-product.drawer.items-found')} {" "} <b>{foundedItemsCount}</b></p>
                    <p className="description">{i18n.t('product:import-product.drawer.items-included')} {" "} <b>{importedItemsCount}</b></p>

                    <Panel
                        uniqueIdentifier="confirmation-form-panel"
                        showHeader={false}
                    >
                        <FetchWithLoader fetchState={this.props.allMarketPlaces}>
                            <this.form
                                formState={FormState.creating}
                                rows={this.getFormRows()}
                                initialValues={{ ...this.getInitialValues() }}
                                onSubmit={this.onConfirmClick}
                                submitTitle={i18n.t('product:import-product.drawer.confirm')}
                                disableCheckDirty={true}
                            />
                        </FetchWithLoader>
                    </Panel>
                </div>
            </div >
        )
    }

    public componentDidMount() {
        this.props.getAllMarketPlaces({
            filter: { NewProductRegistrationAvailable: true },
            orderBy: "Order desc"
        });
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private getInitialValues() {
        const marketplaces = this.getAllMarketPlaces();
        const defaultSelectedMarketplaceKinds = {} as any;

        marketplaces.forEach(
            (marketplace) =>
            (defaultSelectedMarketplaceKinds[
                marketplace.MarketPlaceKind
            ] = true)
        );
        const defaultImportProductRequest: ImportProductRequest = {
            ExistProductAction: "AddNewWithNewIdentifier",
            SelectedMarketplaces: defaultSelectedMarketplaceKinds,
            NotifyMeByEmail: true,
            Email: authService.getUserAuthData().userName
        };

        return defaultImportProductRequest;
    }

    private getAllMarketPlaces = (): Bantikom.MarketPlace[] => {
        const { allMarketPlaces, connectedMarkeplaceKind } = this.props;
        if (allMarketPlaces.data == null) {
            return [];
        }

        return allMarketPlaces.data.items
            .filter(item => item.Id !== connectedMarkeplaceKind);
    }

    private getFormRows = (): IFormRow[] => {
        const allMarketPlaces = this.getAllMarketPlaces();
        return getFormRows(this.enumExistProductAction, allMarketPlaces);
    }

    private onConfirmClick = (formData: ImportProductRequest) => {
        const {
            importedItemsCount,
            foundedItemsCount,
            includedItems,
            connectedMarkeplaceKind,
            connectedMarketplaceId,
            invokeImportProduct
        } = this.props;
        const {
            SelectedMarketplaces,
            ExistProductAction,
            Email,
            NotifyMeByEmail,
        } = formData;

        const selectedMarketplaces = Object.entries(SelectedMarketplaces)
            .filter((item: any) => item[1] === true)
            .map(item => ({
                MarketplaceKind: item[0] as MarketplaceKind,
                ConnectedMarketplaceId: connectedMarkeplaceKind === item[0] ? connectedMarketplaceId : null
            }));


        const importAllItems = foundedItemsCount === importedItemsCount;
        const request: ImportProductRequest = {
            Id: Guid.newGuid(),
            ImportAllItems: importAllItems,
            ImportIncludedItems: importAllItems ? [] : includedItems.map(item => ({ ProductId: item.Id, ExternalVendorCode: item.ExternalVendorCode, InternalVendorCode: item.InternalVendorCode })),
            ExistProductAction: ExistProductAction,
            ConnectedMarketplaceId: connectedMarketplaceId,
            SelectedMarketplaces: selectedMarketplaces,
            NotifyMeByEmail,
            Email,

            //TODO
            Language: 'ru',
            AddImages: true,
            AddPrices: true,
            AddToGroup: true
        };

        return invokeImportProduct(
            { request },
            null,
            {
                func: `ImportProduct`
            });
    }
}

export {
    IStateProps,
    IDispatchProps,
    ConfirmationForm
};
