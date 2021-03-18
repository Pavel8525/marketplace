import i18n from "i18next";
import * as React from "react";
import { WithTranslation } from "react-i18next";
import { ListItemProps } from "@progress/kendo-react-dropdowns";

import {
    autoformFactory,
    FieldType,
    FormColumnLayout,
    FormState,
    IField,
    IFormRow,
    RequiredField,
    Panel,
    LookupEntityType,
    AlertPanel,
    FullHeightPanel,
    Button,
    Drawer
} from "app/common/components";
import { Bantikom } from "app/common/core/api/proxy";
import { Clear, IPaginationState, GetNextPage, SetFilter, IPageable, IOperationState } from "app/common/core/data";
import { PageHeader } from "app/common/layouts/page/components";
import { getGuid } from "app/common/core/api/odata-helper";
import { any } from "app/common/helpers/array-helper";

import { ImportProductRow } from "./ImportProductRow";
import { ResultTable, ConfirmationForm } from "../containers";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";

type SearchImportedProduct = Bantikom.SearchImportedProduct;
type ImportProductResponse = Bantikom.ImportProductResponse;

const SEARCH_IMPORT_PRODUCT_FORM = 'SEARCH_IMPORT_PRODUCT_FORM';


const connecteMarketplaceItemRender = (li: React.ReactElement<HTMLLIElement>, itemProps: ListItemProps) => {
    const itemChildren = <span>{i18n.t(`enums:MarketPlaceKind.${itemProps.dataItem.MarketplaceKind}`)} / {itemProps.dataItem.Name}</span>;
    return React.cloneElement(li, li.props, itemChildren);
};

const getFormRows = (): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'ConnectedMarketplace',
                    label: i18n.t('product:import-product.search.form.connected-marketplace'),
                    type: FieldType.reference,
                    entityType: LookupEntityType.connectedMarketplace,
                    textField: "Name",
                    keyField: "Id",
                    required: true,
                    validate: [RequiredField],
                    initFilter: { Active: true },
                    fetchOnLoad: true,
                    selectFields: ['MarketplaceKind'],
                    itemRender: connecteMarketplaceItemRender
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        },
    ];

    return rows;
}

const EmptyResult = () =>
    <AlertPanel message={i18n.t("product:import-product.search.empty-result")} type="info" />

const DrawerHeader = () =>
    <header>
        <h2 className="category-chooser-headline">
            {i18n.t('product:import-product.drawer.title')}
        </h2>
    </header>

const getIncludedItems = (items: SearchImportedProduct[]): SearchImportedProduct[] => {
    return items.filter(item => item.IncludeInImport === true);
}

interface ISearchRequest extends IPageable {
    ConnectedMarketplaceId?: string;
    ConnectedMarketplaceName?: string;
    ConnectedMarketplaceKind?: Bantikom.MarketplaceKind;
}

interface IOwnProps {
    leadId?: string;
    customerId?: string;
    gotoItem: (itemId: string) => void;
}

interface IDispatchProps {
    setFilter: SetFilter<{}>;
    fetchItems: GetNextPage<{}>;
    clear: Clear;
}

interface IStateProps {
    itemState: IPaginationState<SearchImportedProduct, {}>;
    connectedMarketplaceState: IPaginationState<Bantikom.ConnectedMarketplace, {}>;
    importProductState: IOperationState<ISingleODataResponse<ImportProductResponse>>;
}

interface IState {
    allIncludeInImport: boolean;
    drawerIsOpen: boolean;
    importAll: boolean;
    existConnectedMarketplaces?: boolean;
    includedItems?: SearchImportedProduct[];
}

type IProps = IOwnProps & IStateProps & IDispatchProps & WithTranslation;

class ImportProductPage extends React.Component<IProps, IState> {
    private form: any;
    private searchRequest: ISearchRequest;
    private rows: IFormRow[];

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        let existConnectedMarketplaces = state.existConnectedMarketplaces;
        if (state.existConnectedMarketplaces === null && props.connectedMarketplaceState.data) {
            existConnectedMarketplaces = props.connectedMarketplaceState.items.length > 0;
        }

        let includedItems: SearchImportedProduct[] = [];
        if (props.itemState.data && any(props.itemState.items)) {
            includedItems = getIncludedItems(props.itemState.items);
        }

        let drawerIsOpen = state.drawerIsOpen;
        if (props.importProductState.success) {
            drawerIsOpen = false;
        }

