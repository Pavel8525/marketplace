import * as React from 'react';
import i18n from 'app/common/core/translation/i18n';
import {
    DropDownButton,
    DropDownButtonItemClickEvent,
    SplitButtonItemClickEvent,
    ToolbarSeparator
} from '@progress/kendo-react-buttons';

import { Bantikom, Edm } from 'app/common/core/api/proxy';
import {
    ContainerHeightType,
    Drawer,
    FullHeightPanel,
    ProductLookupChooser,
    Tab,
    Tabs,
    TitleHeader
} from 'app/common/components';
import { any } from 'app/common/helpers/array-helper';
import { OperationChangeReference } from 'app/common/components/lookup-chooser/contracts';
import { ConnectedMarketplaceLookupChooser } from 'app/common/components/lookup-chooser/containers/ConnectedMarketplaceLookupChooser';
import { Clear, Fetch, IFetchState, InvokeSpecificUrl, IOperationState } from 'app/common/core/data';

import {
    ProductCommonOptionsForm,
    OzonCommonOptionsForm,
    WildberriesCommonOptionsForm,
    WildberriesFBSCommonOptionsForm,
    BeruCommonOptionsForm,
    GoodsCommonOptionsForm,
    LamodaCommonOptionsForm,
    OZON_PRODUCT_COMMON_OPTIONS_FORM,
    WILDBERRIES_PRODUCT_COMMON_OPTIONS_FORM,
    WILDBERRIESFBS_PRODUCT_COMMON_OPTIONS_FORM,
    HEAD_PRODUCT_COMMON_OPTIONS_FORM,
    BERU_PRODUCT_COMMON_OPTIONS_FORM,
    GOODS_PRODUCT_COMMON_OPTIONS_FORM,
    LAMODA_PRODUCT_COMMON_OPTIONS_FORM
} from '../../common-options';
import {
    OzonAttributesForm,
    OZON_ATTRIBUTES_FORM,
    WildberriesAttributesForm,
    WildberriesFBSAttributesForm,
    WILDBERRIES_ATTRIBUTES_FORM,
    WILDBERRIESFBS_ATTRIBUTES_FORM
} from '../../attributes';
import {
    EditButtons,
    ExportImportButtons,
    ReferenceButtons,
    Toolbar
} from '../../toolbar';
import { Guid } from 'app/common/helpers/string-helper';
import { ExportMarketplaceConfirmationForm, MarketplaceProductCreateForm } from '../containers';
import { IMultipleODataResponse, ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { drawerWidth } from 'app/common/constants';
import { MarketplaceKind, Product } from 'app/common/core/api/proxy-ext';
import { IAddingMarketplaceItem } from '../contracts';


const DRAWER_WIDTH = drawerWidth;

interface IProductTab {
    title: string;
    subTitle: string;
    srcImage: string;
    body: React.ReactNode;
}

interface IDispatchProps {
    getProductLinks: Fetch<{}>;
    clearProductLinks: Clear;
    setConnectedMarketplace: InvokeSpecificUrl<{ connectedMarketplaceId: Edm.Guid }, {}>;
    getAllMarketPlaces: Fetch<{}>;
}

interface IStateProps {
    exportProductState: IOperationState<ISingleODataResponse<{}>>;
    allMarketPlaces: IFetchState<IMultipleODataResponse<Bantikom.MarketPlace>>;
}

interface IOwnProps {
    productId: string;
    links: Bantikom.ProductLink[];
}

interface IState {
    productTab_current: number;
    productTab_addingMarketplaceProductItems: IAddingMarketplaceItem[];

    connectedMarketplaceSelection_isOpen: boolean;

    exportedProductsSelection_isOpen: boolean;
    exportedProductsSelection_cofirmationForm_isOpen: boolean;
    exportedProductsSelection_cofirmationForm_items: Product[];

    marketplaceProductCreation_isOpen: boolean;
    marketplaceProductCreation_selectedMarketplaceKind: MarketplaceKind;
    marketplaceProductCreation_productIds: string[];
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ProductCard extends React.Component<IProps, IState> {
    private productMarketplaceRequest: {} = {
        expand: {
            Category: {
                select: ['Name', 'Id', 'Code', 'MarketPlaceKind'],
                expand: {
                    Attributes: {
                        select: ['Name', 'Id', 'Code', 'Description', 'DictionaryId', 'IsCollection', 'IsRequired', 'Kind'],
                        expand: {
                            Options: {
                                select: ['Id', 'Code', 'ControlType', 'HideInAttibutesForm', 'Options']
                            }
                        }
                    }
                }
            },
            Brand: {
                select: ['Name', 'Id']
            }
        }
    }

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        let exportedProductsSelection_cofirmationForm_isOpen = state.exportedProductsSelection_cofirmationForm_isOpen;
        let exportedProductsSelection_cofirmationForm_items = state.exportedProductsSelection_cofirmationForm_items;
        if (props.exportProductState.success) {
            exportedProductsSelection_cofirmationForm_isOpen = false;
            exportedProductsSelection_cofirmationForm_items = null;
        }

        if (!any(state.productTab_addingMarketplaceProductItems) && props.allMarketPlaces.data && props.allMarketPlaces.data.items) {
            state.productTab_addingMarketplaceProductItems = props.allMarketPlaces.data.items.map(item => ({
                Id: item.Id,
                Name: i18n.t(`enums:MarketPlaceKind.${item.MarketPlaceKind}`),
                MarketplaceKind: item.MarketPlaceKind
            }));
        }

        return {
            ...state,
            exportedProductsSelection_cofirmationForm_isOpen,
            exportedProductsSelection_cofirmationForm_items
        }
    }

    constructor(props: IProps) {
        super(props);

        const currentLink = this.props.links.find(l => l.ProductId == this.props.productId);

        this.state = {
            productTab_current: this.props.links.indexOf(currentLink),
            productTab_addingMarketplaceProductItems: [],

            connectedMarketplaceSelection_isOpen: false,

            exportedProductsSelection_isOpen: false,
            exportedProductsSelection_cofirmationForm_isOpen: false,
            exportedProductsSelection_cofirmationForm_items: null,

            marketplaceProductCreation_isOpen: false,
            marketplaceProductCreation_selectedMarketplaceKind: null,
            marketplaceProductCreation_productIds: null
        }
    }

    public render() {
        const {
            productTab_current,
            productTab_addingMarketplaceProductItems,

            connectedMarketplaceSelection_isOpen,

            exportedProductsSelection_isOpen,
            exportedProductsSelection_cofirmationForm_isOpen,
            exportedProductsSelection_cofirmationForm_items,

            marketplaceProductCreation_isOpen,
            marketplaceProductCreation_selectedMarketplaceKind,
            marketplaceProductCreation_productIds
        } = this.state;

        const productTabs = this.getProductTabs().map((tab, key) =>
            <Tab
                key={key}
                title={tab.title}
                subTitle={tab.subTitle}
                srcImage={tab.srcImage}
            >
                {tab.body}
            </Tab>);
        const currentProductLink = this.getCurrentProductLink();
        const currentProductId = currentProductLink.ProductId;
        const isHeadProduct = this.isHeadProduct();

        return (
            <>
                <Tabs
                    selected={productTab_current}
                    rightNode={
                        <DropDownButton
                            textField="Name"
                            items={productTab_addingMarketplaceProductItems}
                            text="+"
                            onItemClick={this.onAddProductItemClick}
                        />
                    }
                    onSelect={this.onProductSelectTab}>

                    {productTabs}
                </Tabs>

                {/* Lookup chooser for connected marketplace */}
                <Drawer
                    headerComponent={
                        <TitleHeader title={i18n.t('components:connected-marketplace-chooser.title')} />
                    }
                    mainComponent={
                        <ConnectedMarketplaceLookupChooser
                            id="connected-marketplace-lookup-chooser-product-card"
                            entityId={this.props.productId}
                            entityName='ConnectedMarketplace'
                            selectKind="single"
                            operation={OperationChangeReference.add}
                            onSave={this.onSelectConnectedMarketplace}
                            onClose={this.closeConnectedMarketplaceSelectionDrawer}
                            marketplaceKind={currentProductLink.Kind}
                        />
                    }
                    isOpen={connectedMarketplaceSelection_isOpen}
                    onClose={this.closeConnectedMarketplaceSelectionDrawer}
                    minWidth={DRAWER_WIDTH}
                />

                {/* Lookup chooser for exported marketplace product list */}
                <Drawer
                    headerComponent={
                        <TitleHeader title={i18n.t('components:product-lookup-chooser-export-marketplace-drawer.title')} />
                    }
                    mainComponent={
                        <ProductLookupChooser
                            id="product-lookup-chooser-export-marketplace-drawer"
                            entityId={currentProductId}
                            entityName='Product'
                            requestKind={isHeadProduct ? 'ByHeadProduct' : 'ByCurrentEntity'}
                            selectKind="multiple"
                            operation={OperationChangeReference.add}
                            onSave={this.onSelectExportMarketplaceProducts}
                            onClose={this.closeExportedProductsSelectionDrawer}
                        />
                    }
                    isOpen={exportedProductsSelection_isOpen}
                    onClose={this.closeExportedProductsSelectionDrawer}
                    minWidth={DRAWER_WIDTH}
                />

                {/* Lookup chooser for exported marketplace product confirmation form */}
                <Drawer
                    headerComponent={
                        <TitleHeader title={i18n.t('product:export-product.drawer.title')} />
                    }
                    mainComponent={
                        <ExportMarketplaceConfirmationForm items={exportedProductsSelection_cofirmationForm_items} />
                    }
                    isOpen={exportedProductsSelection_cofirmationForm_isOpen}
                    onClose={this.closeExportedProductsConfirmationDrawer}
                    minWidth={DRAWER_WIDTH}
                />

                {/* Marketplace product create from */}
                <Drawer
                    headerComponent={
                        <TitleHeader title={i18n.t('product:marketplace-product-create-form.drawer.title')} />
                    }
                    mainComponent={
                        <MarketplaceProductCreateForm
                            marketplaceKind={marketplaceProductCreation_selectedMarketplaceKind}
                            productIds={marketplaceProductCreation_productIds}
                            onSave={this.onCreateMarketplaceProduct}
                        />
                    }
                    isOpen={marketplaceProductCreation_isOpen}
                    onClose={this.closeMarketplaceProductCreationDrawer}
                    minWidth={DRAWER_WIDTH}
                />
            </>
        )
    }

    public componentDidMount() {
        this.props.getAllMarketPlaces({
            filter: { NewProductRegistrationAvailable: true },
            orderBy: "Order desc"
        });
    }

    public componentDidUpdate(prevProps: IProps, prevState: IState) {
        const { marketplaceProductCreation_selectedMarketplaceKind } = this.state;

        if (prevState.marketplaceProductCreation_selectedMarketplaceKind != marketplaceProductCreation_selectedMarketplaceKind) {
            this.setState(() => ({
                marketplaceProductCreation_productIds: marketplaceProductCreation_selectedMarketplaceKind
                    ?
                    this.props.links
                        .filter(item => item.Kind === 'Internal' || item.Kind === marketplaceProductCreation_selectedMarketplaceKind)
                        .map(item => item.ProductId)
                    : null
            }));
        }
    }

    private getProductTabs = (): IProductTab[] => {
        const { links } = this.props;
        const tabs: IProductTab[] = [];

        if (any(links)) {
            links.forEach((link) => {
                let srcImage = null;

                let CommonOptionsForm = null;
                let commonOptionFormName = `${link.Kind.toUpperCase()}_PRODUCT_COMMON_OPTIONS_FORM`;

                let AttributesForm = null;
                let attributesFormName = `${link.Kind.toUpperCase()}_ATTRIBUTES_FORM`;

                let ToolbarChildren: React.ReactNode[] = [
                    <EditButtons onClick={null} key={Guid.newGuid()} />,
                    <ExportImportButtons onClick={this.onExportImportButtonsClick} key={Guid.newGuid()} />,
                    <ToolbarSeparator key={Guid.newGuid()} />
                ];

                if (link.Kind !== 'Internal') {
                    ToolbarChildren.push(
                        <ReferenceButtons onClick={this.onReferenceButtonsClick} key={Guid.newGuid()} />
                    );
                }

                switch (link.Kind) {
                    case "Internal": {
                        srcImage = '/favicon/favicon.ico';

                        CommonOptionsForm = ProductCommonOptionsForm;
                        commonOptionFormName = HEAD_PRODUCT_COMMON_OPTIONS_FORM;

                        break;
                    }
                    case "Ozon": {
                        srcImage = '/img/assets/marketplaces/ozon.ico';

                        CommonOptionsForm = OzonCommonOptionsForm;
                        commonOptionFormName = OZON_PRODUCT_COMMON_OPTIONS_FORM;

                        AttributesForm = OzonAttributesForm;
                        attributesFormName = OZON_ATTRIBUTES_FORM;

                        break;
                    }
                    case "Wildberries": {
                        srcImage = '/img/assets/marketplaces/wb.ico';

                        CommonOptionsForm = WildberriesCommonOptionsForm;
                        commonOptionFormName = WILDBERRIES_PRODUCT_COMMON_OPTIONS_FORM;

                        AttributesForm = WildberriesAttributesForm;
                        attributesFormName = WILDBERRIES_ATTRIBUTES_FORM;

                        break;
                    }
                    case "WildberriesFBS": {
                        srcImage = '/img/assets/marketplaces/wb-fbs.png';

                        CommonOptionsForm = WildberriesFBSCommonOptionsForm;
                        commonOptionFormName = WILDBERRIESFBS_PRODUCT_COMMON_OPTIONS_FORM;

                        AttributesForm = WildberriesFBSAttributesForm;
                        attributesFormName = WILDBERRIESFBS_ATTRIBUTES_FORM;

                        break;
                    }
                    case "Beru": {
                        srcImage = '/img/assets/marketplaces/ymarket.svg';

                        CommonOptionsForm = BeruCommonOptionsForm;
                        commonOptionFormName = BERU_PRODUCT_COMMON_OPTIONS_FORM;

                        break;
                    }
                    case "Goods": {
                        CommonOptionsForm = GoodsCommonOptionsForm;
                        commonOptionFormName = GOODS_PRODUCT_COMMON_OPTIONS_FORM;

                        srcImage = '/img/assets/marketplaces/goods.png';

                        break;
                    }
                    case "Lamoda": {
                        srcImage = '/img/assets/marketplaces/lamoda.ico';

                        CommonOptionsForm = LamodaCommonOptionsForm;
                        commonOptionFormName = LAMODA_PRODUCT_COMMON_OPTIONS_FORM;

                        break;
                    }
                    default: {
                        console.error(`For product kind ${link.Kind} common options form not implemented`);
                        return;
                    }
                }

                const title = i18n.t(`enums:MarketPlaceKind.${link.Kind}`);
                const subTitle = link.Kind !== 'Internal'
                    ? link.ConnectedMarketplaceName || " " : null;

                tabs.push({
                    title: title,
                    subTitle: subTitle,
                    srcImage: srcImage,
                    body: (
                        <>
                            <Toolbar>
                                {ToolbarChildren}
                            </Toolbar>

                            <FullHeightPanel
                                height={ContainerHeightType.Auto}
                            >
                                <CommonOptionsForm
                                    request={this.productMarketplaceRequest}
                                    formName={commonOptionFormName}
                                    itemId={link.ProductId}
                                />

                                {AttributesForm && (
                                    <AttributesForm
                                        request={this.productMarketplaceRequest}
                                        formName={attributesFormName}
                                        itemId={link.ProductId}
                                    />
                                )}

                            </FullHeightPanel>
                        </>
                    )
                })
            })
        }

        return tabs;
    }

    private onReferenceButtonsClick = (event: SplitButtonItemClickEvent) => {
        switch (event.itemIndex) {
            case 0: {
                this.openConnectedMarketplaceDrawer();
                break;
            }
        }
    }

    private onExportImportButtonsClick = (event: SplitButtonItemClickEvent) => {
        switch (event.itemIndex) {
            case 0: {
                this.openExportedProductsSelectionDrawer();
                break;
            }
        }
    }

    private onProductSelectTab = (tabId: number) => {
        this.setState(() => ({
            productTab_current: tabId
        }));
    }

    private openConnectedMarketplaceDrawer = () => {
        this.setState(() => ({
            connectedMarketplaceSelection_isOpen: true
        }));
    }

    private closeConnectedMarketplaceSelectionDrawer = () => {
        this.setState(() => ({
            connectedMarketplaceSelection_isOpen: false
        }));
    }

    private openExportedProductsSelectionDrawer = () => {
        this.setState(() => ({
            exportedProductsSelection_isOpen: true
        }));
    }

    private closeExportedProductsSelectionDrawer = () => {
        this.setState(() => ({
            exportedProductsSelection_isOpen: false
        }));
    }

    private closeExportedProductsConfirmationDrawer = () => {
        this.setState(() => ({
            exportedProductsSelection_cofirmationForm_isOpen: false,
            exportedProductsSelection_cofirmationForm_items: null
        }));
    }

    private closeMarketplaceProductCreationDrawer = () => {
        this.setState(() => ({
            marketplaceProductCreation_isOpen: false,
            marketplaceProductCreation_selectedMarketplaceKind: null
        }));
    }

    private getCurrentProductLink = () => this.props.links[this.state.productTab_current];

    private isHeadProduct = (): boolean => this.getCurrentProductLink().Kind === 'Internal';

    private onSelectConnectedMarketplace = (selectedItems: { Id: string }[]) => {
        const currentProductLink = this.getCurrentProductLink();

        if (currentProductLink.Kind === 'Internal' || !any(selectedItems)) {
            this.closeConnectedMarketplaceSelectionDrawer();
            return new Promise<{}>((resolve) => resolve(null));
        }

        const { productId, getProductLinks } = this.props;
        const connectedMarketplaceId = selectedItems[0].Id;
        const promise = this.props.setConnectedMarketplace(
            {
                connectedMarketplaceId
            },
            currentProductLink.ProductId,
            {
                func: `SetConnectedMarketplace`
            });

        promise.then(() => {
            getProductLinks({ key: productId, func: `GetProductLinks` });
            this.closeConnectedMarketplaceSelectionDrawer();
        });
        return promise;
    }

    private onSelectExportMarketplaceProducts = (selectedItems: Product[]) => {
        this.setState(() => ({
            exportedProductsSelection_cofirmationForm_isOpen: true,
            exportedProductsSelection_cofirmationForm_items: selectedItems,
            exportedProductsSelection_isOpen: false
        }));
    }

    private onCreateMarketplaceProduct = () => {
        this.setState(() => ({
            marketplaceProductCreation_isOpen: false,
            marketplaceProductCreation_selectedMarketplaceKind: null
        }));

        const { productId, getProductLinks } = this.props;
        getProductLinks({ key: productId, func: `GetProductLinks` });
    }

    private onAddProductItemClick = (event: DropDownButtonItemClickEvent) => {
        this.setState(() => ({
            marketplaceProductCreation_isOpen: true,
            marketplaceProductCreation_selectedMarketplaceKind: event.item.MarketplaceKind
        }));
    }
}

export {
    IStateProps,
    IDispatchProps,
    ProductCard
};