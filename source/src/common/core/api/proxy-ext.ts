import { Bantikom, Edm } from './proxy';
import { combineReducers, Reducer } from 'redux';
import { fetchReducerFactory, storeReducerFactory } from '../data';
import {
    ISingleODataResponse,
    IMultipleODataResponse,
    getSingleODataResponse,
    getMultipleODataResponse
} from './contracts/odata-response';

export namespace BantikomExt {
    export const ProductService = {
        getProductLinks: fetchReducerFactory<ISingleODataResponse<Bantikom.ProductLinksResult>, {}>(
            "function:ProductLinks",
            "/Product",
            (response => getSingleODataResponse<Bantikom.ProductLinksResult>(response)),
            false
        ),
        setConnectedMarketplace: storeReducerFactory<ISingleODataResponse<Bantikom.SetConnectedMarketplaceResponse>, { connectedMarketplaceId: Edm.Guid }>(
            "action:SetConnectedMarketplace",
            "post",
            "/Product",
            (response => getSingleODataResponse<Bantikom.SetConnectedMarketplaceResponse>(response))
        ),
        createMarketplaceProduct: storeReducerFactory<ISingleODataResponse<Bantikom.CreateMarketplaceProductResponse>, { request: Bantikom.CreateMarketplaceProductRequest }>(
            "action:CreateMarketplaceProduct",
            "post",
            "/Product",
            (response => getSingleODataResponse<Bantikom.CreateMarketplaceProductResponse>(response))
        ),
        createMarketplaceProducts: storeReducerFactory<ISingleODataResponse<Bantikom.CreateMarketplaceProductsResponse>, { request: Bantikom.CreateMarketplaceProductsRequest }>(
            "action:CreateMarketplaceProducts",
            "post",
            "/Product",
            (response => getSingleODataResponse<Bantikom.CreateMarketplaceProductsResponse>(response))
        )
    }

    export const SearchImportedProductService = {
        importProduct: storeReducerFactory<ISingleODataResponse<Bantikom.ImportProductResponse>, { request: Partial<Bantikom.ImportProductRequest> }>(
            "action:ImportProduct",
            "post",
            "/SearchImportedProduct",
            (response => getSingleODataResponse<Bantikom.ImportProductResponse>(response))
        ),
        exportProduct: storeReducerFactory<ISingleODataResponse<Bantikom.ExportProductResponse>, { request: Bantikom.ExportProductRequest }>(
            "action:ExportProduct",
            "post",
            "/SearchImportedProduct",
            (response => getSingleODataResponse<Bantikom.ExportProductResponse>(response))
        )
    }

    export const SearchMarketplaceProductService = {
        getMarketplaceProduct: fetchReducerFactory<IMultipleODataResponse<Bantikom.SearchMarketplaceProduct>, {}>(
            "function:GetMarketplaceProduct",
            "/SearchMarketplaceProduct",
            (response => getMultipleODataResponse<Bantikom.SearchMarketplaceProduct>(response)),
            true
        )
    }

    export const ProductGroupService = {
        changeRefs: storeReducerFactory<ISingleODataResponse<Bantikom.ChangeEntityReferenceListResponse>, { request: Bantikom.ChangeEntityReferenceListRequest }>(
            "action:ChangeRefs",
            "post",
            "/ProductGroup",
            (response => getSingleODataResponse<Bantikom.ChangeEntityReferenceListResponse>(response))
        )
    }

    export const MarketPlaceService = {
        getLastUsedMarketplaces: fetchReducerFactory<ISingleODataResponse<Bantikom.GetLastUsedMarketplacesResponse>, {}>(
            "function:GetLastUsedMarketplaces",
            "/Product",
            (response => getSingleODataResponse<Bantikom.GetLastUsedMarketplacesResponse>(response)),
            false
        )
    }

    export const AbTestService = {
        publish: storeReducerFactory<ISingleODataResponse<{}>, {}>(
            "action:Publish",
            "post",
            "/AbTest",
            (response => getSingleODataResponse<{}>(response))
        )
    }

    export const UserPlatformServiceSubscriptionService = {
        subscribe: storeReducerFactory<ISingleODataResponse<Bantikom.PlatformServiceSubscribeResponse>, { request: Bantikom.PlatformServiceSubscribeRequest }>(
            "action:Subscribe",
            "post",
            "/UserPlatformServiceSubscription",
            (response => getSingleODataResponse<Bantikom.PlatformServiceSubscribeResponse>(response))
        ),
    }

    export const SeoTopObservationService = {
        changeRefs: storeReducerFactory<ISingleODataResponse<Bantikom.ObservationProductsChangeEntityReferenceListResponse>, { request: Bantikom.ObservationProductsChangeEntityReferenceListRequest }>(
            "action:ChangeRefs",
            "post",
            "/SeoTopObservation",
            (response => getSingleODataResponse<Bantikom.ObservationProductsChangeEntityReferenceListResponse>(response))
        )
    }

    export const BatchService = {
        batch: storeReducerFactory<ISingleODataResponse<{}>, {}>(
            "action:Batch",
            "post",
            "/$batch",
            (response => getSingleODataResponse<{}>(response))
        )
    }
}

export const getODataServiceReducers = (asyncReducers: any): Reducer => {
    const oDataServiceReducers = {
        ...Bantikom.ODataServiceReducers,

        ProductService_GetProductLinks: BantikomExt.ProductService.getProductLinks.fetchReducer,
        ProductService_CreateMarketplaceProduct: BantikomExt.ProductService.createMarketplaceProduct.reducer,
        ProductService_CreateMarketplaceProducts: BantikomExt.ProductService.createMarketplaceProducts.reducer,

        SearchMarketplaceProductService_GetMarketplaceProduct: BantikomExt.SearchMarketplaceProductService.getMarketplaceProduct.fetchReducer,

        SearchImportedProductService_ImportProductResponse: BantikomExt.SearchImportedProductService.importProduct.reducer,
        SearchImportedProductService_ExportProductResponse: BantikomExt.SearchImportedProductService.exportProduct.reducer,

        ProductGroupService_ChangeRefs: BantikomExt.ProductGroupService.changeRefs.reducer,

        AbTestService_Publish: BantikomExt.AbTestService.publish.reducer,

        MarketPlaceService_GetLastUsedMarketplaces: BantikomExt.MarketPlaceService.getLastUsedMarketplaces.fetchReducer,

        UserPlatformServiceSubscriptionService_Subscribe: BantikomExt.UserPlatformServiceSubscriptionService.subscribe.reducer,

        SeoTopObservationService_ChangeRefs: BantikomExt.SeoTopObservationService.changeRefs.reducer,

        BatchService_Batch: BantikomExt.BatchService.batch.reducer,

        ...asyncReducers
    };

    return combineReducers(oDataServiceReducers);
}

//https://www.carlosag.net/tools/codetranslator/

export interface IOverrideProduct {

    OverrideExtId: boolean;

    OverrideExtId2: boolean;

    OverrideExtId3: boolean;

    OverrideName: boolean;

    OverrideDescription: boolean;

    OverrideOrder: boolean;

    OverrideBarCode: boolean;

    OverrideBrandId: boolean;

    OverrideCategoryId: boolean;

    OverrideWeight: boolean;

    OverrideLong: boolean;

    OverrideWidth: boolean;

    OverrideHeight: boolean;
}

export type Product = Bantikom.Product;
export type MarketplaceKind = Bantikom.MarketplaceKind;
export type AbTest = Bantikom.AbTest;
export type AbTestVariation = Bantikom.AbTestVariation;