        return {
            ...state,
            existConnectedMarketplaces,
            includedItems,
            drawerIsOpen
        }
    }

    constructor(props: IProps) {
        super(props);

        this.state = {
            drawerIsOpen: false,
            existConnectedMarketplaces: null,
            allIncludeInImport: true,
            includedItems: [],
            importAll: false
        };

        this.searchRequest = {} as ISearchRequest;
        this.props.setFilter(this.searchRequest);

        this.form = autoformFactory({
            formName: SEARCH_IMPORT_PRODUCT_FORM,
            resultType: 'multiple',
            showNotification: false
        }).getForm();
        this.rows = getFormRows();
    }

    public render() {
        const { itemState } = this.props;
        const { filter, pageNo, pageSize } = itemState;
        const {
            existConnectedMarketplaces,
            allIncludeInImport,
            includedItems,
            drawerIsOpen,
            importAll
        } = this.state;
        const fetchItemsGetter = () => this.fetchItems(filter, pageNo, pageSize);
        const disabledStartIncludedItems = includedItems.length === 0;

        return (
            <>
                <PageHeader
                    title={i18n.t("product:import-product.title")}
                    portalName="portal-page-header"
                    iconClassName="fa-shopping-basket"
                />

                <div className="row">
                    <div className="col-xl-12">
                        <Panel
                            uniqueIdentifier="import-product-search-form"
                            canCollapse={true}
                            canMaximize={true}
                            showHeader={false}
                            showIcon={true}
                            title={i18n.t("product:import-product.search.title")}
                        >
                            <FullHeightPanel
                                autohideScroll={false}
                            >
                                <div>
                                    {existConnectedMarketplaces === false && (
                                        <AlertPanel
                                            message={i18n.t("product:import-product.search.dont-have-connected-marketplace")}
                                            type={'info'}
                                        />)
                                    }

                                    <this.form
                                        formState={FormState.creating}
                                        rows={this.rows}
                                        onSubmit={this.searchItem}
                                        submitTitle={i18n.t('product:import-product.search.form.submit-title')}
                                    />

                                    {itemState.items != null && (
                                        <>
                                            <div className="list-group-item py-1 px-1" style={{ border: 'none' }}>
                                                <h2 className="fs-lg fw-500">{i18n.t('product:import-product.search.form.items-found', { count: itemState.count })}</h2>
                                                <h2 className="fs-lg fw-500">{i18n.t('product:import-product.search.form.items-included', { count: includedItems.length })}</h2>
                                                <div className="panel-content border-faded border-left-0 border-right-0 border-bottom-0 flex-row align-items-center">
                                                    <Button
                                                        name={i18n.t('product:import-product.search.form.start-all-import')}
                                                        iconClassName={"k-icon k-i-download"}
                                                        className="btn-primary ml-auto margin-5"
                                                        buttonOnClick={this.onAllImportClick}
                                                    />
                                                    <Button
                                                        name={i18n.t('product:import-product.search.form.start-include-import')}
                                                        iconClassName={"k-icon k-i-download"}
                                                        className="btn-primary ml-auto margin-5"
                                                        buttonOnClick={this.onIncludeImportClick}
                                                        disabled={disabledStartIncludedItems}
                                                    />

                                                    <Button
                                                        className="btn-primary ml-auto margin-5"
                                                        name={allIncludeInImport
                                                            ? i18n.t('product:import-product.search.form.exclude-all')
                                                            : i18n.t('product:import-product.search.form.include-all')
                                                        }
                                                        iconClassName={allIncludeInImport ? "fal fa-square" : "fal fa-check-double"}
                                                        buttonOnClick={this.onAllIncludeClick}
                                                    />

                                                </div>
                                            </div>

                                            <div className="card">
                                                <ResultTable
                                                    tagName={"ul"}
                                                    getScrollContainer={this.getScrollContainer}
                                                    getNextPage={fetchItemsGetter}
                                                    className={"list-group list-group-flush"}
                                                    EmptyPage={EmptyResult}
                                                    ItemView={this.getImportProductRow}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </FullHeightPanel>
                        </Panel>
                    </div>
                </div>

                {itemState.items != null && (
                    <Drawer
                        headerComponent={<DrawerHeader />}
                        mainComponent={
                            <ConfirmationForm
                                foundedItemsCount={itemState.count}
                                importedItemsCount={importAll ? itemState.count : includedItems.length}
                                connectedMarketplaceName={this.searchRequest.ConnectedMarketplaceName}
                                connectedMarkeplaceKind={this.searchRequest.ConnectedMarketplaceKind}
                                connectedMarketplaceId={this.searchRequest.ConnectedMarketplaceId}
                                includedItems={includedItems}
                            />}
                        isOpen={drawerIsOpen}
                        onClose={this.onCloseDrawer}
                    />)
                }
            </>
        )
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private getImportProductRow = ({ data: item }: { data: SearchImportedProduct }) =>
        <ImportProductRow
            item={item}
            onChange={this.onProductRowChange}
        />

    private onProductRowChange = (item: SearchImportedProduct) => {
        const foundItem = this.props.itemState.items.find(i => i.Id === item.Id);
        if (foundItem && item.IncludeInImport !== foundItem.IncludeInImport) {
            foundItem.IncludeInImport = item.IncludeInImport;
            this.forceUpdate();
        }
    }

    private searchItem = ({ ConnectedMarketplace }: any): Promise<void> => {
        const { itemState } = this.props;
        const { pageSize } = itemState;

        this.searchRequest = {
            ConnectedMarketplaceId: ConnectedMarketplace.Id,
            ConnectedMarketplaceName: ConnectedMarketplace.Name,
            ConnectedMarketplaceKind: ConnectedMarketplace.MarketplaceKind
        }

        this.props.clear();
        this.props.setFilter(this.searchRequest);
        return this.fetchItems(this.searchRequest, 0, pageSize);
    }

    private fetchItems = (searchRequest: ISearchRequest, pageNo: number, pageSize: number) => {
        const request = {
            filter: { ConnectedMarketplaceId: getGuid(searchRequest.ConnectedMarketplaceId, 'eq') }
        };

        return this.props.fetchItems(request, pageNo + 1, pageSize);
    }

    private getScrollContainer = () => $(".sp-scroll > div");

    private onAllIncludeClick = () => {
        const allIncludeInImport = !this.state.allIncludeInImport;

        this.props.itemState.items.forEach(item => {
            item.IncludeInImport = allIncludeInImport;
        })

        this.setState(() => ({
            allIncludeInImport: allIncludeInImport
        }))
    }

    private onAllImportClick = () => {
        this.setState(() => ({
            drawerIsOpen: true,
            importAll: true
        }));
    }

    private onIncludeImportClick = () => {
        this.setState(() => ({
            drawerIsOpen: true,
            importAll: false
        }));
    }

    private onCloseDrawer = () => {
        this.setState(() => ({
            drawerIsOpen: false
        }))
    }
}

export {
    IStateProps,
    IDispatchProps,
    ImportProductPage
};
