/**************************************************************************
Created by odatatools: https://marketplace.visualstudio.com/items?itemName=apazureck.odatatools
Use Command 'odata: xyUpdate to refresh data while this file is active in the editor.
Creation Time: Sun Jan 31 2021 18:30:26 GMT+0300 (Москва, стандартное время)
DO NOT DELETE THIS IN ORDER TO UPDATE YOUR SERVICE
#ODATATOOLSOPTIONS
{
    "modularity": "Ambient",
    "requestOptions": {},
    "source": "http://localhost/api/$metadata",
    "useTemplate": "proxy.ot"
}
#ODATATOOLSOPTIONSEND
**************************************************************************/



import './odatajs';

import {
    fetchReducerFactory,
    paginationReducerFactory,
    storeReducerFactory
} from 'app/common/core/data';
import {
    IODataResponse,
    IMultipleODataResponse,
    IPageableODataResponse,
    ISingleODataResponse,
    getODataResponse,
    getMultipleODataResponse,
    getSingleODataResponse,
    getPageODataResponse
} from 'app/common/core/api/contracts/odata-response';

// Base classes ##########################################################
// Leave this in order to use the base classes
namespace odatatools {
    enum Method {
        GET, POST, PUT, PATCH, DELETE
    }

    export class ProxyBase {
        constructor(public readonly Address: string, public readonly Name?: string, additonalHeaders?: odatajs.Header) {
            this.Name = this.Name || "ProxyService";

            this.Headers = { "Content-Type": "application/json", Accept: "application/json" };

            for (var attrname in additonalHeaders) { this.Headers[attrname] = additonalHeaders[attrname]; };
        }

        /**
         * All headers appended to each request.
         * 
         * @type {odatajs.Header}
         * @memberOf EntitySet
         */
        readonly Headers: odatajs.Header;
    }

    export abstract class ODataQueryOptionBase {
        private query: string[] = [];

        protected resolveODataOptions(): string {
            if (this.query.length > 0)
                return "?" + this.query.join("&");
            else
                return "";
        }

        protected addToQuery(element: string) {
            this.query.push(element);
        }
        protected emptyQuery(): void {
            this.query = [];
        }
    }

    export abstract class ODataQueryOptionsGetSingle<T> extends ODataQueryOptionBase {

    }

    export abstract class ODataQueryFilterOptions<T> extends ODataQueryOptionsGetSingle<T> {

        abstract Get(): Promise<T[]>;
        abstract Get(id: string): Promise<T>;

        abstract Count(): Promise<number>;

        /**
         * Selects properties on the elements. Works on Get() and Get(id).
         * 
         * @param {keyof T | (keyof T)[]} properties Use comma separated names without spaces
         * @returns {ODataQueryOptions<T>} 
         * 
         * @memberof ODataQueryOptions
         */
        Select(properties: keyof T | (keyof T)[]): ODataQueryFilterOptions<T> {
            if (typeof properties === "string")
                this.addToQuery("$select=" + properties);
            else
                this.addToQuery("$select=" + (<(keyof T)[]>properties).join(","));
            return this;
        }

        /**
         * Orders elements by the given property. Works only on Get()
         * 
         * @param {string} property Property on dataset to order by
         * @param {Order} [order=asc] Order "asc" for ascending and "desc" for descending.
         * @returns {ODataQueryFilterOptions<T>} 
         * 
         * @memberof ODataQueryFilterOptions
         */
        OrderBy(property: keyof T, order?: Order): ODataQueryFilterOptions<T> {
            this.addToQuery("$orderby=" + property + order ? " " + order : "");
            return this;
        }

        /**
         * Top selects the given number of element. Works only on Get()
         * 
         * @param {number} select number of elements to select
         * @returns {ODataQueryFilterOptions<T>} 
         * 
         * @memberof ODataQueryFilterOptions
         */
        Top(select: number): ODataQueryFilterOptions<T> {
            this.addToQuery("$top=" + select);
            return this;
        }

        /**
         * Skips the given number of elements and starts with element n + 1
         * 
         * @param {number} select Number of elements to skip
         * @returns {ODataQueryFilterOptions<T>} 
         * 
         * @memberof ODataQueryFilterOptions
         */
        Skip(select: number): ODataQueryFilterOptions<T> {
            this.addToQuery("$skip=" + select);
            return this;
        }

        /**
         * Filters by given criteria. See odata $filter convention for information on syntax.
         * 
         * @param {string} filter Filter syntax specified by odata V4 standard.
         * @returns {ODataQueryFilterOptions<T>} 
         * 
         * @memberof ODataQueryFilterOptions
         */
        Filter(filter: string): ODataQueryFilterOptions<T> {
            this.addToQuery("$filter=" + filter);
            return this;
        }


        /**
         * Expands given property or array of properties.
         * 
         * @param {(keyof T | (keyof T)[])} properties Properties to expand on.
         * @returns {ODataQueryFilterOptions<T>}
         * 
         * @memberof ODataQueryFilterOptions
         */
        Expand(properties: keyof T | (keyof T)[]): ODataQueryFilterOptions<T> {
            if (typeof properties === "string")
                this.addToQuery("$expand=" + properties);
            else
                this.addToQuery("$expand=" + (<(keyof T)[]>properties).join(","));
            return this;
        }

        /**
         * Searches for a value in the entity set as specified in OData protocol
         * 
         * @param {string} searchExpression Search specified in OData protocol
         * @returns {ODataQueryFilterOptions<T>} 
         * 
         * @memberof ODataQueryFilterOptions
         */
        Search(searchExpression: string): ODataQueryFilterOptions<T> {
            this.addToQuery("$search=" + searchExpression)
            return this;
        }

        Custom(customData: string): ODataQueryFilterOptions<T> {
            this.addToQuery(customData);
            return this;
        }
    }

    export type Order = "asc" | "desc";

    export type Partial<T> = {
        [P in keyof T]?: T[P];
    };

    /**
     * 
     * A generic entity set which represents the content of the entity container.
     * 
     * @export
     * @class EntitySet
     * @template T
     */
    export class EntitySet<T> extends ODataQueryFilterOptions<T> {

        /**
         * Creates an instance of EntitySet.
         * 
         * @param {string} name of the EntitySet (Will determine the address of the entityset, too -> address + "/" + name)
         * @param {string} address of the service
         * @param {string} key of the EntitySet
         * @param {odatajs.Header} [headers] additional headers: Per default there are "Content-Type" and "Accept".
         * 
         * @memberOf EntitySet
         */
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super();
            this.Name = name;
            this.Address = address.replace(/\/$/, "") + "/" + name;
            this.Key = key;
            this.Headers = { "Content-Type": "application/json", Accept: "application/json" };

            for (var attrname in additionalHeaders) { this.Headers[attrname] = additionalHeaders[attrname]; };
        }

        /**
         * Name of the Entity Set (which is appended to the URI)
         * @memberOf EntitySet
         */
        readonly Name: string;
        /**
         * Address of the OData Service
         * @memberOf EntitySet
         */
        readonly Address: string;

        /**
         * All headers appended to each request.
         * 
         * @type {odatajs.Header}
         * @memberOf EntitySet
         */
        readonly Headers: odatajs.Header;

        /**
         * Key of the entity
         * @memberOf EntitySet
         */
        readonly Key: string;

        /**
         * Gets all entries of an entity set. Use method chaining (call.Skip(10).Top(10).Get() before you call this method to create a query.
         * 
         * @returns {Promise<T[]>} 
         * 
         * @memberof EntitySet
         */
        Get(): Promise<T[]>
        /**
         * Gets one entry of the entity set by id.
         * 
         * @param {string} id 
         * @returns {Promise<T>} 
         * 
         * @memberof EntitySet
         */
        Get(id: string): Promise<T>;
        Get(id?: string): Promise<T | T[]> {
            return new Promise((resolve, reject) => {
                let requri: string;
                if (id) {
                    requri = this.Address + "(" + id + ")";
                } else {
                    requri = this.Address;
                }
                requri += this.resolveODataOptions();
                this.emptyQuery();
                let request: odatajs.Request = {
                    headers: this.Headers,
                    method: Method[Method.GET],
                    requestUri: requri
                }

                odatajs.oData.request(request, (data, response) => {
                    if (id) {
                        resolve(data);
                    } else {
                        resolve(data.value);
                    }
                }, (error) => {
                    // tslint:disable-next-line
                    console.error(error.name + " " + error.message + " | " + (error.response | error.response.statusText) + ":\n" + (error.response | error.response.body));
                    reject(error);
                });
            });
        }

        /**
         * Replaces an existing value in the entity collection.
         * 
         * @param {T} value to replace
         * @returns {Promise<T>} for async Operation. Use `await` keyword to get value or `.then` callback.
         * 
         * @memberOf EntitySet
         */
        Put(value: T): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                let request: odatajs.Request = {
                    headers: this.Headers,
                    method: Method[Method.PUT],
                    // @ts-ignore
                    requestUri: this.Address + "(" + value[this.Key] + ")",
                    data: value
                }
                odatajs.oData.request(request, (data, response) => {
                    resolve();
                }, (error) => {
                    // tslint:disable-next-line
                    console.error(error.name + " " + error.message + " | " + (error.response | error.response.statusText) + ":\n" + (error.response | error.response.body));
                    reject(error);
                });
            });
        }

        /**
         * Adds a new entry to an EntitySet
         * 
         * @param {T} value to ad to the EntitySet
         * @returns {Promise<T>} for async Operation. Use `await` keyword to get value or `.then` callback.
         * 
         * @memberOf EntitySet
         */
        Post(value: T): Promise<T> {
            return new Promise<T>((resolve, reject) => {
                let request: odatajs.Request = {
                    headers: this.Headers,
                    method: Method[Method.POST],
                    requestUri: this.Address,
                    data: value
                }
                odatajs.oData.request(request, (data, response) => {
                    resolve(data as T);
                }, (error) => {
                    // tslint:disable-next-line
                    console.error(error.name + " " + error.message + " | " + (error.response | error.response.statusText) + ":\n" + (error.response | error.response.body));
                    reject(error);
                });
            });
        }
        Patch(delta: Partial<T> | T): Promise<void>
        Patch(oldvalue: T, newValue: T): Promise<void>
        Patch(oldvalordelta: T | Partial<T>, newval?: T): Promise<void> {
            if (newval)
                oldvalordelta = this.getDelta(oldvalordelta as T, newval);

            return new Promise<void>((resolve, reject) => {
                let request: odatajs.Request = {
                    headers: this.Headers,
                    method: Method[Method.PATCH],
                    requestUri: this.Address,
                    data: oldvalordelta
                }
                odatajs.oData.request(request, (data, response) => {
                    resolve();
                }, (error) => {
                    // tslint:disable-next-line
                    console.error(error.name + " " + error.message + " | " + (error.response | error.response.statusText) + ":\n" + (error.response | error.response.body));
                    reject(error);
                });
            });
        }

        private getDelta(oldval: T, newVal: T): Partial<T> {
            let ret: any = {};
            for (let prop in newVal)
                if (oldval[prop] != newVal[prop])
                    ret[prop] = newVal[prop];
            return ret;
        }
        /**
         * Deletes a value from the entity set.
         * 
         * @param {T} value to delete
         * @returns {Promise<T>} for async Operation. Use `await` keyword to get value or `.then` callback.
         * 
         * @memberOf EntitySet
         */
        Delete(value: T): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                let request: odatajs.Request = {
                    headers: this.Headers,
                    method: Method[Method.DELETE],
                    // @ts-ignore
                    requestUri: this.Address + "(" + value[this.Key] + ")"
                }
                odatajs.oData.request(request, (data, response) => {
                    resolve();
                }, (error) => {
                    // tslint:disable-next-line
                    console.error(error.name + " " + error.message + " | " + (error.response | error.response.statusText) + ":\n" + (error.response | error.response.body));
                    reject(error);
                });
            });
        }

        Count(): Promise<number> {
            return new Promise<number>((resolve, reject) => {
                const requri = this.Address + "/$count/" + this.resolveODataOptions();
                let request: odatajs.Request = {
                    headers: this.Headers,
                    method: Method[Method.GET],
                    requestUri: requri
                }

                odatajs.oData.request(request, (data, response) => {
                    resolve(data);
                }, (error) => {
                    // tslint:disable-next-line
                    console.error(error.name + " " + error.message + " | " + (error.response | error.response.statusText) + ":\n" + (error.response | error.response.body));
                    reject(error);
                });
            });
        }
    }

    class EntityContainer {
        constructor(name: string, uri: string) {
            this.Name = name;
            this.Uri = uri;
        }
        readonly Name: string;
        readonly Uri: string;
    }
}

declare namespace odatajs {
    class oData {
        // @ts-ignore
        static request(request: Request, success?: (data: any, response: any) => void, error?: (error: any) => void, handler?, httpClient?, metadata?);
    }

    interface Request {
        requestUri: string,
        method: string,
        headers: Header | Header[],
        data?: any
    }

    interface Header { [name: string]: string }
}

type JSDate = Date;

export declare namespace Edm {
    export type Duration = string;
    export type Binary = string;
    export type Boolean = boolean;
    export type Byte = number;
    export type Date = JSDate;
    export type DateTimeOffset = JSDate;
    export type Decimal = number;
    export type Double = number;
    export type Guid = string;
    export type Int16 = number;
    export type Int32 = number;
    export type Int64 = number;
    export type SByte = number;
    export type Single = number;
    export type String = string;
    export type TimeOfDay = string;
    export type Stream = string;
    export type GeographyPoint = any;
}


// ###################################### Implementation ################


export namespace Bantikom {

    // Entity types
    export interface SideEffectTask {
        State: Bantikom.TaskState;
        SideServiceKind: Bantikom.SideServiceKind;
        OptionParameter1: Edm.String;
        OptionParameter2: Edm.String;
        ExtendedId: Edm.String;
        ResultType: Edm.String;
        Result: Edm.String;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface Case {
        ApplicationType: Edm.String;
        LogoPath: Edm.String;
        TermsAndConditionUrl: Edm.String;
        FullDescription: Edm.String;
        SchemeId: Edm.Guid;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;

    }
    export interface Lead {
        LegalEntityKind: Bantikom.LegalEntityKind;
        CustomerType: Bantikom.CustomerType;
        Status: Bantikom.LeadStatus;
        Demand: Edm.String;
        Description: Edm.String;
        KindOfActivity: Edm.String;
        Country: Edm.String;
        Region: Edm.String;
        City: Edm.String;
        AddressLine: Edm.String;
        AddressLine2: Edm.String;
        SiteUrl: Edm.String;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Contacts?: Bantikom.Contact[];
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface Customer {
        LegalEntityKind: Bantikom.LegalEntityKind;
        CustomerType: Bantikom.CustomerType;
        Demand: Edm.String;
        Description: Edm.String;
        KindOfActivity: Edm.String;
        SiteUrl: Edm.String;
        Country: Edm.String;
        Region: Edm.String;
        City: Edm.String;
        AddressLine: Edm.String;
        AddressLine2: Edm.String;
        LeadId: Edm.Guid;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Lead?: Bantikom.Lead;
        Contacts?: Bantikom.Contact[];
        Contracts?: Bantikom.Contract[];
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface Contact {
        FirstName: Edm.String;
        LastName: Edm.String;
        MiddleName: Edm.String;
        ContactRole: Bantikom.ContactRole;
        Email: Edm.String;
        Email2: Edm.String;
        PhoneNumber: Edm.String;
        PhoneNumber2: Edm.String;
        Description: Edm.String;
        LeadId: Edm.Guid;
        CustomerId: Edm.Guid;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Lead?: Bantikom.Lead;
        Customer?: Bantikom.Customer;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ContractType {
        Kind: Bantikom.ContractKind;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;

    }
    export interface Contract {
        ContractTypeId: Edm.Guid;
        CustomerId: Edm.Guid;
        SignedStage: Bantikom.SignedStage;
        SignedDate: Edm.DateTimeOffset;
        SignedComment: Edm.String;
        MarketPlaceId: Edm.Guid;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        ContractType?: Bantikom.ContractType;
        Customer?: Bantikom.Customer;
        MarketPlace?: Bantikom.MarketPlace;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface MarketPlace {
        NewProductRegistrationAvailable: Edm.Boolean;
        MarketPlaceKind: Bantikom.MarketplaceKind;
        Url: Edm.String;
        Conditions: Edm.String;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;

    }
    export interface InternalCategory {
        ParentId: Edm.Guid;
        ParentCode: Edm.String;
        Url: Edm.String;
        MarketPlaceKind: Bantikom.MarketplaceKind;
        NameEn: Edm.String;
        ExtCode: Edm.String;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Parent?: Bantikom.InternalCategory;
        Attributes?: Bantikom.CategoryAttribute[];
        App?: Bantikom.App;

    }
    export interface InternalCategoryMap {
        InternalId: Edm.Guid;
        ExternalId: Edm.Guid;
        MarketplaceKind: Bantikom.MarketplaceKind;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Internal?: Bantikom.InternalCategory;
        External?: Bantikom.InternalCategory;
        App?: Bantikom.App;

    }
    export interface CategoryAttribute {
        ExtCode: Edm.String;
        DescriptionEn: Edm.String;
        Kind: Edm.String;
        IsRequired: Edm.Boolean;
        IsCollection: Edm.Boolean;
        MarketPlaceKind: Bantikom.MarketplaceKind;
        DictionaryId: Edm.String;
        Raw: Edm.String;
        Regex: Edm.String;
        NameEn: Edm.String;
        NamePl: Edm.String;
        NameCz: Edm.String;
        NameSk: Edm.String;
        NameHy: Edm.String;
        OptionsId: Edm.Guid;
        ControlType: Edm.String;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Categories?: Bantikom.InternalCategory[];
        Options?: Bantikom.CategoryAttributeOptions;
        App?: Bantikom.App;

    }
    export interface CategoryAttributeOptions {
        CopyValueToProduct: Edm.Boolean;
        FieldName: Edm.String;
        ControlType: Edm.String;
        HideInAttibutesForm: Edm.Boolean;
        Options: Edm.String;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;

    }
    export interface UserCategory {
        ParentId: Edm.Guid;
        Url: Edm.String;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Parent?: Bantikom.UserCategory;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface UserCategoryMap {
        InternalId: Edm.Guid;
        InternalKind: Bantikom.MarketplaceKind;
        ExternalId: Edm.Guid;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Internal?: Bantikom.InternalCategory;
        External?: Bantikom.UserCategory;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface Brand {
        CountryCode: Edm.String;
        Description: Edm.String;
        Site: Edm.String;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface Product {
        OverrideName: Edm.Boolean;
        OverrideOrder: Edm.Boolean;
        MarketPlaceKind: Bantikom.MarketplaceKind;
        UniqueNumber: Edm.Int64;
        FormattedUniqueNumber: Edm.String;
        ExtId: Edm.String;
        OverrideExtId: Edm.Boolean;
        ExtId2: Edm.String;
        OverrideExtId2: Edm.Boolean;
        ExtId3: Edm.String;
        OverrideExtId3: Edm.Boolean;
        VendorCode: Edm.String;
        ExtVendorCode: Edm.String;
        CreationStatus: Bantikom.ProductCreationStatus;
        ProductState: Bantikom.ProductState;
        SaleState: Bantikom.SaleState;
        ModerationState: Bantikom.ModerationState;
        Description: Edm.String;
        OverrideDescription: Edm.Boolean;
        BarCode: Edm.String;
        OverrideBarCode: Edm.Boolean;
        Weight: Edm.Decimal;
        OverrideWeight: Edm.Boolean;
        Long: Edm.Decimal;
        OverrideLong: Edm.Boolean;
        Width: Edm.Decimal;
        OverrideWidth: Edm.Boolean;
        Height: Edm.Decimal;
        OverrideHeight: Edm.Boolean;
        Attributes: Edm.String;
        HeadProductId: Edm.Guid;
        BrandId: Edm.Guid;
        OverrideBrandId: Edm.Boolean;
        CategoryId: Edm.Guid;
        OverrideCategoryId: Edm.Boolean;
        ConnectedMarketplaceId: Edm.Guid;
        VatId: Edm.Guid;
        Version: Edm.String;
        ShortName: Edm.String;
        MarketplaceUrl: Edm.String;
        SubHeader: Edm.String;
        BundleIdentifier: Edm.String;
        IsVariation: Edm.Boolean;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        HeadProduct?: Bantikom.Product;
        Brand?: Bantikom.Brand;
        Category?: Bantikom.InternalCategory;
        ConnectedMarketplace?: Bantikom.ConnectedMarketplace;
        Vat?: Bantikom.CatalogTax;
        Products?: Bantikom.Product[];
        UserNotifications?: Bantikom.UserNotification[];
        Prices?: Bantikom.ProductPrice[];
        Photos?: Bantikom.ProductPhoto[];
        Groups?: Bantikom.ProductGroup[];
        Operations?: Bantikom.ProductOperation[];
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ProductGroup {
        CountItems: Edm.Int32;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Products?: Bantikom.Product[];
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ProductOperation {
        Kind: Bantikom.ProductOperationKind;
        Status: Bantikom.Status;
        InitiatorId: Edm.String;
        Options: Edm.String;
        ProductId: Edm.Guid;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Initiator?: Bantikom.ApplicationUser;
        Product?: Bantikom.Product;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface WatchingProduct {
        MarketPlaceKind: Bantikom.MarketplaceKind;
        ExtendedId: Edm.String;
        Url: Edm.String;
        Title: Edm.String;
        State: Bantikom.WatchingProductState;
        SyncState: Bantikom.SyncState;
        Price: Edm.Double;
        Sale: Edm.Double;
        SalePrice: Edm.Double;
        CurrentStock: Edm.Int32;
        CostOfStock: Edm.Double;
        OrdersCount: Edm.Double;
        Stars: Edm.Double;
        ReviewCount: Edm.Double;
        FirstReviewTimeStamp: Edm.DateTimeOffset;
        Color: Edm.String;
        HighImage: Edm.String;
        LowImage: Edm.String;
        LastSyncTimeStamp: Edm.DateTimeOffset;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;

    }
    export interface WatchingProductWildberries extends Bantikom.WatchingProduct {
        QualityRate: Edm.Int32;
        IsSoldOut: Edm.Boolean;

    }
    export interface WatchingProductLink {
        MarketPlaceKind: Bantikom.MarketplaceKind;
        WatchingProductId: Edm.Guid;
        ProductMarketplaceId: Edm.Guid;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        WatchingProduct?: Bantikom.WatchingProduct;
        ProductMarketplace?: Bantikom.Product;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ProductPhoto {
        Heigth: Edm.Int32;
        Width: Edm.Int32;
        MarketplaceKind: Bantikom.MarketplaceKind;
        ThumbnailUri: Edm.String;
        ThumbnailPath: Edm.String;
        OriginalId: Edm.String;
        OriginalUri: Edm.String;
        ProductId: Edm.Guid;
        IsHead: Edm.Boolean;
        Kind: Bantikom.AttachmentKind;
        RelativeUri: Edm.String;
        Path: Edm.String;
        FileName: Edm.String;
        Extension: Edm.String;
        Size: Edm.Int64;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Product?: Bantikom.Product;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ConnectedMarketplace {
        Code: Edm.String;
        MarketplaceKind: Bantikom.MarketplaceKind;
        MarketplaceId: Edm.Guid;
        ApiKey: Edm.String;
        ClientKey: Edm.String;
        Login: Edm.String;
        Password: Edm.String;
        Active: Edm.Boolean;
        LoginState: Bantikom.ConnectedState;
        ApiState: Bantikom.ConnectedState;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Marketplace?: Bantikom.MarketPlace;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface UserOrder {
        UniqueNumber: Edm.Int64;
        FormattedUniqueNumber: Edm.String;
        OrderType: Bantikom.OrderType;
        OrderState: Bantikom.OrderState;
        UserComment: Edm.String;
        Options: Edm.String;
        IsClosed: Edm.Boolean;
        ClosedReason: Edm.String;
        ClosedById: Edm.String;
        IsError: Edm.Boolean;
        ErrorReason: Edm.String;
        ServiceTypeId: Edm.Guid;
        NumberAllTasks: Edm.Int32;
        NumberNotStartedTasks: Edm.Int32;
        NumberInProgressTasks: Edm.Int32;
        NumberStoppedTasks: Edm.Int32;
        NumberCanceledTasks: Edm.Int32;
        NumberDoneTasks: Edm.Int32;
        TimeStart: Edm.DateTimeOffset;
        TimeFinish: Edm.DateTimeOffset;
        ActualTime: Edm.Int32;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        ClosedBy?: Bantikom.ApplicationUser;
        ServiceType?: Bantikom.ServiceType;
        UserOrderTasks?: Bantikom.UserOrderTask[];
        UserNotifications?: Bantikom.UserNotification[];
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ServiceType {
        ParentId: Edm.Guid;
        ParentCode: Edm.String;
        OrderType: Bantikom.OrderType;
        Paid: Edm.Boolean;
        ExtCode: Edm.Int32;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Parent?: Bantikom.ServiceType;
        ServiceTypeTasks?: Bantikom.ServiceTypeTask[];
        App?: Bantikom.App;

    }
    export interface ServiceTypeTask {
        TaskType: Bantikom.UserOrderTaskType;
        WhoPerforms: Bantikom.WhoPerforms;
        ServiceTypeId: Edm.Guid;
        ServiceTypeCode: Edm.String;
        IsRequired: Edm.Boolean;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        ServiceType?: Bantikom.ServiceType;
        App?: Bantikom.App;

    }
    export interface UserOrderTask {
        TaskState: Bantikom.UserOrderTaskState;
        TaskType: Bantikom.UserOrderTaskType;
        WhoPerforms: Bantikom.WhoPerforms;
        AssignedTo: Edm.String;
        UserOrderId: Edm.Guid;
        TaskKind: Edm.String;
        Options: Edm.String;
        IsError: Edm.Boolean;
        ErrorReason: Edm.String;
        ErrorStackTrace: Edm.String;
        IsCanceled: Edm.Boolean;
        CancelReason: Edm.String;
        CancelById: Edm.String;
        TimeStart: Edm.DateTimeOffset;
        TimeFinish: Edm.DateTimeOffset;
        EstimatedTime: Edm.Int32;
        ActualTime: Edm.Int32;
        Message: Edm.String;
        RelatedEntityName: Edm.String;
        RelatedEntityId: Edm.String;
        RelatedEntityUrl: Edm.String;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        UserOrder?: Bantikom.UserOrder;
        CancelBy?: Bantikom.ApplicationUser;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface UserNotification {
        Kind: Bantikom.NotificationKind;
        Description: Edm.String;
        HasRead: Edm.Boolean;
        Section: Edm.String;
        HelpUrl: Edm.String;
        ProductId: Edm.Guid;
        UserOrderId: Edm.Guid;
        NotifyAdmin: Edm.Boolean;
        StackTrace: Edm.String;
        Options: Edm.String;
        RequestId: Edm.String;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Product?: Bantikom.Product;
        UserOrder?: Bantikom.UserOrder;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface AbTest {
        RunType: Bantikom.TestRunType;
        Subject: Bantikom.TestSubject;
        ProductId: Edm.Guid;
        State: Bantikom.CampaignState;
        Description: Edm.String;
        StartTime: Edm.DateTimeOffset;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Variations?: Bantikom.AbTestVariation[];
        Product?: Bantikom.Product;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface AbTestVariation {
        Subject: Bantikom.TestSubject;
        SubjectValue: Edm.String;
        Kind: Bantikom.VariationKind;
        Color: Edm.String;
        AbTestId: Edm.Guid;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        AbTest?: Bantikom.AbTest;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface Buyout {
        AvailableBudget: Edm.Double;
        ProductId: Edm.Guid;
        State: Bantikom.CampaignState;
        Description: Edm.String;
        StartTime: Edm.DateTimeOffset;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Product?: Bantikom.Product;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ProductPrice {
        ProductId: Edm.Guid;
        CurrencyId: Edm.Guid;
        PriceKindId: Edm.Guid;
        HeadPriceId: Edm.Guid;
        Active: Edm.Boolean;
        ActiveSince: Edm.DateTimeOffset;
        ActiveBy: Edm.DateTimeOffset;
        Margin: Edm.Decimal;
        MarginPercent: Edm.Decimal;
        Discount: Edm.Decimal;
        DiscountPercent: Edm.Decimal;
        Price: Edm.Decimal;
        Comment: Edm.String;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Product?: Bantikom.Product;
        Currency?: Bantikom.Currency;
        PriceKind?: Bantikom.PriceKind;
        HeadPrice?: Bantikom.ProductPrice;
        PriceHistory?: Bantikom.ProductPriceValue[];
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ProductPriceValue {
        ProductPriceId: Edm.Guid;
        Value: Edm.Decimal;
        PreviousValue: Edm.Decimal;
        Comment: Edm.String;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        ProductPrice?: Bantikom.ProductPrice;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface PriceKind {
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;

    }
    export interface Currency {
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;

    }
    export interface PlaformServiceType {
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;

    }
    export interface PlatformServiceOptions {
        IncludeDays: Edm.Int32;
        Enabled: Edm.Boolean;
        PlatformServiceTypeId: Edm.Guid;
        Options: Edm.String;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        PlatformServiceType?: Bantikom.PlaformServiceType;
        App?: Bantikom.App;

    }
    export interface UserPlatformServiceSubscription {
        Enabled: Edm.Boolean;
        UniqueNumber: Edm.Int64;
        FormattedUniqueNumber: Edm.String;
        PlatformServiceOptionsId: Edm.Guid;
        TimeStart: Edm.DateTimeOffset;
        TimeFinish: Edm.DateTimeOffset;
        Options: Edm.String;
        NotifyAboutRelease: Edm.Boolean;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        PlatformServiceOptions?: Bantikom.PlatformServiceOptions;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ObservationOfProduct {
        NumberOfItems: Edm.Int32;
        RefreshRateType: Bantikom.RefreshRateType;
        RefreshRateValue: Edm.Int32;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Products?: Bantikom.ObservationProduct[];
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface SeoTopObservation extends Bantikom.ObservationOfProduct {
        MarketplaceKind: Bantikom.MarketplaceKind;
        SearchMethod: Bantikom.SearchMethod;

    }
    export interface ObservationProduct {
        ProductId: Edm.Guid;
        Uri: Edm.String;
        VendorCode: Edm.String;
        ExtId: Edm.String;
        CategoryName: Edm.String;
        PhotoUri: Edm.String;
        ObservationId: Edm.Guid;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        Product?: Bantikom.Product;
        Observation?: Bantikom.ObservationOfProduct;
        Keywords?: Bantikom.ObservationProductKeyword[];
        Categories?: Bantikom.ObservationProductCategory[];
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ObservationProductKeyword {
        Enabled: Edm.Boolean;
        Synonyms: Edm.String;
        ObservationProductId: Edm.Guid;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        ObservationProduct?: Bantikom.ObservationProduct;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface ObservationProductCategory {
        ExtCategoryId: Edm.String;
        Uri: Edm.String;
        FullName: Edm.String;
        ObservationProductId: Edm.Guid;
        AppId: Edm.Guid;
        CreatedId: Edm.String;
        ModifiedId: Edm.String;
        OwnerId: Edm.String;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        ObservationProduct?: Bantikom.ObservationProduct;
        App?: Bantikom.App;
        Owner?: Bantikom.ApplicationUser;

    }
    export interface AddingWatchingProduct {
        MarketPlaceKind: Bantikom.MarketplaceKind;
        Url: Edm.String;
        Name: Edm.String;
        Price: Edm.Double;
        BrandName: Edm.String;
        HighImage: Edm.String;
        LowImage: Edm.String;
        Id: Edm.String;

    }
    export interface SearchMarketplaceProduct {
        MarketplaceKind: Bantikom.MarketplaceKind;
        SearchCode: Edm.String;
        Id: Edm.String;

    }
    export interface AttributeDictionaryValue {
        MarketplaceKind: Bantikom.MarketplaceKind;
        CategoryId: Edm.String;
        AttributeId: Edm.String;
        DictionaryId: Edm.String;
        Name: Edm.String;
        Logo: Edm.String;
        Description: Edm.String;
        LastModificationDate: Edm.DateTimeOffset;
        Id: Edm.String;

    }
    export interface SearchImportedProduct {
        Id: Edm.String;
        ConnectedMarketplaceId: Edm.Guid;
        ExternalVendorCode: Edm.String;
        InternalVendorCode: Edm.String;
        Name: Edm.String;
        IncludeInImport: Edm.Boolean;
        Language: Edm.Boolean;
        Images: Edm.String[];

    }
    export interface ChangeEntityReferenceListRequest {
        NavigationProperty: Edm.String;
        Added: Edm.Boolean;
        Id: Edm.String;
        RelatedEntities?: Bantikom.Entity[];

    }
    export interface ImportProductRequest {
        Language: Edm.String;
        ImportAllItems: Edm.Boolean;
        ImportIncludedItems: Bantikom.ProductIdentifier[];
        SelectedMarketplaces: Bantikom.SelectedMarketplace[];
        NotifyMeByEmail: Edm.Boolean;
        Email: Edm.String;
        ExistProductAction: Bantikom.ExistProductAction;
        ConnectedMarketplaceId: Edm.Guid;
        UserOrderTaskId: Edm.Guid;
        UserOrderId: Edm.Guid;
        UserOwnerId: Edm.String;
        ProductGroupId: Edm.Guid;
        AddToGroup: Edm.Boolean;
        AddPrices: Edm.Boolean;
        AddImages: Edm.Boolean;
        Id: Edm.String;

    }
    export interface ExportProductRequest {
        NotifyMeByEmail: Edm.Boolean;
        Email: Edm.String;
        Id: Edm.String;
        Products?: Bantikom.ExportProduct[];

    }
    export interface CreateMarketplaceProductRequest {
        MarketplaceKind: Bantikom.MarketplaceKind;
        ConnectedMarketplaceId: Edm.Guid;
        Id: Edm.String;

    }
    export interface CreateMarketplaceProductsRequest {
        SelectedMarketplaces: Bantikom.SelectedMarketplace[];
        Id: Edm.String;

    }
    export interface ImportProductMarketplaceRequest {
        Data: Edm.String;
        MarketplaceKind: Bantikom.MarketplaceKind;
        Id: Edm.String;

    }
    export interface ObservationProductsChangeEntityReferenceListRequest {
        NavigationProperty: Edm.String;
        Added: Edm.Boolean;
        All: Edm.Boolean;
        Query: Edm.String;
        SearchKind: Bantikom.SearchKind;
        Id: Edm.String;
        RelatedEntities?: Bantikom.ObservationProductEntity[];

    }
    export interface PlatformServiceSubscribeResponse {
        SubscriptionName: Edm.String;
        SubscriptionId: Edm.Guid;
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface App {
        AppId: Edm.Guid;
        Enabled: Edm.Boolean;
        AppSecKey: Edm.String;
        VisibleChild: Edm.Boolean;
        Name: Edm.String;
        Domain: Edm.String;
        ParentId: Edm.Guid;
        Parent?: Bantikom.App;
        Childs?: Bantikom.App[];

    }
    export interface ApplicationUser {
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        LastLoginTime: Edm.DateTimeOffset;
        UserFullName: Edm.String;
        DefaultBotLanguage: Edm.String;
        EnableAutosave: Edm.Boolean;
        AutosaveInterval: Edm.Int32;
        RestrictionCountBot: Edm.Int32;
        Country: Edm.String;
        CountryName: Edm.String;
        Information: Edm.String;
        IpAddress: Edm.String;
        TimeZone: Edm.String;
        City: Edm.String;
        UserAgent: Edm.String;
        Environment: Edm.String;
        IsMobileBrowser: Edm.Boolean;
        Referrer: Edm.String;
        GridExportAllPages: Edm.Boolean;
        Email: Edm.String;
        EmailConfirmed: Edm.Boolean;
        PasswordHash: Edm.String;
        SecurityStamp: Edm.String;
        PhoneNumber: Edm.String;
        PhoneNumberConfirmed: Edm.Boolean;
        TwoFactorEnabled: Edm.Boolean;
        LockoutEndDateUtc: Edm.DateTimeOffset;
        LockoutEnabled: Edm.Boolean;
        AccessFailedCount: Edm.Int32;
        Roles: Bantikom.IdentityUserRole[];
        Logins: Bantikom.IdentityUserLogin[];
        Id: Edm.String;
        UserName: Edm.String;
        Claims?: Bantikom.IdentityUserClaim[];

    }
    export interface IdentityUserClaim {
        Id: Edm.Int32;
        UserId: Edm.String;
        ClaimType: Edm.String;
        ClaimValue: Edm.String;

    }
    export interface CatalogTax {
        CountryCode: Edm.String;
        Value: Edm.Decimal;
        IsSystem: Edm.Boolean;
        Code: Edm.String;
        Description: Edm.String;
        HelpUrl: Edm.String;
        AppId: Edm.Guid;
        Id: Edm.Guid;
        Name: Edm.String;
        LocalizableId: Edm.String;
        Order: Edm.Int32;
        CreationDate: Edm.DateTimeOffset;
        LastModificationDate: Edm.DateTimeOffset;
        RowVersion: Edm.Binary;
        Published: Edm.Boolean;
        App?: Bantikom.App;

    }
    export interface Entity {
        EntityId: Edm.Guid;
        EntityName: Edm.String;

    }
    export interface ExportProduct {
        Name: Edm.String;
        Id: Edm.Guid;
        ConnectedMarketplaceId: Edm.Guid;

    }
    export interface ObservationProductEntity {
        Id: Edm.String;
        EntityName: Edm.String;

    }

    // Complex types
    export interface ProductLinksResult {
        Links: Bantikom.ProductLink[];
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface SetConnectedMarketplaceResponse {
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface CreateMarketplaceProductResponse {
        ProductId: Edm.Guid;
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface CreateMarketplaceProductsResponse {
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface ImportProductMarketplaceResponse {
        HasAffect: Edm.Boolean;
        ProductId: Edm.Guid;
        Name: Edm.String;
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface FoundMarketplaceProductResult {
        MarketplaceKind: Bantikom.MarketplaceKind;
        SearchCode: Edm.String;
        VendorCode: Edm.String;
        Name: Edm.String;
        Url: Edm.String;
        HighImage: Edm.String[];
        LowImage: Edm.String[];
        Color: Edm.String;
        Price: Edm.Double;
        BrandName: Edm.String;
        IsSoldOut: Edm.Boolean;

    }
    export interface ImportProductResponse {
        Name: Edm.String;
        UserOrderId: Edm.Guid;
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface ExportProductResponse {
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface ChangeEntityReferenceListResponse {
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface GetLastUsedMarketplacesResponse {
        Marketplaces: Bantikom.SelectedMarketplace[];
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface PlatformServiceSubscribeRequest {
        ServiceCode: Edm.String;
        Options: Edm.String;
        NotifyAboutRelease: Edm.Boolean;
        Id: Edm.String;

    }
    export interface ObservationProductsChangeEntityReferenceListResponse {
        Id: Edm.String;
        Success: Edm.Boolean;
        Code: Edm.Int32;
        Message: Edm.String;
        ErrorMessage: Edm.String;

    }
    export interface IdentityUserRole {
        UserId: Edm.String;
        RoleId: Edm.String;

    }
    export interface IdentityUserLogin {
        LoginProvider: Edm.String;
        ProviderKey: Edm.String;
        UserId: Edm.String;

    }
    export interface ProductIdentifier {
        ProductId: Edm.String;
        ExternalVendorCode: Edm.String;
        InternalVendorCode: Edm.String;

    }
    export interface SelectedMarketplace {
        MarketplaceKind: Bantikom.MarketplaceKind;
        ConnectedMarketplaceId: Edm.Guid;
        ConnectedMarketplaceName: Edm.String;

    }
    export interface ProductLink {
        CreationStatus: Bantikom.ProductCreationStatus;
        ProductState: Bantikom.ProductState;
        SaleState: Bantikom.SaleState;
        ModerationState: Bantikom.ModerationState;
        Kind: Bantikom.MarketplaceKind;
        Marketplace: Edm.String;
        ProductId: Edm.Guid;
        Name: Edm.String;
        ConnectedMarkeplaceId: Edm.Guid;
        ConnectedMarketplaceShortName: Edm.String;
        ConnectedMarketplaceName: Edm.String;

    }

    // Enum Types
    // Enum Values: Nothing = 0, Internal = 10, Ozon = 20, Beru = 30, Wildberries = 40, WildberriesFBS = 41, Goods = 50, Lamoda = 60
    export type MarketplaceKind = "Nothing" | "Internal" | "Ozon" | "Beru" | "Wildberries" | "WildberriesFBS" | "Goods" | "Lamoda";
    // Enum Values: Nothing = 0, New = 5, InProgress = 10, Done = 15
    export type TaskState = "Nothing" | "New" | "InProgress" | "Done";
    // Enum Values: MessageQueue = 5, Hangfire = 10
    export type SideServiceKind = "MessageQueue" | "Hangfire";
    // Enum Values: Nothing = 0, IP = 1, Company = 2, SelfEmployed = 3
    export type LegalEntityKind = "Nothing" | "IP" | "Company" | "SelfEmployed";
    // Enum Values: Nothing = 0, Manufacturer = 1, Distributor = 2, Other = 3
    export type CustomerType = "Nothing" | "Manufacturer" | "Distributor" | "Other";
    // Enum Values: New = 0, InProcessing = 1, Delayed = 2, Won = 3, Lost = 10
    export type LeadStatus = "New" | "InProcessing" | "Delayed" | "Won" | "Lost";
    // Enum Values: Nothing = 0, Manager = 1, Owner = 2
    export type ContactRole = "Nothing" | "Manager" | "Owner";
    // Enum Values: Nothing = 0, FullFilment = 1, Self = 2
    export type ContractKind = "Nothing" | "FullFilment" | "Self";
    // Enum Values: Nothing = 0, New = 1, InProcessing = 2, Signed = 3, Expired = 4, Lost = 10
    export type SignedStage = "Nothing" | "New" | "InProcessing" | "Signed" | "Expired" | "Lost";
    // Enum Values: CommonOptions = 0, Siting = 5, FeatureOptions = 10, Media = 15, PreDone = 95, Done = 100
    export type ProductCreationStatus = "CommonOptions" | "Siting" | "FeatureOptions" | "Media" | "PreDone" | "Done";
    // Enum Values: Nothing = 0, Editable = 5, Published = 10, UnPublished = 15, Archived = 20
    export type ProductState = "Nothing" | "Editable" | "Published" | "UnPublished" | "Archived";
    // Enum Values: Nothing = 0, PreSale = 5, OnSale = 10, Discontinued = 15
    export type SaleState = "Nothing" | "PreSale" | "OnSale" | "Discontinued";
    // Enum Values: Nothing = 0, Moderated = 5, ModerationAccepted = 10, ModerationRejected = 15, NeedToUpdate = 20
    export type ModerationState = "Nothing" | "Moderated" | "ModerationAccepted" | "ModerationRejected" | "NeedToUpdate";
    // Enum Values: Nothing = 0, Connected = 10, Disconnected = 20, Error = 30
    export type ConnectedState = "Nothing" | "Connected" | "Disconnected" | "Error";
    // Enum Values: Nothing = 0, Information = 1, Warning = 2, Error = 3
    export type NotificationKind = "Nothing" | "Information" | "Warning" | "Error";
    // Enum Values: Nothing = 0, Automation = 10, Hand = 20, Mixed = 30
    export type OrderType = "Nothing" | "Automation" | "Hand" | "Mixed";
    // Enum Values: Nothing = 0, New = 5, InProgress = 10, RequiresAction = 20, Canceled = 30, Done = 50
    export type OrderState = "Nothing" | "New" | "InProgress" | "RequiresAction" | "Canceled" | "Done";
    // Enum Values: Nothing = 0, Automation = 10, Hand = 20
    export type UserOrderTaskType = "Nothing" | "Automation" | "Hand";
    // Enum Values: Nothing = 0, MessageQueueProcessor = 10, Employee = 20, User = 30
    export type WhoPerforms = "Nothing" | "MessageQueueProcessor" | "Employee" | "User";
    // Enum Values: New = 5, InProgress = 10, Stopped = 20, Canceled = 30, Done = 50
    export type UserOrderTaskState = "New" | "InProgress" | "Stopped" | "Canceled" | "Done";
    // Enum Values: Nothing = 0, ProductPhoto = 1
    export type AttachmentKind = "Nothing" | "ProductPhoto";
    // Enum Values: Nothing = 0, Create = 1, Edit = 10, Remove = 20, Import = 50, Export = 60
    export type ProductOperationKind = "Nothing" | "Create" | "Edit" | "Remove" | "Import" | "Export";
    // Enum Values: Nothing = 0, Successful = 10, Unsuccessful = 20
    export type Status = "Nothing" | "Successful" | "Unsuccessful";
    // Enum Values: Nothing = 0, NeedFirstDownload = 5, OnUpdates = 10, DisablingUpdates = 15
    export type WatchingProductState = "Nothing" | "NeedFirstDownload" | "OnUpdates" | "DisablingUpdates";
    // Enum Values: Nothing = 0, InProcessUpdate = 5
    export type SyncState = "Nothing" | "InProcessUpdate";
    // Enum Values: Nothing = 0, Adv = 10, Online = 20
    export type TestRunType = "Nothing" | "Adv" | "Online";
    // Enum Values: Nothing = 0, Title = 10, Description = 20, Option = 30, Photo = 40, Price = 50, Complex = 1000
    export type TestSubject = "Nothing" | "Title" | "Description" | "Option" | "Photo" | "Price" | "Complex";
    // Enum Values: Nothing = 0, Control = 5, Test = 10
    export type VariationKind = "Nothing" | "Control" | "Test";
    // Enum Values: Designed = 0, Runniing = 10, Paused = 20, Finished = 30
    export type CampaignState = "Designed" | "Runniing" | "Paused" | "Finished";
    // Enum Values: Nothing = 0, Category = 10, Keyword = 20
    export type SearchMethod = "Nothing" | "Category" | "Keyword";
    // Enum Values: Nothing = 0, Minute = 1, Hourly = 5, Day = 10, Week = 15, Month = 20
    export type RefreshRateType = "Nothing" | "Minute" | "Hourly" | "Day" | "Week" | "Month";
    // Enum Values: ReplaceExistProduct = 10, AddNewWithSameIdentifier = 20, AddNewWithNewIdentifier = 21, IgnoreImportedProduct = 30
    export type ExistProductAction = "ReplaceExistProduct" | "AddNewWithSameIdentifier" | "AddNewWithNewIdentifier" | "IgnoreImportedProduct";
    // Enum Values: ProductCatalog = 10, ProductGroup = 20, MarketplaceApi = 30, MarketplaceSearch = 40
    export type SearchKind = "ProductCatalog" | "ProductGroup" | "MarketplaceApi" | "MarketplaceSearch";

    // Entity container
    export class Container extends odatatools.ProxyBase {
        constructor(address: string, name?: string, additionalHeaders?: odatajs.Header) {
            super(address, name, additionalHeaders);
            this.SideEffectTask = new SideEffectTaskEntitySet("SideEffectTask", address, "State", additionalHeaders);
            this.Case = new CaseEntitySet("Case", address, "ApplicationType", additionalHeaders);
            this.Lead = new LeadEntitySet("Lead", address, "LegalEntityKind", additionalHeaders);
            this.Customer = new CustomerEntitySet("Customer", address, "LegalEntityKind", additionalHeaders);
            this.Contact = new ContactEntitySet("Contact", address, "FirstName", additionalHeaders);
            this.ContractType = new ContractTypeEntitySet("ContractType", address, "Kind", additionalHeaders);
            this.Contract = new ContractEntitySet("Contract", address, "ContractTypeId", additionalHeaders);
            this.MarketPlace = new MarketPlaceEntitySet("MarketPlace", address, "NewProductRegistrationAvailable", additionalHeaders);
            this.InternalCategory = new InternalCategoryEntitySet("InternalCategory", address, "ParentId", additionalHeaders);
            this.InternalCategoryMap = new InternalCategoryMapEntitySet("InternalCategoryMap", address, "InternalId", additionalHeaders);
            this.CategoryAttribute = new CategoryAttributeEntitySet("CategoryAttribute", address, "ExtCode", additionalHeaders);
            this.CategoryAttributeOptions = new CategoryAttributeOptionsEntitySet("CategoryAttributeOptions", address, "CopyValueToProduct", additionalHeaders);
            this.UserCategory = new UserCategoryEntitySet("UserCategory", address, "ParentId", additionalHeaders);
            this.UserCategoryMap = new UserCategoryMapEntitySet("UserCategoryMap", address, "InternalId", additionalHeaders);
            this.Brand = new BrandEntitySet("Brand", address, "CountryCode", additionalHeaders);
            this.Product = new ProductEntitySet("Product", address, "OverrideName", additionalHeaders);
            this.ProductGroup = new ProductGroupEntitySet("ProductGroup", address, "CountItems", additionalHeaders);
            this.ProductOperation = new ProductOperationEntitySet("ProductOperation", address, "Kind", additionalHeaders);
            this.WatchingProduct = new WatchingProductEntitySet("WatchingProduct", address, "MarketPlaceKind", additionalHeaders);
            this.WatchingProductWildberries = new WatchingProductWildberriesEntitySet("WatchingProductWildberries", address, "", additionalHeaders);
            this.WatchingProductLink = new WatchingProductLinkEntitySet("WatchingProductLink", address, "MarketPlaceKind", additionalHeaders);
            this.ProductPhoto = new ProductPhotoEntitySet("ProductPhoto", address, "Heigth", additionalHeaders);
            this.ConnectedMarketplace = new ConnectedMarketplaceEntitySet("ConnectedMarketplace", address, "Code", additionalHeaders);
            this.UserOrder = new UserOrderEntitySet("UserOrder", address, "UniqueNumber", additionalHeaders);
            this.ServiceType = new ServiceTypeEntitySet("ServiceType", address, "ParentId", additionalHeaders);
            this.ServiceTypeTask = new ServiceTypeTaskEntitySet("ServiceTypeTask", address, "TaskType", additionalHeaders);
            this.UserOrderTask = new UserOrderTaskEntitySet("UserOrderTask", address, "TaskState", additionalHeaders);
            this.UserNotification = new UserNotificationEntitySet("UserNotification", address, "Kind", additionalHeaders);
            this.AbTest = new AbTestEntitySet("AbTest", address, "RunType", additionalHeaders);
            this.AbTestVariation = new AbTestVariationEntitySet("AbTestVariation", address, "Subject", additionalHeaders);
            this.Buyout = new BuyoutEntitySet("Buyout", address, "AvailableBudget", additionalHeaders);
            this.ProductPrice = new ProductPriceEntitySet("ProductPrice", address, "ProductId", additionalHeaders);
            this.ProductPriceValue = new ProductPriceValueEntitySet("ProductPriceValue", address, "ProductPriceId", additionalHeaders);
            this.PriceKind = new PriceKindEntitySet("PriceKind", address, "IsSystem", additionalHeaders);
            this.Currency = new CurrencyEntitySet("Currency", address, "IsSystem", additionalHeaders);
            this.PlaformServiceType = new PlaformServiceTypeEntitySet("PlaformServiceType", address, "IsSystem", additionalHeaders);
            this.PlatformServiceOptions = new PlatformServiceOptionsEntitySet("PlatformServiceOptions", address, "IncludeDays", additionalHeaders);
            this.UserPlatformServiceSubscription = new UserPlatformServiceSubscriptionEntitySet("UserPlatformServiceSubscription", address, "Enabled", additionalHeaders);
            this.SeoTopObservation = new SeoTopObservationEntitySet("SeoTopObservation", address, "", additionalHeaders);
            this.ObservationProduct = new ObservationProductEntitySet("ObservationProduct", address, "ProductId", additionalHeaders);
            this.ObservationProductKeyword = new ObservationProductKeywordEntitySet("ObservationProductKeyword", address, "Enabled", additionalHeaders);
            this.ObservationProductCategory = new ObservationProductCategoryEntitySet("ObservationProductCategory", address, "ExtCategoryId", additionalHeaders);
            this.AddingWatchingProduct = new AddingWatchingProductEntitySet("AddingWatchingProduct", address, "MarketPlaceKind", additionalHeaders);
            this.SearchMarketplaceProduct = new SearchMarketplaceProductEntitySet("SearchMarketplaceProduct", address, "MarketplaceKind", additionalHeaders);
            this.AttributeDictionaryValue = new AttributeDictionaryValueEntitySet("AttributeDictionaryValue", address, "MarketplaceKind", additionalHeaders);
            this.SearchImportedProduct = new SearchImportedProductEntitySet("SearchImportedProduct", address, "Id", additionalHeaders);
        }
        SideEffectTask: SideEffectTaskEntitySet;
        Case: CaseEntitySet;
        Lead: LeadEntitySet;
        Customer: CustomerEntitySet;
        Contact: ContactEntitySet;
        ContractType: ContractTypeEntitySet;
        Contract: ContractEntitySet;
        MarketPlace: MarketPlaceEntitySet;
        InternalCategory: InternalCategoryEntitySet;
        InternalCategoryMap: InternalCategoryMapEntitySet;
        CategoryAttribute: CategoryAttributeEntitySet;
        CategoryAttributeOptions: CategoryAttributeOptionsEntitySet;
        UserCategory: UserCategoryEntitySet;
        UserCategoryMap: UserCategoryMapEntitySet;
        Brand: BrandEntitySet;
        Product: ProductEntitySet;
        ProductGroup: ProductGroupEntitySet;
        ProductOperation: ProductOperationEntitySet;
        WatchingProduct: WatchingProductEntitySet;
        WatchingProductWildberries: WatchingProductWildberriesEntitySet;
        WatchingProductLink: WatchingProductLinkEntitySet;
        ProductPhoto: ProductPhotoEntitySet;
        ConnectedMarketplace: ConnectedMarketplaceEntitySet;
        UserOrder: UserOrderEntitySet;
        ServiceType: ServiceTypeEntitySet;
        ServiceTypeTask: ServiceTypeTaskEntitySet;
        UserOrderTask: UserOrderTaskEntitySet;
        UserNotification: UserNotificationEntitySet;
        AbTest: AbTestEntitySet;
        AbTestVariation: AbTestVariationEntitySet;
        Buyout: BuyoutEntitySet;
        ProductPrice: ProductPriceEntitySet;
        ProductPriceValue: ProductPriceValueEntitySet;
        PriceKind: PriceKindEntitySet;
        Currency: CurrencyEntitySet;
        PlaformServiceType: PlaformServiceTypeEntitySet;
        PlatformServiceOptions: PlatformServiceOptionsEntitySet;
        UserPlatformServiceSubscription: UserPlatformServiceSubscriptionEntitySet;
        SeoTopObservation: SeoTopObservationEntitySet;
        ObservationProduct: ObservationProductEntitySet;
        ObservationProductKeyword: ObservationProductKeywordEntitySet;
        ObservationProductCategory: ObservationProductCategoryEntitySet;
        AddingWatchingProduct: AddingWatchingProductEntitySet;
        SearchMarketplaceProduct: SearchMarketplaceProductEntitySet;
        AttributeDictionaryValue: AttributeDictionaryValueEntitySet;
        SearchImportedProduct: SearchImportedProductEntitySet;

        // Unbound Functions


        //Unbound Actions

    }

    // EntitySets
    export class SideEffectTaskEntitySet extends odatatools.EntitySet<Bantikom.SideEffectTask> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class CaseEntitySet extends odatatools.EntitySet<Bantikom.Case> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class LeadEntitySet extends odatatools.EntitySet<Bantikom.Lead> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class CustomerEntitySet extends odatatools.EntitySet<Bantikom.Customer> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ContactEntitySet extends odatatools.EntitySet<Bantikom.Contact> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ContractTypeEntitySet extends odatatools.EntitySet<Bantikom.ContractType> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ContractEntitySet extends odatatools.EntitySet<Bantikom.Contract> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class MarketPlaceEntitySet extends odatatools.EntitySet<Bantikom.MarketPlace> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class InternalCategoryEntitySet extends odatatools.EntitySet<Bantikom.InternalCategory> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class InternalCategoryMapEntitySet extends odatatools.EntitySet<Bantikom.InternalCategoryMap> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class CategoryAttributeEntitySet extends odatatools.EntitySet<Bantikom.CategoryAttribute> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class CategoryAttributeOptionsEntitySet extends odatatools.EntitySet<Bantikom.CategoryAttributeOptions> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class UserCategoryEntitySet extends odatatools.EntitySet<Bantikom.UserCategory> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class UserCategoryMapEntitySet extends odatatools.EntitySet<Bantikom.UserCategoryMap> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class BrandEntitySet extends odatatools.EntitySet<Bantikom.Brand> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ProductEntitySet extends odatatools.EntitySet<Bantikom.Product> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ProductGroupEntitySet extends odatatools.EntitySet<Bantikom.ProductGroup> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ProductOperationEntitySet extends odatatools.EntitySet<Bantikom.ProductOperation> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class WatchingProductEntitySet extends odatatools.EntitySet<Bantikom.WatchingProduct> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class WatchingProductWildberriesEntitySet extends odatatools.EntitySet<Bantikom.WatchingProductWildberries> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class WatchingProductLinkEntitySet extends odatatools.EntitySet<Bantikom.WatchingProductLink> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ProductPhotoEntitySet extends odatatools.EntitySet<Bantikom.ProductPhoto> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ConnectedMarketplaceEntitySet extends odatatools.EntitySet<Bantikom.ConnectedMarketplace> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class UserOrderEntitySet extends odatatools.EntitySet<Bantikom.UserOrder> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ServiceTypeEntitySet extends odatatools.EntitySet<Bantikom.ServiceType> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ServiceTypeTaskEntitySet extends odatatools.EntitySet<Bantikom.ServiceTypeTask> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class UserOrderTaskEntitySet extends odatatools.EntitySet<Bantikom.UserOrderTask> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class UserNotificationEntitySet extends odatatools.EntitySet<Bantikom.UserNotification> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class AbTestEntitySet extends odatatools.EntitySet<Bantikom.AbTest> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class AbTestVariationEntitySet extends odatatools.EntitySet<Bantikom.AbTestVariation> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class BuyoutEntitySet extends odatatools.EntitySet<Bantikom.Buyout> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ProductPriceEntitySet extends odatatools.EntitySet<Bantikom.ProductPrice> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ProductPriceValueEntitySet extends odatatools.EntitySet<Bantikom.ProductPriceValue> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class PriceKindEntitySet extends odatatools.EntitySet<Bantikom.PriceKind> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class CurrencyEntitySet extends odatatools.EntitySet<Bantikom.Currency> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class PlaformServiceTypeEntitySet extends odatatools.EntitySet<Bantikom.PlaformServiceType> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class PlatformServiceOptionsEntitySet extends odatatools.EntitySet<Bantikom.PlatformServiceOptions> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class UserPlatformServiceSubscriptionEntitySet extends odatatools.EntitySet<Bantikom.UserPlatformServiceSubscription> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class SeoTopObservationEntitySet extends odatatools.EntitySet<Bantikom.SeoTopObservation> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ObservationProductEntitySet extends odatatools.EntitySet<Bantikom.ObservationProduct> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ObservationProductKeywordEntitySet extends odatatools.EntitySet<Bantikom.ObservationProductKeyword> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class ObservationProductCategoryEntitySet extends odatatools.EntitySet<Bantikom.ObservationProductCategory> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class AddingWatchingProductEntitySet extends odatatools.EntitySet<Bantikom.AddingWatchingProduct> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class SearchMarketplaceProductEntitySet extends odatatools.EntitySet<Bantikom.SearchMarketplaceProduct> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class AttributeDictionaryValueEntitySet extends odatatools.EntitySet<Bantikom.AttributeDictionaryValue> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }
    export class SearchImportedProductEntitySet extends odatatools.EntitySet<Bantikom.SearchImportedProduct> {
        constructor(name: string, address: string, key: string, additionalHeaders?: odatajs.Header) {
            super(name, address, key, additionalHeaders);
        }

    }

    // Reducers
    export const SideEffectTaskService = {
        getSideEffectTaskItem: fetchReducerFactory<ISingleODataResponse<Bantikom.SideEffectTask>, {}>(
            "get:SideEffectTaskItem",
            "/SideEffectTask",
            (response => getSingleODataResponse<Bantikom.SideEffectTask>(response)),
            false
        ),
        getSideEffectTaskItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.SideEffectTask>, {}>(
            "get:SideEffectTaskItems",
            "/SideEffectTask",
            (response => getMultipleODataResponse<Bantikom.SideEffectTask>(response)),
            true
        ),
        getSideEffectTaskPage: paginationReducerFactory<IPageableODataResponse<Bantikom.SideEffectTask>, {}>(
            "get:SideEffectTaskPage",
            "/SideEffectTask",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.SideEffectTask>(response))
        ),
        getSideEffectTaskInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.SideEffectTask>, {}>(
            "get:SideEffectTaskInfinitePage",
            "/SideEffectTask",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.SideEffectTask>(response))
        ),
        createSideEffectTaskItem: storeReducerFactory<ISingleODataResponse<Bantikom.SideEffectTask>, {}>(
            "create:SideEffectTaskItem",
            "post",
            "/SideEffectTask",
            (response => getSingleODataResponse<Bantikom.SideEffectTask>(response))
        ),
        saveSideEffectTaskItem: storeReducerFactory<IODataResponse, {}>(
            "save:SideEffectTaskItem",
            "patch",
            "/SideEffectTask",
            (response => getODataResponse(response))
        )
    };
    export const CaseService = {
        getCaseItem: fetchReducerFactory<ISingleODataResponse<Bantikom.Case>, {}>(
            "get:CaseItem",
            "/Case",
            (response => getSingleODataResponse<Bantikom.Case>(response)),
            false
        ),
        getCaseItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.Case>, {}>(
            "get:CaseItems",
            "/Case",
            (response => getMultipleODataResponse<Bantikom.Case>(response)),
            true
        ),
        getCasePage: paginationReducerFactory<IPageableODataResponse<Bantikom.Case>, {}>(
            "get:CasePage",
            "/Case",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.Case>(response))
        ),
        getCaseInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.Case>, {}>(
            "get:CaseInfinitePage",
            "/Case",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.Case>(response))
        ),
        createCaseItem: storeReducerFactory<ISingleODataResponse<Bantikom.Case>, {}>(
            "create:CaseItem",
            "post",
            "/Case",
            (response => getSingleODataResponse<Bantikom.Case>(response))
        ),
        saveCaseItem: storeReducerFactory<IODataResponse, {}>(
            "save:CaseItem",
            "patch",
            "/Case",
            (response => getODataResponse(response))
        )
    };
    export const LeadService = {
        getLeadItem: fetchReducerFactory<ISingleODataResponse<Bantikom.Lead>, {}>(
            "get:LeadItem",
            "/Lead",
            (response => getSingleODataResponse<Bantikom.Lead>(response)),
            false
        ),
        getLeadItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.Lead>, {}>(
            "get:LeadItems",
            "/Lead",
            (response => getMultipleODataResponse<Bantikom.Lead>(response)),
            true
        ),
        getLeadPage: paginationReducerFactory<IPageableODataResponse<Bantikom.Lead>, {}>(
            "get:LeadPage",
            "/Lead",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.Lead>(response))
        ),
        getLeadInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.Lead>, {}>(
            "get:LeadInfinitePage",
            "/Lead",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.Lead>(response))
        ),
        createLeadItem: storeReducerFactory<ISingleODataResponse<Bantikom.Lead>, {}>(
            "create:LeadItem",
            "post",
            "/Lead",
            (response => getSingleODataResponse<Bantikom.Lead>(response))
        ),
        saveLeadItem: storeReducerFactory<IODataResponse, {}>(
            "save:LeadItem",
            "patch",
            "/Lead",
            (response => getODataResponse(response))
        )
    };
    export const CustomerService = {
        getCustomerItem: fetchReducerFactory<ISingleODataResponse<Bantikom.Customer>, {}>(
            "get:CustomerItem",
            "/Customer",
            (response => getSingleODataResponse<Bantikom.Customer>(response)),
            false
        ),
        getCustomerItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.Customer>, {}>(
            "get:CustomerItems",
            "/Customer",
            (response => getMultipleODataResponse<Bantikom.Customer>(response)),
            true
        ),
        getCustomerPage: paginationReducerFactory<IPageableODataResponse<Bantikom.Customer>, {}>(
            "get:CustomerPage",
            "/Customer",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.Customer>(response))
        ),
        getCustomerInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.Customer>, {}>(
            "get:CustomerInfinitePage",
            "/Customer",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.Customer>(response))
        ),
        createCustomerItem: storeReducerFactory<ISingleODataResponse<Bantikom.Customer>, {}>(
            "create:CustomerItem",
            "post",
            "/Customer",
            (response => getSingleODataResponse<Bantikom.Customer>(response))
        ),
        saveCustomerItem: storeReducerFactory<IODataResponse, {}>(
            "save:CustomerItem",
            "patch",
            "/Customer",
            (response => getODataResponse(response))
        )
    };
    export const ContactService = {
        getContactItem: fetchReducerFactory<ISingleODataResponse<Bantikom.Contact>, {}>(
            "get:ContactItem",
            "/Contact",
            (response => getSingleODataResponse<Bantikom.Contact>(response)),
            false
        ),
        getContactItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.Contact>, {}>(
            "get:ContactItems",
            "/Contact",
            (response => getMultipleODataResponse<Bantikom.Contact>(response)),
            true
        ),
        getContactPage: paginationReducerFactory<IPageableODataResponse<Bantikom.Contact>, {}>(
            "get:ContactPage",
            "/Contact",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.Contact>(response))
        ),
        getContactInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.Contact>, {}>(
            "get:ContactInfinitePage",
            "/Contact",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.Contact>(response))
        ),
        createContactItem: storeReducerFactory<ISingleODataResponse<Bantikom.Contact>, {}>(
            "create:ContactItem",
            "post",
            "/Contact",
            (response => getSingleODataResponse<Bantikom.Contact>(response))
        ),
        saveContactItem: storeReducerFactory<IODataResponse, {}>(
            "save:ContactItem",
            "patch",
            "/Contact",
            (response => getODataResponse(response))
        )
    };
    export const ContractTypeService = {
        getContractTypeItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ContractType>, {}>(
            "get:ContractTypeItem",
            "/ContractType",
            (response => getSingleODataResponse<Bantikom.ContractType>(response)),
            false
        ),
        getContractTypeItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ContractType>, {}>(
            "get:ContractTypeItems",
            "/ContractType",
            (response => getMultipleODataResponse<Bantikom.ContractType>(response)),
            true
        ),
        getContractTypePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ContractType>, {}>(
            "get:ContractTypePage",
            "/ContractType",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ContractType>(response))
        ),
        getContractTypeInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ContractType>, {}>(
            "get:ContractTypeInfinitePage",
            "/ContractType",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ContractType>(response))
        ),
        createContractTypeItem: storeReducerFactory<ISingleODataResponse<Bantikom.ContractType>, {}>(
            "create:ContractTypeItem",
            "post",
            "/ContractType",
            (response => getSingleODataResponse<Bantikom.ContractType>(response))
        ),
        saveContractTypeItem: storeReducerFactory<IODataResponse, {}>(
            "save:ContractTypeItem",
            "patch",
            "/ContractType",
            (response => getODataResponse(response))
        )
    };
    export const ContractService = {
        getContractItem: fetchReducerFactory<ISingleODataResponse<Bantikom.Contract>, {}>(
            "get:ContractItem",
            "/Contract",
            (response => getSingleODataResponse<Bantikom.Contract>(response)),
            false
        ),
        getContractItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.Contract>, {}>(
            "get:ContractItems",
            "/Contract",
            (response => getMultipleODataResponse<Bantikom.Contract>(response)),
            true
        ),
        getContractPage: paginationReducerFactory<IPageableODataResponse<Bantikom.Contract>, {}>(
            "get:ContractPage",
            "/Contract",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.Contract>(response))
        ),
        getContractInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.Contract>, {}>(
            "get:ContractInfinitePage",
            "/Contract",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.Contract>(response))
        ),
        createContractItem: storeReducerFactory<ISingleODataResponse<Bantikom.Contract>, {}>(
            "create:ContractItem",
            "post",
            "/Contract",
            (response => getSingleODataResponse<Bantikom.Contract>(response))
        ),
        saveContractItem: storeReducerFactory<IODataResponse, {}>(
            "save:ContractItem",
            "patch",
            "/Contract",
            (response => getODataResponse(response))
        )
    };
    export const MarketPlaceService = {
        getMarketPlaceItem: fetchReducerFactory<ISingleODataResponse<Bantikom.MarketPlace>, {}>(
            "get:MarketPlaceItem",
            "/MarketPlace",
            (response => getSingleODataResponse<Bantikom.MarketPlace>(response)),
            false
        ),
        getMarketPlaceItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.MarketPlace>, {}>(
            "get:MarketPlaceItems",
            "/MarketPlace",
            (response => getMultipleODataResponse<Bantikom.MarketPlace>(response)),
            true
        ),
        getMarketPlacePage: paginationReducerFactory<IPageableODataResponse<Bantikom.MarketPlace>, {}>(
            "get:MarketPlacePage",
            "/MarketPlace",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.MarketPlace>(response))
        ),
        getMarketPlaceInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.MarketPlace>, {}>(
            "get:MarketPlaceInfinitePage",
            "/MarketPlace",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.MarketPlace>(response))
        ),
        createMarketPlaceItem: storeReducerFactory<ISingleODataResponse<Bantikom.MarketPlace>, {}>(
            "create:MarketPlaceItem",
            "post",
            "/MarketPlace",
            (response => getSingleODataResponse<Bantikom.MarketPlace>(response))
        ),
        saveMarketPlaceItem: storeReducerFactory<IODataResponse, {}>(
            "save:MarketPlaceItem",
            "patch",
            "/MarketPlace",
            (response => getODataResponse(response))
        )
    };
    export const InternalCategoryService = {
        getInternalCategoryItem: fetchReducerFactory<ISingleODataResponse<Bantikom.InternalCategory>, {}>(
            "get:InternalCategoryItem",
            "/InternalCategory",
            (response => getSingleODataResponse<Bantikom.InternalCategory>(response)),
            false
        ),
        getInternalCategoryItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.InternalCategory>, {}>(
            "get:InternalCategoryItems",
            "/InternalCategory",
            (response => getMultipleODataResponse<Bantikom.InternalCategory>(response)),
            true
        ),
        getInternalCategoryPage: paginationReducerFactory<IPageableODataResponse<Bantikom.InternalCategory>, {}>(
            "get:InternalCategoryPage",
            "/InternalCategory",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.InternalCategory>(response))
        ),
        getInternalCategoryInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.InternalCategory>, {}>(
            "get:InternalCategoryInfinitePage",
            "/InternalCategory",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.InternalCategory>(response))
        ),
        createInternalCategoryItem: storeReducerFactory<ISingleODataResponse<Bantikom.InternalCategory>, {}>(
            "create:InternalCategoryItem",
            "post",
            "/InternalCategory",
            (response => getSingleODataResponse<Bantikom.InternalCategory>(response))
        ),
        saveInternalCategoryItem: storeReducerFactory<IODataResponse, {}>(
            "save:InternalCategoryItem",
            "patch",
            "/InternalCategory",
            (response => getODataResponse(response))
        )
    };
    export const InternalCategoryMapService = {
        getInternalCategoryMapItem: fetchReducerFactory<ISingleODataResponse<Bantikom.InternalCategoryMap>, {}>(
            "get:InternalCategoryMapItem",
            "/InternalCategoryMap",
            (response => getSingleODataResponse<Bantikom.InternalCategoryMap>(response)),
            false
        ),
        getInternalCategoryMapItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.InternalCategoryMap>, {}>(
            "get:InternalCategoryMapItems",
            "/InternalCategoryMap",
            (response => getMultipleODataResponse<Bantikom.InternalCategoryMap>(response)),
            true
        ),
        getInternalCategoryMapPage: paginationReducerFactory<IPageableODataResponse<Bantikom.InternalCategoryMap>, {}>(
            "get:InternalCategoryMapPage",
            "/InternalCategoryMap",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.InternalCategoryMap>(response))
        ),
        getInternalCategoryMapInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.InternalCategoryMap>, {}>(
            "get:InternalCategoryMapInfinitePage",
            "/InternalCategoryMap",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.InternalCategoryMap>(response))
        ),
        createInternalCategoryMapItem: storeReducerFactory<ISingleODataResponse<Bantikom.InternalCategoryMap>, {}>(
            "create:InternalCategoryMapItem",
            "post",
            "/InternalCategoryMap",
            (response => getSingleODataResponse<Bantikom.InternalCategoryMap>(response))
        ),
        saveInternalCategoryMapItem: storeReducerFactory<IODataResponse, {}>(
            "save:InternalCategoryMapItem",
            "patch",
            "/InternalCategoryMap",
            (response => getODataResponse(response))
        )
    };
    export const CategoryAttributeService = {
        getCategoryAttributeItem: fetchReducerFactory<ISingleODataResponse<Bantikom.CategoryAttribute>, {}>(
            "get:CategoryAttributeItem",
            "/CategoryAttribute",
            (response => getSingleODataResponse<Bantikom.CategoryAttribute>(response)),
            false
        ),
        getCategoryAttributeItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.CategoryAttribute>, {}>(
            "get:CategoryAttributeItems",
            "/CategoryAttribute",
            (response => getMultipleODataResponse<Bantikom.CategoryAttribute>(response)),
            true
        ),
        getCategoryAttributePage: paginationReducerFactory<IPageableODataResponse<Bantikom.CategoryAttribute>, {}>(
            "get:CategoryAttributePage",
            "/CategoryAttribute",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.CategoryAttribute>(response))
        ),
        getCategoryAttributeInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.CategoryAttribute>, {}>(
            "get:CategoryAttributeInfinitePage",
            "/CategoryAttribute",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.CategoryAttribute>(response))
        ),
        createCategoryAttributeItem: storeReducerFactory<ISingleODataResponse<Bantikom.CategoryAttribute>, {}>(
            "create:CategoryAttributeItem",
            "post",
            "/CategoryAttribute",
            (response => getSingleODataResponse<Bantikom.CategoryAttribute>(response))
        ),
        saveCategoryAttributeItem: storeReducerFactory<IODataResponse, {}>(
            "save:CategoryAttributeItem",
            "patch",
            "/CategoryAttribute",
            (response => getODataResponse(response))
        )
    };
    export const CategoryAttributeOptionsService = {
        getCategoryAttributeOptionsItem: fetchReducerFactory<ISingleODataResponse<Bantikom.CategoryAttributeOptions>, {}>(
            "get:CategoryAttributeOptionsItem",
            "/CategoryAttributeOptions",
            (response => getSingleODataResponse<Bantikom.CategoryAttributeOptions>(response)),
            false
        ),
        getCategoryAttributeOptionsItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.CategoryAttributeOptions>, {}>(
            "get:CategoryAttributeOptionsItems",
            "/CategoryAttributeOptions",
            (response => getMultipleODataResponse<Bantikom.CategoryAttributeOptions>(response)),
            true
        ),
        getCategoryAttributeOptionsPage: paginationReducerFactory<IPageableODataResponse<Bantikom.CategoryAttributeOptions>, {}>(
            "get:CategoryAttributeOptionsPage",
            "/CategoryAttributeOptions",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.CategoryAttributeOptions>(response))
        ),
        getCategoryAttributeOptionsInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.CategoryAttributeOptions>, {}>(
            "get:CategoryAttributeOptionsInfinitePage",
            "/CategoryAttributeOptions",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.CategoryAttributeOptions>(response))
        ),
        createCategoryAttributeOptionsItem: storeReducerFactory<ISingleODataResponse<Bantikom.CategoryAttributeOptions>, {}>(
            "create:CategoryAttributeOptionsItem",
            "post",
            "/CategoryAttributeOptions",
            (response => getSingleODataResponse<Bantikom.CategoryAttributeOptions>(response))
        ),
        saveCategoryAttributeOptionsItem: storeReducerFactory<IODataResponse, {}>(
            "save:CategoryAttributeOptionsItem",
            "patch",
            "/CategoryAttributeOptions",
            (response => getODataResponse(response))
        )
    };
    export const UserCategoryService = {
        getUserCategoryItem: fetchReducerFactory<ISingleODataResponse<Bantikom.UserCategory>, {}>(
            "get:UserCategoryItem",
            "/UserCategory",
            (response => getSingleODataResponse<Bantikom.UserCategory>(response)),
            false
        ),
        getUserCategoryItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.UserCategory>, {}>(
            "get:UserCategoryItems",
            "/UserCategory",
            (response => getMultipleODataResponse<Bantikom.UserCategory>(response)),
            true
        ),
        getUserCategoryPage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserCategory>, {}>(
            "get:UserCategoryPage",
            "/UserCategory",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.UserCategory>(response))
        ),
        getUserCategoryInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserCategory>, {}>(
            "get:UserCategoryInfinitePage",
            "/UserCategory",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.UserCategory>(response))
        ),
        createUserCategoryItem: storeReducerFactory<ISingleODataResponse<Bantikom.UserCategory>, {}>(
            "create:UserCategoryItem",
            "post",
            "/UserCategory",
            (response => getSingleODataResponse<Bantikom.UserCategory>(response))
        ),
        saveUserCategoryItem: storeReducerFactory<IODataResponse, {}>(
            "save:UserCategoryItem",
            "patch",
            "/UserCategory",
            (response => getODataResponse(response))
        )
    };
    export const UserCategoryMapService = {
        getUserCategoryMapItem: fetchReducerFactory<ISingleODataResponse<Bantikom.UserCategoryMap>, {}>(
            "get:UserCategoryMapItem",
            "/UserCategoryMap",
            (response => getSingleODataResponse<Bantikom.UserCategoryMap>(response)),
            false
        ),
        getUserCategoryMapItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.UserCategoryMap>, {}>(
            "get:UserCategoryMapItems",
            "/UserCategoryMap",
            (response => getMultipleODataResponse<Bantikom.UserCategoryMap>(response)),
            true
        ),
        getUserCategoryMapPage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserCategoryMap>, {}>(
            "get:UserCategoryMapPage",
            "/UserCategoryMap",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.UserCategoryMap>(response))
        ),
        getUserCategoryMapInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserCategoryMap>, {}>(
            "get:UserCategoryMapInfinitePage",
            "/UserCategoryMap",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.UserCategoryMap>(response))
        ),
        createUserCategoryMapItem: storeReducerFactory<ISingleODataResponse<Bantikom.UserCategoryMap>, {}>(
            "create:UserCategoryMapItem",
            "post",
            "/UserCategoryMap",
            (response => getSingleODataResponse<Bantikom.UserCategoryMap>(response))
        ),
        saveUserCategoryMapItem: storeReducerFactory<IODataResponse, {}>(
            "save:UserCategoryMapItem",
            "patch",
            "/UserCategoryMap",
            (response => getODataResponse(response))
        )
    };
    export const BrandService = {
        getBrandItem: fetchReducerFactory<ISingleODataResponse<Bantikom.Brand>, {}>(
            "get:BrandItem",
            "/Brand",
            (response => getSingleODataResponse<Bantikom.Brand>(response)),
            false
        ),
        getBrandItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.Brand>, {}>(
            "get:BrandItems",
            "/Brand",
            (response => getMultipleODataResponse<Bantikom.Brand>(response)),
            true
        ),
        getBrandPage: paginationReducerFactory<IPageableODataResponse<Bantikom.Brand>, {}>(
            "get:BrandPage",
            "/Brand",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.Brand>(response))
        ),
        getBrandInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.Brand>, {}>(
            "get:BrandInfinitePage",
            "/Brand",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.Brand>(response))
        ),
        createBrandItem: storeReducerFactory<ISingleODataResponse<Bantikom.Brand>, {}>(
            "create:BrandItem",
            "post",
            "/Brand",
            (response => getSingleODataResponse<Bantikom.Brand>(response))
        ),
        saveBrandItem: storeReducerFactory<IODataResponse, {}>(
            "save:BrandItem",
            "patch",
            "/Brand",
            (response => getODataResponse(response))
        )
    };
    export const ProductService = {
        getProductItem: fetchReducerFactory<ISingleODataResponse<Bantikom.Product>, {}>(
            "get:ProductItem",
            "/Product",
            (response => getSingleODataResponse<Bantikom.Product>(response)),
            false
        ),
        getProductItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.Product>, {}>(
            "get:ProductItems",
            "/Product",
            (response => getMultipleODataResponse<Bantikom.Product>(response)),
            true
        ),
        getProductPage: paginationReducerFactory<IPageableODataResponse<Bantikom.Product>, {}>(
            "get:ProductPage",
            "/Product",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.Product>(response))
        ),
        getProductInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.Product>, {}>(
            "get:ProductInfinitePage",
            "/Product",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.Product>(response))
        ),
        createProductItem: storeReducerFactory<ISingleODataResponse<Bantikom.Product>, {}>(
            "create:ProductItem",
            "post",
            "/Product",
            (response => getSingleODataResponse<Bantikom.Product>(response))
        ),
        saveProductItem: storeReducerFactory<IODataResponse, {}>(
            "save:ProductItem",
            "patch",
            "/Product",
            (response => getODataResponse(response))
        )
    };
    export const ProductGroupService = {
        getProductGroupItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ProductGroup>, {}>(
            "get:ProductGroupItem",
            "/ProductGroup",
            (response => getSingleODataResponse<Bantikom.ProductGroup>(response)),
            false
        ),
        getProductGroupItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ProductGroup>, {}>(
            "get:ProductGroupItems",
            "/ProductGroup",
            (response => getMultipleODataResponse<Bantikom.ProductGroup>(response)),
            true
        ),
        getProductGroupPage: paginationReducerFactory<IPageableODataResponse<Bantikom.ProductGroup>, {}>(
            "get:ProductGroupPage",
            "/ProductGroup",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ProductGroup>(response))
        ),
        getProductGroupInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ProductGroup>, {}>(
            "get:ProductGroupInfinitePage",
            "/ProductGroup",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ProductGroup>(response))
        ),
        createProductGroupItem: storeReducerFactory<ISingleODataResponse<Bantikom.ProductGroup>, {}>(
            "create:ProductGroupItem",
            "post",
            "/ProductGroup",
            (response => getSingleODataResponse<Bantikom.ProductGroup>(response))
        ),
        saveProductGroupItem: storeReducerFactory<IODataResponse, {}>(
            "save:ProductGroupItem",
            "patch",
            "/ProductGroup",
            (response => getODataResponse(response))
        )
    };
    export const ProductOperationService = {
        getProductOperationItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ProductOperation>, {}>(
            "get:ProductOperationItem",
            "/ProductOperation",
            (response => getSingleODataResponse<Bantikom.ProductOperation>(response)),
            false
        ),
        getProductOperationItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ProductOperation>, {}>(
            "get:ProductOperationItems",
            "/ProductOperation",
            (response => getMultipleODataResponse<Bantikom.ProductOperation>(response)),
            true
        ),
        getProductOperationPage: paginationReducerFactory<IPageableODataResponse<Bantikom.ProductOperation>, {}>(
            "get:ProductOperationPage",
            "/ProductOperation",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ProductOperation>(response))
        ),
        getProductOperationInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ProductOperation>, {}>(
            "get:ProductOperationInfinitePage",
            "/ProductOperation",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ProductOperation>(response))
        ),
        createProductOperationItem: storeReducerFactory<ISingleODataResponse<Bantikom.ProductOperation>, {}>(
            "create:ProductOperationItem",
            "post",
            "/ProductOperation",
            (response => getSingleODataResponse<Bantikom.ProductOperation>(response))
        ),
        saveProductOperationItem: storeReducerFactory<IODataResponse, {}>(
            "save:ProductOperationItem",
            "patch",
            "/ProductOperation",
            (response => getODataResponse(response))
        )
    };
    export const WatchingProductService = {
        getWatchingProductItem: fetchReducerFactory<ISingleODataResponse<Bantikom.WatchingProduct>, {}>(
            "get:WatchingProductItem",
            "/WatchingProduct",
            (response => getSingleODataResponse<Bantikom.WatchingProduct>(response)),
            false
        ),
        getWatchingProductItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.WatchingProduct>, {}>(
            "get:WatchingProductItems",
            "/WatchingProduct",
            (response => getMultipleODataResponse<Bantikom.WatchingProduct>(response)),
            true
        ),
        getWatchingProductPage: paginationReducerFactory<IPageableODataResponse<Bantikom.WatchingProduct>, {}>(
            "get:WatchingProductPage",
            "/WatchingProduct",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.WatchingProduct>(response))
        ),
        getWatchingProductInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.WatchingProduct>, {}>(
            "get:WatchingProductInfinitePage",
            "/WatchingProduct",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.WatchingProduct>(response))
        ),
        createWatchingProductItem: storeReducerFactory<ISingleODataResponse<Bantikom.WatchingProduct>, {}>(
            "create:WatchingProductItem",
            "post",
            "/WatchingProduct",
            (response => getSingleODataResponse<Bantikom.WatchingProduct>(response))
        ),
        saveWatchingProductItem: storeReducerFactory<IODataResponse, {}>(
            "save:WatchingProductItem",
            "patch",
            "/WatchingProduct",
            (response => getODataResponse(response))
        )
    };
    export const WatchingProductWildberriesService = {
        getWatchingProductWildberriesItem: fetchReducerFactory<ISingleODataResponse<Bantikom.WatchingProductWildberries>, {}>(
            "get:WatchingProductWildberriesItem",
            "/WatchingProductWildberries",
            (response => getSingleODataResponse<Bantikom.WatchingProductWildberries>(response)),
            false
        ),
        getWatchingProductWildberriesItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.WatchingProductWildberries>, {}>(
            "get:WatchingProductWildberriesItems",
            "/WatchingProductWildberries",
            (response => getMultipleODataResponse<Bantikom.WatchingProductWildberries>(response)),
            true
        ),
        getWatchingProductWildberriesPage: paginationReducerFactory<IPageableODataResponse<Bantikom.WatchingProductWildberries>, {}>(
            "get:WatchingProductWildberriesPage",
            "/WatchingProductWildberries",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.WatchingProductWildberries>(response))
        ),
        getWatchingProductWildberriesInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.WatchingProductWildberries>, {}>(
            "get:WatchingProductWildberriesInfinitePage",
            "/WatchingProductWildberries",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.WatchingProductWildberries>(response))
        ),
        createWatchingProductWildberriesItem: storeReducerFactory<ISingleODataResponse<Bantikom.WatchingProductWildberries>, {}>(
            "create:WatchingProductWildberriesItem",
            "post",
            "/WatchingProductWildberries",
            (response => getSingleODataResponse<Bantikom.WatchingProductWildberries>(response))
        ),
        saveWatchingProductWildberriesItem: storeReducerFactory<IODataResponse, {}>(
            "save:WatchingProductWildberriesItem",
            "patch",
            "/WatchingProductWildberries",
            (response => getODataResponse(response))
        )
    };
    export const WatchingProductLinkService = {
        getWatchingProductLinkItem: fetchReducerFactory<ISingleODataResponse<Bantikom.WatchingProductLink>, {}>(
            "get:WatchingProductLinkItem",
            "/WatchingProductLink",
            (response => getSingleODataResponse<Bantikom.WatchingProductLink>(response)),
            false
        ),
        getWatchingProductLinkItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.WatchingProductLink>, {}>(
            "get:WatchingProductLinkItems",
            "/WatchingProductLink",
            (response => getMultipleODataResponse<Bantikom.WatchingProductLink>(response)),
            true
        ),
        getWatchingProductLinkPage: paginationReducerFactory<IPageableODataResponse<Bantikom.WatchingProductLink>, {}>(
            "get:WatchingProductLinkPage",
            "/WatchingProductLink",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.WatchingProductLink>(response))
        ),
        getWatchingProductLinkInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.WatchingProductLink>, {}>(
            "get:WatchingProductLinkInfinitePage",
            "/WatchingProductLink",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.WatchingProductLink>(response))
        ),
        createWatchingProductLinkItem: storeReducerFactory<ISingleODataResponse<Bantikom.WatchingProductLink>, {}>(
            "create:WatchingProductLinkItem",
            "post",
            "/WatchingProductLink",
            (response => getSingleODataResponse<Bantikom.WatchingProductLink>(response))
        ),
        saveWatchingProductLinkItem: storeReducerFactory<IODataResponse, {}>(
            "save:WatchingProductLinkItem",
            "patch",
            "/WatchingProductLink",
            (response => getODataResponse(response))
        )
    };
    export const ProductPhotoService = {
        getProductPhotoItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ProductPhoto>, {}>(
            "get:ProductPhotoItem",
            "/ProductPhoto",
            (response => getSingleODataResponse<Bantikom.ProductPhoto>(response)),
            false
        ),
        getProductPhotoItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ProductPhoto>, {}>(
            "get:ProductPhotoItems",
            "/ProductPhoto",
            (response => getMultipleODataResponse<Bantikom.ProductPhoto>(response)),
            true
        ),
        getProductPhotoPage: paginationReducerFactory<IPageableODataResponse<Bantikom.ProductPhoto>, {}>(
            "get:ProductPhotoPage",
            "/ProductPhoto",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ProductPhoto>(response))
        ),
        getProductPhotoInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ProductPhoto>, {}>(
            "get:ProductPhotoInfinitePage",
            "/ProductPhoto",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ProductPhoto>(response))
        ),
        createProductPhotoItem: storeReducerFactory<ISingleODataResponse<Bantikom.ProductPhoto>, {}>(
            "create:ProductPhotoItem",
            "post",
            "/ProductPhoto",
            (response => getSingleODataResponse<Bantikom.ProductPhoto>(response))
        ),
        saveProductPhotoItem: storeReducerFactory<IODataResponse, {}>(
            "save:ProductPhotoItem",
            "patch",
            "/ProductPhoto",
            (response => getODataResponse(response))
        )
    };
    export const ConnectedMarketplaceService = {
        getConnectedMarketplaceItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ConnectedMarketplace>, {}>(
            "get:ConnectedMarketplaceItem",
            "/ConnectedMarketplace",
            (response => getSingleODataResponse<Bantikom.ConnectedMarketplace>(response)),
            false
        ),
        getConnectedMarketplaceItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ConnectedMarketplace>, {}>(
            "get:ConnectedMarketplaceItems",
            "/ConnectedMarketplace",
            (response => getMultipleODataResponse<Bantikom.ConnectedMarketplace>(response)),
            true
        ),
        getConnectedMarketplacePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ConnectedMarketplace>, {}>(
            "get:ConnectedMarketplacePage",
            "/ConnectedMarketplace",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ConnectedMarketplace>(response))
        ),
        getConnectedMarketplaceInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ConnectedMarketplace>, {}>(
            "get:ConnectedMarketplaceInfinitePage",
            "/ConnectedMarketplace",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ConnectedMarketplace>(response))
        ),
        createConnectedMarketplaceItem: storeReducerFactory<ISingleODataResponse<Bantikom.ConnectedMarketplace>, {}>(
            "create:ConnectedMarketplaceItem",
            "post",
            "/ConnectedMarketplace",
            (response => getSingleODataResponse<Bantikom.ConnectedMarketplace>(response))
        ),
        saveConnectedMarketplaceItem: storeReducerFactory<IODataResponse, {}>(
            "save:ConnectedMarketplaceItem",
            "patch",
            "/ConnectedMarketplace",
            (response => getODataResponse(response))
        )
    };
    export const UserOrderService = {
        getUserOrderItem: fetchReducerFactory<ISingleODataResponse<Bantikom.UserOrder>, {}>(
            "get:UserOrderItem",
            "/UserOrder",
            (response => getSingleODataResponse<Bantikom.UserOrder>(response)),
            false
        ),
        getUserOrderItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.UserOrder>, {}>(
            "get:UserOrderItems",
            "/UserOrder",
            (response => getMultipleODataResponse<Bantikom.UserOrder>(response)),
            true
        ),
        getUserOrderPage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserOrder>, {}>(
            "get:UserOrderPage",
            "/UserOrder",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.UserOrder>(response))
        ),
        getUserOrderInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserOrder>, {}>(
            "get:UserOrderInfinitePage",
            "/UserOrder",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.UserOrder>(response))
        ),
        createUserOrderItem: storeReducerFactory<ISingleODataResponse<Bantikom.UserOrder>, {}>(
            "create:UserOrderItem",
            "post",
            "/UserOrder",
            (response => getSingleODataResponse<Bantikom.UserOrder>(response))
        ),
        saveUserOrderItem: storeReducerFactory<IODataResponse, {}>(
            "save:UserOrderItem",
            "patch",
            "/UserOrder",
            (response => getODataResponse(response))
        )
    };
    export const ServiceTypeService = {
        getServiceTypeItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ServiceType>, {}>(
            "get:ServiceTypeItem",
            "/ServiceType",
            (response => getSingleODataResponse<Bantikom.ServiceType>(response)),
            false
        ),
        getServiceTypeItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ServiceType>, {}>(
            "get:ServiceTypeItems",
            "/ServiceType",
            (response => getMultipleODataResponse<Bantikom.ServiceType>(response)),
            true
        ),
        getServiceTypePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ServiceType>, {}>(
            "get:ServiceTypePage",
            "/ServiceType",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ServiceType>(response))
        ),
        getServiceTypeInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ServiceType>, {}>(
            "get:ServiceTypeInfinitePage",
            "/ServiceType",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ServiceType>(response))
        ),
        createServiceTypeItem: storeReducerFactory<ISingleODataResponse<Bantikom.ServiceType>, {}>(
            "create:ServiceTypeItem",
            "post",
            "/ServiceType",
            (response => getSingleODataResponse<Bantikom.ServiceType>(response))
        ),
        saveServiceTypeItem: storeReducerFactory<IODataResponse, {}>(
            "save:ServiceTypeItem",
            "patch",
            "/ServiceType",
            (response => getODataResponse(response))
        )
    };
    export const ServiceTypeTaskService = {
        getServiceTypeTaskItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ServiceTypeTask>, {}>(
            "get:ServiceTypeTaskItem",
            "/ServiceTypeTask",
            (response => getSingleODataResponse<Bantikom.ServiceTypeTask>(response)),
            false
        ),
        getServiceTypeTaskItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ServiceTypeTask>, {}>(
            "get:ServiceTypeTaskItems",
            "/ServiceTypeTask",
            (response => getMultipleODataResponse<Bantikom.ServiceTypeTask>(response)),
            true
        ),
        getServiceTypeTaskPage: paginationReducerFactory<IPageableODataResponse<Bantikom.ServiceTypeTask>, {}>(
            "get:ServiceTypeTaskPage",
            "/ServiceTypeTask",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ServiceTypeTask>(response))
        ),
        getServiceTypeTaskInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ServiceTypeTask>, {}>(
            "get:ServiceTypeTaskInfinitePage",
            "/ServiceTypeTask",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ServiceTypeTask>(response))
        ),
        createServiceTypeTaskItem: storeReducerFactory<ISingleODataResponse<Bantikom.ServiceTypeTask>, {}>(
            "create:ServiceTypeTaskItem",
            "post",
            "/ServiceTypeTask",
            (response => getSingleODataResponse<Bantikom.ServiceTypeTask>(response))
        ),
        saveServiceTypeTaskItem: storeReducerFactory<IODataResponse, {}>(
            "save:ServiceTypeTaskItem",
            "patch",
            "/ServiceTypeTask",
            (response => getODataResponse(response))
        )
    };
    export const UserOrderTaskService = {
        getUserOrderTaskItem: fetchReducerFactory<ISingleODataResponse<Bantikom.UserOrderTask>, {}>(
            "get:UserOrderTaskItem",
            "/UserOrderTask",
            (response => getSingleODataResponse<Bantikom.UserOrderTask>(response)),
            false
        ),
        getUserOrderTaskItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.UserOrderTask>, {}>(
            "get:UserOrderTaskItems",
            "/UserOrderTask",
            (response => getMultipleODataResponse<Bantikom.UserOrderTask>(response)),
            true
        ),
        getUserOrderTaskPage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserOrderTask>, {}>(
            "get:UserOrderTaskPage",
            "/UserOrderTask",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.UserOrderTask>(response))
        ),
        getUserOrderTaskInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserOrderTask>, {}>(
            "get:UserOrderTaskInfinitePage",
            "/UserOrderTask",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.UserOrderTask>(response))
        ),
        createUserOrderTaskItem: storeReducerFactory<ISingleODataResponse<Bantikom.UserOrderTask>, {}>(
            "create:UserOrderTaskItem",
            "post",
            "/UserOrderTask",
            (response => getSingleODataResponse<Bantikom.UserOrderTask>(response))
        ),
        saveUserOrderTaskItem: storeReducerFactory<IODataResponse, {}>(
            "save:UserOrderTaskItem",
            "patch",
            "/UserOrderTask",
            (response => getODataResponse(response))
        )
    };
    export const UserNotificationService = {
        getUserNotificationItem: fetchReducerFactory<ISingleODataResponse<Bantikom.UserNotification>, {}>(
            "get:UserNotificationItem",
            "/UserNotification",
            (response => getSingleODataResponse<Bantikom.UserNotification>(response)),
            false
        ),
        getUserNotificationItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.UserNotification>, {}>(
            "get:UserNotificationItems",
            "/UserNotification",
            (response => getMultipleODataResponse<Bantikom.UserNotification>(response)),
            true
        ),
        getUserNotificationPage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserNotification>, {}>(
            "get:UserNotificationPage",
            "/UserNotification",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.UserNotification>(response))
        ),
        getUserNotificationInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserNotification>, {}>(
            "get:UserNotificationInfinitePage",
            "/UserNotification",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.UserNotification>(response))
        ),
        createUserNotificationItem: storeReducerFactory<ISingleODataResponse<Bantikom.UserNotification>, {}>(
            "create:UserNotificationItem",
            "post",
            "/UserNotification",
            (response => getSingleODataResponse<Bantikom.UserNotification>(response))
        ),
        saveUserNotificationItem: storeReducerFactory<IODataResponse, {}>(
            "save:UserNotificationItem",
            "patch",
            "/UserNotification",
            (response => getODataResponse(response))
        )
    };
    export const AbTestService = {
        getAbTestItem: fetchReducerFactory<ISingleODataResponse<Bantikom.AbTest>, {}>(
            "get:AbTestItem",
            "/AbTest",
            (response => getSingleODataResponse<Bantikom.AbTest>(response)),
            false
        ),
        getAbTestItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.AbTest>, {}>(
            "get:AbTestItems",
            "/AbTest",
            (response => getMultipleODataResponse<Bantikom.AbTest>(response)),
            true
        ),
        getAbTestPage: paginationReducerFactory<IPageableODataResponse<Bantikom.AbTest>, {}>(
            "get:AbTestPage",
            "/AbTest",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.AbTest>(response))
        ),
        getAbTestInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.AbTest>, {}>(
            "get:AbTestInfinitePage",
            "/AbTest",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.AbTest>(response))
        ),
        createAbTestItem: storeReducerFactory<ISingleODataResponse<Bantikom.AbTest>, {}>(
            "create:AbTestItem",
            "post",
            "/AbTest",
            (response => getSingleODataResponse<Bantikom.AbTest>(response))
        ),
        saveAbTestItem: storeReducerFactory<IODataResponse, {}>(
            "save:AbTestItem",
            "patch",
            "/AbTest",
            (response => getODataResponse(response))
        )
    };
    export const AbTestVariationService = {
        getAbTestVariationItem: fetchReducerFactory<ISingleODataResponse<Bantikom.AbTestVariation>, {}>(
            "get:AbTestVariationItem",
            "/AbTestVariation",
            (response => getSingleODataResponse<Bantikom.AbTestVariation>(response)),
            false
        ),
        getAbTestVariationItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.AbTestVariation>, {}>(
            "get:AbTestVariationItems",
            "/AbTestVariation",
            (response => getMultipleODataResponse<Bantikom.AbTestVariation>(response)),
            true
        ),
        getAbTestVariationPage: paginationReducerFactory<IPageableODataResponse<Bantikom.AbTestVariation>, {}>(
            "get:AbTestVariationPage",
            "/AbTestVariation",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.AbTestVariation>(response))
        ),
        getAbTestVariationInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.AbTestVariation>, {}>(
            "get:AbTestVariationInfinitePage",
            "/AbTestVariation",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.AbTestVariation>(response))
        ),
        createAbTestVariationItem: storeReducerFactory<ISingleODataResponse<Bantikom.AbTestVariation>, {}>(
            "create:AbTestVariationItem",
            "post",
            "/AbTestVariation",
            (response => getSingleODataResponse<Bantikom.AbTestVariation>(response))
        ),
        saveAbTestVariationItem: storeReducerFactory<IODataResponse, {}>(
            "save:AbTestVariationItem",
            "patch",
            "/AbTestVariation",
            (response => getODataResponse(response))
        )
    };
    export const BuyoutService = {
        getBuyoutItem: fetchReducerFactory<ISingleODataResponse<Bantikom.Buyout>, {}>(
            "get:BuyoutItem",
            "/Buyout",
            (response => getSingleODataResponse<Bantikom.Buyout>(response)),
            false
        ),
        getBuyoutItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.Buyout>, {}>(
            "get:BuyoutItems",
            "/Buyout",
            (response => getMultipleODataResponse<Bantikom.Buyout>(response)),
            true
        ),
        getBuyoutPage: paginationReducerFactory<IPageableODataResponse<Bantikom.Buyout>, {}>(
            "get:BuyoutPage",
            "/Buyout",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.Buyout>(response))
        ),
        getBuyoutInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.Buyout>, {}>(
            "get:BuyoutInfinitePage",
            "/Buyout",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.Buyout>(response))
        ),
        createBuyoutItem: storeReducerFactory<ISingleODataResponse<Bantikom.Buyout>, {}>(
            "create:BuyoutItem",
            "post",
            "/Buyout",
            (response => getSingleODataResponse<Bantikom.Buyout>(response))
        ),
        saveBuyoutItem: storeReducerFactory<IODataResponse, {}>(
            "save:BuyoutItem",
            "patch",
            "/Buyout",
            (response => getODataResponse(response))
        )
    };
    export const ProductPriceService = {
        getProductPriceItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ProductPrice>, {}>(
            "get:ProductPriceItem",
            "/ProductPrice",
            (response => getSingleODataResponse<Bantikom.ProductPrice>(response)),
            false
        ),
        getProductPriceItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ProductPrice>, {}>(
            "get:ProductPriceItems",
            "/ProductPrice",
            (response => getMultipleODataResponse<Bantikom.ProductPrice>(response)),
            true
        ),
        getProductPricePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ProductPrice>, {}>(
            "get:ProductPricePage",
            "/ProductPrice",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ProductPrice>(response))
        ),
        getProductPriceInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ProductPrice>, {}>(
            "get:ProductPriceInfinitePage",
            "/ProductPrice",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ProductPrice>(response))
        ),
        createProductPriceItem: storeReducerFactory<ISingleODataResponse<Bantikom.ProductPrice>, {}>(
            "create:ProductPriceItem",
            "post",
            "/ProductPrice",
            (response => getSingleODataResponse<Bantikom.ProductPrice>(response))
        ),
        saveProductPriceItem: storeReducerFactory<IODataResponse, {}>(
            "save:ProductPriceItem",
            "patch",
            "/ProductPrice",
            (response => getODataResponse(response))
        )
    };
    export const ProductPriceValueService = {
        getProductPriceValueItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ProductPriceValue>, {}>(
            "get:ProductPriceValueItem",
            "/ProductPriceValue",
            (response => getSingleODataResponse<Bantikom.ProductPriceValue>(response)),
            false
        ),
        getProductPriceValueItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ProductPriceValue>, {}>(
            "get:ProductPriceValueItems",
            "/ProductPriceValue",
            (response => getMultipleODataResponse<Bantikom.ProductPriceValue>(response)),
            true
        ),
        getProductPriceValuePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ProductPriceValue>, {}>(
            "get:ProductPriceValuePage",
            "/ProductPriceValue",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ProductPriceValue>(response))
        ),
        getProductPriceValueInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ProductPriceValue>, {}>(
            "get:ProductPriceValueInfinitePage",
            "/ProductPriceValue",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ProductPriceValue>(response))
        ),
        createProductPriceValueItem: storeReducerFactory<ISingleODataResponse<Bantikom.ProductPriceValue>, {}>(
            "create:ProductPriceValueItem",
            "post",
            "/ProductPriceValue",
            (response => getSingleODataResponse<Bantikom.ProductPriceValue>(response))
        ),
        saveProductPriceValueItem: storeReducerFactory<IODataResponse, {}>(
            "save:ProductPriceValueItem",
            "patch",
            "/ProductPriceValue",
            (response => getODataResponse(response))
        )
    };
    export const PriceKindService = {
        getPriceKindItem: fetchReducerFactory<ISingleODataResponse<Bantikom.PriceKind>, {}>(
            "get:PriceKindItem",
            "/PriceKind",
            (response => getSingleODataResponse<Bantikom.PriceKind>(response)),
            false
        ),
        getPriceKindItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.PriceKind>, {}>(
            "get:PriceKindItems",
            "/PriceKind",
            (response => getMultipleODataResponse<Bantikom.PriceKind>(response)),
            true
        ),
        getPriceKindPage: paginationReducerFactory<IPageableODataResponse<Bantikom.PriceKind>, {}>(
            "get:PriceKindPage",
            "/PriceKind",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.PriceKind>(response))
        ),
        getPriceKindInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.PriceKind>, {}>(
            "get:PriceKindInfinitePage",
            "/PriceKind",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.PriceKind>(response))
        ),
        createPriceKindItem: storeReducerFactory<ISingleODataResponse<Bantikom.PriceKind>, {}>(
            "create:PriceKindItem",
            "post",
            "/PriceKind",
            (response => getSingleODataResponse<Bantikom.PriceKind>(response))
        ),
        savePriceKindItem: storeReducerFactory<IODataResponse, {}>(
            "save:PriceKindItem",
            "patch",
            "/PriceKind",
            (response => getODataResponse(response))
        )
    };
    export const CurrencyService = {
        getCurrencyItem: fetchReducerFactory<ISingleODataResponse<Bantikom.Currency>, {}>(
            "get:CurrencyItem",
            "/Currency",
            (response => getSingleODataResponse<Bantikom.Currency>(response)),
            false
        ),
        getCurrencyItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.Currency>, {}>(
            "get:CurrencyItems",
            "/Currency",
            (response => getMultipleODataResponse<Bantikom.Currency>(response)),
            true
        ),
        getCurrencyPage: paginationReducerFactory<IPageableODataResponse<Bantikom.Currency>, {}>(
            "get:CurrencyPage",
            "/Currency",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.Currency>(response))
        ),
        getCurrencyInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.Currency>, {}>(
            "get:CurrencyInfinitePage",
            "/Currency",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.Currency>(response))
        ),
        createCurrencyItem: storeReducerFactory<ISingleODataResponse<Bantikom.Currency>, {}>(
            "create:CurrencyItem",
            "post",
            "/Currency",
            (response => getSingleODataResponse<Bantikom.Currency>(response))
        ),
        saveCurrencyItem: storeReducerFactory<IODataResponse, {}>(
            "save:CurrencyItem",
            "patch",
            "/Currency",
            (response => getODataResponse(response))
        )
    };
    export const PlaformServiceTypeService = {
        getPlaformServiceTypeItem: fetchReducerFactory<ISingleODataResponse<Bantikom.PlaformServiceType>, {}>(
            "get:PlaformServiceTypeItem",
            "/PlaformServiceType",
            (response => getSingleODataResponse<Bantikom.PlaformServiceType>(response)),
            false
        ),
        getPlaformServiceTypeItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.PlaformServiceType>, {}>(
            "get:PlaformServiceTypeItems",
            "/PlaformServiceType",
            (response => getMultipleODataResponse<Bantikom.PlaformServiceType>(response)),
            true
        ),
        getPlaformServiceTypePage: paginationReducerFactory<IPageableODataResponse<Bantikom.PlaformServiceType>, {}>(
            "get:PlaformServiceTypePage",
            "/PlaformServiceType",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.PlaformServiceType>(response))
        ),
        getPlaformServiceTypeInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.PlaformServiceType>, {}>(
            "get:PlaformServiceTypeInfinitePage",
            "/PlaformServiceType",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.PlaformServiceType>(response))
        ),
        createPlaformServiceTypeItem: storeReducerFactory<ISingleODataResponse<Bantikom.PlaformServiceType>, {}>(
            "create:PlaformServiceTypeItem",
            "post",
            "/PlaformServiceType",
            (response => getSingleODataResponse<Bantikom.PlaformServiceType>(response))
        ),
        savePlaformServiceTypeItem: storeReducerFactory<IODataResponse, {}>(
            "save:PlaformServiceTypeItem",
            "patch",
            "/PlaformServiceType",
            (response => getODataResponse(response))
        )
    };
    export const PlatformServiceOptionsService = {
        getPlatformServiceOptionsItem: fetchReducerFactory<ISingleODataResponse<Bantikom.PlatformServiceOptions>, {}>(
            "get:PlatformServiceOptionsItem",
            "/PlatformServiceOptions",
            (response => getSingleODataResponse<Bantikom.PlatformServiceOptions>(response)),
            false
        ),
        getPlatformServiceOptionsItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.PlatformServiceOptions>, {}>(
            "get:PlatformServiceOptionsItems",
            "/PlatformServiceOptions",
            (response => getMultipleODataResponse<Bantikom.PlatformServiceOptions>(response)),
            true
        ),
        getPlatformServiceOptionsPage: paginationReducerFactory<IPageableODataResponse<Bantikom.PlatformServiceOptions>, {}>(
            "get:PlatformServiceOptionsPage",
            "/PlatformServiceOptions",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.PlatformServiceOptions>(response))
        ),
        getPlatformServiceOptionsInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.PlatformServiceOptions>, {}>(
            "get:PlatformServiceOptionsInfinitePage",
            "/PlatformServiceOptions",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.PlatformServiceOptions>(response))
        ),
        createPlatformServiceOptionsItem: storeReducerFactory<ISingleODataResponse<Bantikom.PlatformServiceOptions>, {}>(
            "create:PlatformServiceOptionsItem",
            "post",
            "/PlatformServiceOptions",
            (response => getSingleODataResponse<Bantikom.PlatformServiceOptions>(response))
        ),
        savePlatformServiceOptionsItem: storeReducerFactory<IODataResponse, {}>(
            "save:PlatformServiceOptionsItem",
            "patch",
            "/PlatformServiceOptions",
            (response => getODataResponse(response))
        )
    };
    export const UserPlatformServiceSubscriptionService = {
        getUserPlatformServiceSubscriptionItem: fetchReducerFactory<ISingleODataResponse<Bantikom.UserPlatformServiceSubscription>, {}>(
            "get:UserPlatformServiceSubscriptionItem",
            "/UserPlatformServiceSubscription",
            (response => getSingleODataResponse<Bantikom.UserPlatformServiceSubscription>(response)),
            false
        ),
        getUserPlatformServiceSubscriptionItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.UserPlatformServiceSubscription>, {}>(
            "get:UserPlatformServiceSubscriptionItems",
            "/UserPlatformServiceSubscription",
            (response => getMultipleODataResponse<Bantikom.UserPlatformServiceSubscription>(response)),
            true
        ),
        getUserPlatformServiceSubscriptionPage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserPlatformServiceSubscription>, {}>(
            "get:UserPlatformServiceSubscriptionPage",
            "/UserPlatformServiceSubscription",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.UserPlatformServiceSubscription>(response))
        ),
        getUserPlatformServiceSubscriptionInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.UserPlatformServiceSubscription>, {}>(
            "get:UserPlatformServiceSubscriptionInfinitePage",
            "/UserPlatformServiceSubscription",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.UserPlatformServiceSubscription>(response))
        ),
        createUserPlatformServiceSubscriptionItem: storeReducerFactory<ISingleODataResponse<Bantikom.UserPlatformServiceSubscription>, {}>(
            "create:UserPlatformServiceSubscriptionItem",
            "post",
            "/UserPlatformServiceSubscription",
            (response => getSingleODataResponse<Bantikom.UserPlatformServiceSubscription>(response))
        ),
        saveUserPlatformServiceSubscriptionItem: storeReducerFactory<IODataResponse, {}>(
            "save:UserPlatformServiceSubscriptionItem",
            "patch",
            "/UserPlatformServiceSubscription",
            (response => getODataResponse(response))
        )
    };
    export const SeoTopObservationService = {
        getSeoTopObservationItem: fetchReducerFactory<ISingleODataResponse<Bantikom.SeoTopObservation>, {}>(
            "get:SeoTopObservationItem",
            "/SeoTopObservation",
            (response => getSingleODataResponse<Bantikom.SeoTopObservation>(response)),
            false
        ),
        getSeoTopObservationItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.SeoTopObservation>, {}>(
            "get:SeoTopObservationItems",
            "/SeoTopObservation",
            (response => getMultipleODataResponse<Bantikom.SeoTopObservation>(response)),
            true
        ),
        getSeoTopObservationPage: paginationReducerFactory<IPageableODataResponse<Bantikom.SeoTopObservation>, {}>(
            "get:SeoTopObservationPage",
            "/SeoTopObservation",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.SeoTopObservation>(response))
        ),
        getSeoTopObservationInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.SeoTopObservation>, {}>(
            "get:SeoTopObservationInfinitePage",
            "/SeoTopObservation",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.SeoTopObservation>(response))
        ),
        createSeoTopObservationItem: storeReducerFactory<ISingleODataResponse<Bantikom.SeoTopObservation>, {}>(
            "create:SeoTopObservationItem",
            "post",
            "/SeoTopObservation",
            (response => getSingleODataResponse<Bantikom.SeoTopObservation>(response))
        ),
        saveSeoTopObservationItem: storeReducerFactory<IODataResponse, {}>(
            "save:SeoTopObservationItem",
            "patch",
            "/SeoTopObservation",
            (response => getODataResponse(response))
        )
    };
    export const ObservationProductService = {
        getObservationProductItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ObservationProduct>, {}>(
            "get:ObservationProductItem",
            "/ObservationProduct",
            (response => getSingleODataResponse<Bantikom.ObservationProduct>(response)),
            false
        ),
        getObservationProductItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ObservationProduct>, {}>(
            "get:ObservationProductItems",
            "/ObservationProduct",
            (response => getMultipleODataResponse<Bantikom.ObservationProduct>(response)),
            true
        ),
        getObservationProductPage: paginationReducerFactory<IPageableODataResponse<Bantikom.ObservationProduct>, {}>(
            "get:ObservationProductPage",
            "/ObservationProduct",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ObservationProduct>(response))
        ),
        getObservationProductInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ObservationProduct>, {}>(
            "get:ObservationProductInfinitePage",
            "/ObservationProduct",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ObservationProduct>(response))
        ),
        createObservationProductItem: storeReducerFactory<ISingleODataResponse<Bantikom.ObservationProduct>, {}>(
            "create:ObservationProductItem",
            "post",
            "/ObservationProduct",
            (response => getSingleODataResponse<Bantikom.ObservationProduct>(response))
        ),
        saveObservationProductItem: storeReducerFactory<IODataResponse, {}>(
            "save:ObservationProductItem",
            "patch",
            "/ObservationProduct",
            (response => getODataResponse(response))
        )
    };
    export const ObservationProductKeywordService = {
        getObservationProductKeywordItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ObservationProductKeyword>, {}>(
            "get:ObservationProductKeywordItem",
            "/ObservationProductKeyword",
            (response => getSingleODataResponse<Bantikom.ObservationProductKeyword>(response)),
            false
        ),
        getObservationProductKeywordItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ObservationProductKeyword>, {}>(
            "get:ObservationProductKeywordItems",
            "/ObservationProductKeyword",
            (response => getMultipleODataResponse<Bantikom.ObservationProductKeyword>(response)),
            true
        ),
        getObservationProductKeywordPage: paginationReducerFactory<IPageableODataResponse<Bantikom.ObservationProductKeyword>, {}>(
            "get:ObservationProductKeywordPage",
            "/ObservationProductKeyword",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ObservationProductKeyword>(response))
        ),
        getObservationProductKeywordInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ObservationProductKeyword>, {}>(
            "get:ObservationProductKeywordInfinitePage",
            "/ObservationProductKeyword",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ObservationProductKeyword>(response))
        ),
        createObservationProductKeywordItem: storeReducerFactory<ISingleODataResponse<Bantikom.ObservationProductKeyword>, {}>(
            "create:ObservationProductKeywordItem",
            "post",
            "/ObservationProductKeyword",
            (response => getSingleODataResponse<Bantikom.ObservationProductKeyword>(response))
        ),
        saveObservationProductKeywordItem: storeReducerFactory<IODataResponse, {}>(
            "save:ObservationProductKeywordItem",
            "patch",
            "/ObservationProductKeyword",
            (response => getODataResponse(response))
        )
    };
    export const ObservationProductCategoryService = {
        getObservationProductCategoryItem: fetchReducerFactory<ISingleODataResponse<Bantikom.ObservationProductCategory>, {}>(
            "get:ObservationProductCategoryItem",
            "/ObservationProductCategory",
            (response => getSingleODataResponse<Bantikom.ObservationProductCategory>(response)),
            false
        ),
        getObservationProductCategoryItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.ObservationProductCategory>, {}>(
            "get:ObservationProductCategoryItems",
            "/ObservationProductCategory",
            (response => getMultipleODataResponse<Bantikom.ObservationProductCategory>(response)),
            true
        ),
        getObservationProductCategoryPage: paginationReducerFactory<IPageableODataResponse<Bantikom.ObservationProductCategory>, {}>(
            "get:ObservationProductCategoryPage",
            "/ObservationProductCategory",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.ObservationProductCategory>(response))
        ),
        getObservationProductCategoryInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.ObservationProductCategory>, {}>(
            "get:ObservationProductCategoryInfinitePage",
            "/ObservationProductCategory",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.ObservationProductCategory>(response))
        ),
        createObservationProductCategoryItem: storeReducerFactory<ISingleODataResponse<Bantikom.ObservationProductCategory>, {}>(
            "create:ObservationProductCategoryItem",
            "post",
            "/ObservationProductCategory",
            (response => getSingleODataResponse<Bantikom.ObservationProductCategory>(response))
        ),
        saveObservationProductCategoryItem: storeReducerFactory<IODataResponse, {}>(
            "save:ObservationProductCategoryItem",
            "patch",
            "/ObservationProductCategory",
            (response => getODataResponse(response))
        )
    };
    export const AddingWatchingProductService = {
        getAddingWatchingProductItem: fetchReducerFactory<ISingleODataResponse<Bantikom.AddingWatchingProduct>, {}>(
            "get:AddingWatchingProductItem",
            "/AddingWatchingProduct",
            (response => getSingleODataResponse<Bantikom.AddingWatchingProduct>(response)),
            false
        ),
        getAddingWatchingProductItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.AddingWatchingProduct>, {}>(
            "get:AddingWatchingProductItems",
            "/AddingWatchingProduct",
            (response => getMultipleODataResponse<Bantikom.AddingWatchingProduct>(response)),
            true
        ),
        getAddingWatchingProductPage: paginationReducerFactory<IPageableODataResponse<Bantikom.AddingWatchingProduct>, {}>(
            "get:AddingWatchingProductPage",
            "/AddingWatchingProduct",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.AddingWatchingProduct>(response))
        ),
        getAddingWatchingProductInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.AddingWatchingProduct>, {}>(
            "get:AddingWatchingProductInfinitePage",
            "/AddingWatchingProduct",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.AddingWatchingProduct>(response))
        ),
        createAddingWatchingProductItem: storeReducerFactory<ISingleODataResponse<Bantikom.AddingWatchingProduct>, {}>(
            "create:AddingWatchingProductItem",
            "post",
            "/AddingWatchingProduct",
            (response => getSingleODataResponse<Bantikom.AddingWatchingProduct>(response))
        ),
        saveAddingWatchingProductItem: storeReducerFactory<IODataResponse, {}>(
            "save:AddingWatchingProductItem",
            "patch",
            "/AddingWatchingProduct",
            (response => getODataResponse(response))
        )
    };
    export const SearchMarketplaceProductService = {
        getSearchMarketplaceProductItem: fetchReducerFactory<ISingleODataResponse<Bantikom.SearchMarketplaceProduct>, {}>(
            "get:SearchMarketplaceProductItem",
            "/SearchMarketplaceProduct",
            (response => getSingleODataResponse<Bantikom.SearchMarketplaceProduct>(response)),
            false
        ),
        getSearchMarketplaceProductItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.SearchMarketplaceProduct>, {}>(
            "get:SearchMarketplaceProductItems",
            "/SearchMarketplaceProduct",
            (response => getMultipleODataResponse<Bantikom.SearchMarketplaceProduct>(response)),
            true
        ),
        getSearchMarketplaceProductPage: paginationReducerFactory<IPageableODataResponse<Bantikom.SearchMarketplaceProduct>, {}>(
            "get:SearchMarketplaceProductPage",
            "/SearchMarketplaceProduct",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.SearchMarketplaceProduct>(response))
        ),
        getSearchMarketplaceProductInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.SearchMarketplaceProduct>, {}>(
            "get:SearchMarketplaceProductInfinitePage",
            "/SearchMarketplaceProduct",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.SearchMarketplaceProduct>(response))
        ),
        createSearchMarketplaceProductItem: storeReducerFactory<ISingleODataResponse<Bantikom.SearchMarketplaceProduct>, {}>(
            "create:SearchMarketplaceProductItem",
            "post",
            "/SearchMarketplaceProduct",
            (response => getSingleODataResponse<Bantikom.SearchMarketplaceProduct>(response))
        ),
        saveSearchMarketplaceProductItem: storeReducerFactory<IODataResponse, {}>(
            "save:SearchMarketplaceProductItem",
            "patch",
            "/SearchMarketplaceProduct",
            (response => getODataResponse(response))
        )
    };
    export const AttributeDictionaryValueService = {
        getAttributeDictionaryValueItem: fetchReducerFactory<ISingleODataResponse<Bantikom.AttributeDictionaryValue>, {}>(
            "get:AttributeDictionaryValueItem",
            "/AttributeDictionaryValue",
            (response => getSingleODataResponse<Bantikom.AttributeDictionaryValue>(response)),
            false
        ),
        getAttributeDictionaryValueItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.AttributeDictionaryValue>, {}>(
            "get:AttributeDictionaryValueItems",
            "/AttributeDictionaryValue",
            (response => getMultipleODataResponse<Bantikom.AttributeDictionaryValue>(response)),
            true
        ),
        getAttributeDictionaryValuePage: paginationReducerFactory<IPageableODataResponse<Bantikom.AttributeDictionaryValue>, {}>(
            "get:AttributeDictionaryValuePage",
            "/AttributeDictionaryValue",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.AttributeDictionaryValue>(response))
        ),
        getAttributeDictionaryValueInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.AttributeDictionaryValue>, {}>(
            "get:AttributeDictionaryValueInfinitePage",
            "/AttributeDictionaryValue",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.AttributeDictionaryValue>(response))
        ),
        createAttributeDictionaryValueItem: storeReducerFactory<ISingleODataResponse<Bantikom.AttributeDictionaryValue>, {}>(
            "create:AttributeDictionaryValueItem",
            "post",
            "/AttributeDictionaryValue",
            (response => getSingleODataResponse<Bantikom.AttributeDictionaryValue>(response))
        ),
        saveAttributeDictionaryValueItem: storeReducerFactory<IODataResponse, {}>(
            "save:AttributeDictionaryValueItem",
            "patch",
            "/AttributeDictionaryValue",
            (response => getODataResponse(response))
        )
    };
    export const SearchImportedProductService = {
        getSearchImportedProductItem: fetchReducerFactory<ISingleODataResponse<Bantikom.SearchImportedProduct>, {}>(
            "get:SearchImportedProductItem",
            "/SearchImportedProduct",
            (response => getSingleODataResponse<Bantikom.SearchImportedProduct>(response)),
            false
        ),
        getSearchImportedProductItems: fetchReducerFactory<IMultipleODataResponse<Bantikom.SearchImportedProduct>, {}>(
            "get:SearchImportedProductItems",
            "/SearchImportedProduct",
            (response => getMultipleODataResponse<Bantikom.SearchImportedProduct>(response)),
            true
        ),
        getSearchImportedProductPage: paginationReducerFactory<IPageableODataResponse<Bantikom.SearchImportedProduct>, {}>(
            "get:SearchImportedProductPage",
            "/SearchImportedProduct",
            undefined,
            false,
            (response => getPageODataResponse<Bantikom.SearchImportedProduct>(response))
        ),
        getSearchImportedProductInfinitePage: paginationReducerFactory<IPageableODataResponse<Bantikom.SearchImportedProduct>, {}>(
            "get:SearchImportedProductInfinitePage",
            "/SearchImportedProduct",
            undefined,
            true,
            (response => getPageODataResponse<Bantikom.SearchImportedProduct>(response))
        ),
        createSearchImportedProductItem: storeReducerFactory<ISingleODataResponse<Bantikom.SearchImportedProduct>, {}>(
            "create:SearchImportedProductItem",
            "post",
            "/SearchImportedProduct",
            (response => getSingleODataResponse<Bantikom.SearchImportedProduct>(response))
        ),
        saveSearchImportedProductItem: storeReducerFactory<IODataResponse, {}>(
            "save:SearchImportedProductItem",
            "patch",
            "/SearchImportedProduct",
            (response => getODataResponse(response))
        )
    };

    // Combine reducers
    export const ODataServiceReducers = {
        SideEffectTaskItem: SideEffectTaskService.getSideEffectTaskItem.fetchReducer,
        SideEffectTaskItems: SideEffectTaskService.getSideEffectTaskItems.fetchReducer,
        SideEffectTaskPage: SideEffectTaskService.getSideEffectTaskPage.paginationReducer,
        SideEffectTaskInfinitePage: SideEffectTaskService.getSideEffectTaskInfinitePage.paginationReducer,
        SideEffectTaskCreateItem: SideEffectTaskService.createSideEffectTaskItem.reducer,
        SideEffectTaskSaveItem: SideEffectTaskService.saveSideEffectTaskItem.reducer,
        CaseItem: CaseService.getCaseItem.fetchReducer,
        CaseItems: CaseService.getCaseItems.fetchReducer,
        CasePage: CaseService.getCasePage.paginationReducer,
        CaseInfinitePage: CaseService.getCaseInfinitePage.paginationReducer,
        CaseCreateItem: CaseService.createCaseItem.reducer,
        CaseSaveItem: CaseService.saveCaseItem.reducer,
        LeadItem: LeadService.getLeadItem.fetchReducer,
        LeadItems: LeadService.getLeadItems.fetchReducer,
        LeadPage: LeadService.getLeadPage.paginationReducer,
        LeadInfinitePage: LeadService.getLeadInfinitePage.paginationReducer,
        LeadCreateItem: LeadService.createLeadItem.reducer,
        LeadSaveItem: LeadService.saveLeadItem.reducer,
        CustomerItem: CustomerService.getCustomerItem.fetchReducer,
        CustomerItems: CustomerService.getCustomerItems.fetchReducer,
        CustomerPage: CustomerService.getCustomerPage.paginationReducer,
        CustomerInfinitePage: CustomerService.getCustomerInfinitePage.paginationReducer,
        CustomerCreateItem: CustomerService.createCustomerItem.reducer,
        CustomerSaveItem: CustomerService.saveCustomerItem.reducer,
        ContactItem: ContactService.getContactItem.fetchReducer,
        ContactItems: ContactService.getContactItems.fetchReducer,
        ContactPage: ContactService.getContactPage.paginationReducer,
        ContactInfinitePage: ContactService.getContactInfinitePage.paginationReducer,
        ContactCreateItem: ContactService.createContactItem.reducer,
        ContactSaveItem: ContactService.saveContactItem.reducer,
        ContractTypeItem: ContractTypeService.getContractTypeItem.fetchReducer,
        ContractTypeItems: ContractTypeService.getContractTypeItems.fetchReducer,
        ContractTypePage: ContractTypeService.getContractTypePage.paginationReducer,
        ContractTypeInfinitePage: ContractTypeService.getContractTypeInfinitePage.paginationReducer,
        ContractTypeCreateItem: ContractTypeService.createContractTypeItem.reducer,
        ContractTypeSaveItem: ContractTypeService.saveContractTypeItem.reducer,
        ContractItem: ContractService.getContractItem.fetchReducer,
        ContractItems: ContractService.getContractItems.fetchReducer,
        ContractPage: ContractService.getContractPage.paginationReducer,
        ContractInfinitePage: ContractService.getContractInfinitePage.paginationReducer,
        ContractCreateItem: ContractService.createContractItem.reducer,
        ContractSaveItem: ContractService.saveContractItem.reducer,
        MarketPlaceItem: MarketPlaceService.getMarketPlaceItem.fetchReducer,
        MarketPlaceItems: MarketPlaceService.getMarketPlaceItems.fetchReducer,
        MarketPlacePage: MarketPlaceService.getMarketPlacePage.paginationReducer,
        MarketPlaceInfinitePage: MarketPlaceService.getMarketPlaceInfinitePage.paginationReducer,
        MarketPlaceCreateItem: MarketPlaceService.createMarketPlaceItem.reducer,
        MarketPlaceSaveItem: MarketPlaceService.saveMarketPlaceItem.reducer,
        InternalCategoryItem: InternalCategoryService.getInternalCategoryItem.fetchReducer,
        InternalCategoryItems: InternalCategoryService.getInternalCategoryItems.fetchReducer,
        InternalCategoryPage: InternalCategoryService.getInternalCategoryPage.paginationReducer,
        InternalCategoryInfinitePage: InternalCategoryService.getInternalCategoryInfinitePage.paginationReducer,
        InternalCategoryCreateItem: InternalCategoryService.createInternalCategoryItem.reducer,
        InternalCategorySaveItem: InternalCategoryService.saveInternalCategoryItem.reducer,
        InternalCategoryMapItem: InternalCategoryMapService.getInternalCategoryMapItem.fetchReducer,
        InternalCategoryMapItems: InternalCategoryMapService.getInternalCategoryMapItems.fetchReducer,
        InternalCategoryMapPage: InternalCategoryMapService.getInternalCategoryMapPage.paginationReducer,
        InternalCategoryMapInfinitePage: InternalCategoryMapService.getInternalCategoryMapInfinitePage.paginationReducer,
        InternalCategoryMapCreateItem: InternalCategoryMapService.createInternalCategoryMapItem.reducer,
        InternalCategoryMapSaveItem: InternalCategoryMapService.saveInternalCategoryMapItem.reducer,
        CategoryAttributeItem: CategoryAttributeService.getCategoryAttributeItem.fetchReducer,
        CategoryAttributeItems: CategoryAttributeService.getCategoryAttributeItems.fetchReducer,
        CategoryAttributePage: CategoryAttributeService.getCategoryAttributePage.paginationReducer,
        CategoryAttributeInfinitePage: CategoryAttributeService.getCategoryAttributeInfinitePage.paginationReducer,
        CategoryAttributeCreateItem: CategoryAttributeService.createCategoryAttributeItem.reducer,
        CategoryAttributeSaveItem: CategoryAttributeService.saveCategoryAttributeItem.reducer,
        CategoryAttributeOptionsItem: CategoryAttributeOptionsService.getCategoryAttributeOptionsItem.fetchReducer,
        CategoryAttributeOptionsItems: CategoryAttributeOptionsService.getCategoryAttributeOptionsItems.fetchReducer,
        CategoryAttributeOptionsPage: CategoryAttributeOptionsService.getCategoryAttributeOptionsPage.paginationReducer,
        CategoryAttributeOptionsInfinitePage: CategoryAttributeOptionsService.getCategoryAttributeOptionsInfinitePage.paginationReducer,
        CategoryAttributeOptionsCreateItem: CategoryAttributeOptionsService.createCategoryAttributeOptionsItem.reducer,
        CategoryAttributeOptionsSaveItem: CategoryAttributeOptionsService.saveCategoryAttributeOptionsItem.reducer,
        UserCategoryItem: UserCategoryService.getUserCategoryItem.fetchReducer,
        UserCategoryItems: UserCategoryService.getUserCategoryItems.fetchReducer,
        UserCategoryPage: UserCategoryService.getUserCategoryPage.paginationReducer,
        UserCategoryInfinitePage: UserCategoryService.getUserCategoryInfinitePage.paginationReducer,
        UserCategoryCreateItem: UserCategoryService.createUserCategoryItem.reducer,
        UserCategorySaveItem: UserCategoryService.saveUserCategoryItem.reducer,
        UserCategoryMapItem: UserCategoryMapService.getUserCategoryMapItem.fetchReducer,
        UserCategoryMapItems: UserCategoryMapService.getUserCategoryMapItems.fetchReducer,
        UserCategoryMapPage: UserCategoryMapService.getUserCategoryMapPage.paginationReducer,
        UserCategoryMapInfinitePage: UserCategoryMapService.getUserCategoryMapInfinitePage.paginationReducer,
        UserCategoryMapCreateItem: UserCategoryMapService.createUserCategoryMapItem.reducer,
        UserCategoryMapSaveItem: UserCategoryMapService.saveUserCategoryMapItem.reducer,
        BrandItem: BrandService.getBrandItem.fetchReducer,
        BrandItems: BrandService.getBrandItems.fetchReducer,
        BrandPage: BrandService.getBrandPage.paginationReducer,
        BrandInfinitePage: BrandService.getBrandInfinitePage.paginationReducer,
        BrandCreateItem: BrandService.createBrandItem.reducer,
        BrandSaveItem: BrandService.saveBrandItem.reducer,
        ProductItem: ProductService.getProductItem.fetchReducer,
        ProductItems: ProductService.getProductItems.fetchReducer,
        ProductPage: ProductService.getProductPage.paginationReducer,
        ProductInfinitePage: ProductService.getProductInfinitePage.paginationReducer,
        ProductCreateItem: ProductService.createProductItem.reducer,
        ProductSaveItem: ProductService.saveProductItem.reducer,
        ProductGroupItem: ProductGroupService.getProductGroupItem.fetchReducer,
        ProductGroupItems: ProductGroupService.getProductGroupItems.fetchReducer,
        ProductGroupPage: ProductGroupService.getProductGroupPage.paginationReducer,
        ProductGroupInfinitePage: ProductGroupService.getProductGroupInfinitePage.paginationReducer,
        ProductGroupCreateItem: ProductGroupService.createProductGroupItem.reducer,
        ProductGroupSaveItem: ProductGroupService.saveProductGroupItem.reducer,
        ProductOperationItem: ProductOperationService.getProductOperationItem.fetchReducer,
        ProductOperationItems: ProductOperationService.getProductOperationItems.fetchReducer,
        ProductOperationPage: ProductOperationService.getProductOperationPage.paginationReducer,
        ProductOperationInfinitePage: ProductOperationService.getProductOperationInfinitePage.paginationReducer,
        ProductOperationCreateItem: ProductOperationService.createProductOperationItem.reducer,
        ProductOperationSaveItem: ProductOperationService.saveProductOperationItem.reducer,
        WatchingProductItem: WatchingProductService.getWatchingProductItem.fetchReducer,
        WatchingProductItems: WatchingProductService.getWatchingProductItems.fetchReducer,
        WatchingProductPage: WatchingProductService.getWatchingProductPage.paginationReducer,
        WatchingProductInfinitePage: WatchingProductService.getWatchingProductInfinitePage.paginationReducer,
        WatchingProductCreateItem: WatchingProductService.createWatchingProductItem.reducer,
        WatchingProductSaveItem: WatchingProductService.saveWatchingProductItem.reducer,
        WatchingProductWildberriesItem: WatchingProductWildberriesService.getWatchingProductWildberriesItem.fetchReducer,
        WatchingProductWildberriesItems: WatchingProductWildberriesService.getWatchingProductWildberriesItems.fetchReducer,
        WatchingProductWildberriesPage: WatchingProductWildberriesService.getWatchingProductWildberriesPage.paginationReducer,
        WatchingProductWildberriesInfinitePage: WatchingProductWildberriesService.getWatchingProductWildberriesInfinitePage.paginationReducer,
        WatchingProductWildberriesCreateItem: WatchingProductWildberriesService.createWatchingProductWildberriesItem.reducer,
        WatchingProductWildberriesSaveItem: WatchingProductWildberriesService.saveWatchingProductWildberriesItem.reducer,
        WatchingProductLinkItem: WatchingProductLinkService.getWatchingProductLinkItem.fetchReducer,
        WatchingProductLinkItems: WatchingProductLinkService.getWatchingProductLinkItems.fetchReducer,
        WatchingProductLinkPage: WatchingProductLinkService.getWatchingProductLinkPage.paginationReducer,
        WatchingProductLinkInfinitePage: WatchingProductLinkService.getWatchingProductLinkInfinitePage.paginationReducer,
        WatchingProductLinkCreateItem: WatchingProductLinkService.createWatchingProductLinkItem.reducer,
        WatchingProductLinkSaveItem: WatchingProductLinkService.saveWatchingProductLinkItem.reducer,
        ProductPhotoItem: ProductPhotoService.getProductPhotoItem.fetchReducer,
        ProductPhotoItems: ProductPhotoService.getProductPhotoItems.fetchReducer,
        ProductPhotoPage: ProductPhotoService.getProductPhotoPage.paginationReducer,
        ProductPhotoInfinitePage: ProductPhotoService.getProductPhotoInfinitePage.paginationReducer,
        ProductPhotoCreateItem: ProductPhotoService.createProductPhotoItem.reducer,
        ProductPhotoSaveItem: ProductPhotoService.saveProductPhotoItem.reducer,
        ConnectedMarketplaceItem: ConnectedMarketplaceService.getConnectedMarketplaceItem.fetchReducer,
        ConnectedMarketplaceItems: ConnectedMarketplaceService.getConnectedMarketplaceItems.fetchReducer,
        ConnectedMarketplacePage: ConnectedMarketplaceService.getConnectedMarketplacePage.paginationReducer,
        ConnectedMarketplaceInfinitePage: ConnectedMarketplaceService.getConnectedMarketplaceInfinitePage.paginationReducer,
        ConnectedMarketplaceCreateItem: ConnectedMarketplaceService.createConnectedMarketplaceItem.reducer,
        ConnectedMarketplaceSaveItem: ConnectedMarketplaceService.saveConnectedMarketplaceItem.reducer,
        UserOrderItem: UserOrderService.getUserOrderItem.fetchReducer,
        UserOrderItems: UserOrderService.getUserOrderItems.fetchReducer,
        UserOrderPage: UserOrderService.getUserOrderPage.paginationReducer,
        UserOrderInfinitePage: UserOrderService.getUserOrderInfinitePage.paginationReducer,
        UserOrderCreateItem: UserOrderService.createUserOrderItem.reducer,
        UserOrderSaveItem: UserOrderService.saveUserOrderItem.reducer,
        ServiceTypeItem: ServiceTypeService.getServiceTypeItem.fetchReducer,
        ServiceTypeItems: ServiceTypeService.getServiceTypeItems.fetchReducer,
        ServiceTypePage: ServiceTypeService.getServiceTypePage.paginationReducer,
        ServiceTypeInfinitePage: ServiceTypeService.getServiceTypeInfinitePage.paginationReducer,
        ServiceTypeCreateItem: ServiceTypeService.createServiceTypeItem.reducer,
        ServiceTypeSaveItem: ServiceTypeService.saveServiceTypeItem.reducer,
        ServiceTypeTaskItem: ServiceTypeTaskService.getServiceTypeTaskItem.fetchReducer,
        ServiceTypeTaskItems: ServiceTypeTaskService.getServiceTypeTaskItems.fetchReducer,
        ServiceTypeTaskPage: ServiceTypeTaskService.getServiceTypeTaskPage.paginationReducer,
        ServiceTypeTaskInfinitePage: ServiceTypeTaskService.getServiceTypeTaskInfinitePage.paginationReducer,
        ServiceTypeTaskCreateItem: ServiceTypeTaskService.createServiceTypeTaskItem.reducer,
        ServiceTypeTaskSaveItem: ServiceTypeTaskService.saveServiceTypeTaskItem.reducer,
        UserOrderTaskItem: UserOrderTaskService.getUserOrderTaskItem.fetchReducer,
        UserOrderTaskItems: UserOrderTaskService.getUserOrderTaskItems.fetchReducer,
        UserOrderTaskPage: UserOrderTaskService.getUserOrderTaskPage.paginationReducer,
        UserOrderTaskInfinitePage: UserOrderTaskService.getUserOrderTaskInfinitePage.paginationReducer,
        UserOrderTaskCreateItem: UserOrderTaskService.createUserOrderTaskItem.reducer,
        UserOrderTaskSaveItem: UserOrderTaskService.saveUserOrderTaskItem.reducer,
        UserNotificationItem: UserNotificationService.getUserNotificationItem.fetchReducer,
        UserNotificationItems: UserNotificationService.getUserNotificationItems.fetchReducer,
        UserNotificationPage: UserNotificationService.getUserNotificationPage.paginationReducer,
        UserNotificationInfinitePage: UserNotificationService.getUserNotificationInfinitePage.paginationReducer,
        UserNotificationCreateItem: UserNotificationService.createUserNotificationItem.reducer,
        UserNotificationSaveItem: UserNotificationService.saveUserNotificationItem.reducer,
        AbTestItem: AbTestService.getAbTestItem.fetchReducer,
        AbTestItems: AbTestService.getAbTestItems.fetchReducer,
        AbTestPage: AbTestService.getAbTestPage.paginationReducer,
        AbTestInfinitePage: AbTestService.getAbTestInfinitePage.paginationReducer,
        AbTestCreateItem: AbTestService.createAbTestItem.reducer,
        AbTestSaveItem: AbTestService.saveAbTestItem.reducer,
        AbTestVariationItem: AbTestVariationService.getAbTestVariationItem.fetchReducer,
        AbTestVariationItems: AbTestVariationService.getAbTestVariationItems.fetchReducer,
        AbTestVariationPage: AbTestVariationService.getAbTestVariationPage.paginationReducer,
        AbTestVariationInfinitePage: AbTestVariationService.getAbTestVariationInfinitePage.paginationReducer,
        AbTestVariationCreateItem: AbTestVariationService.createAbTestVariationItem.reducer,
        AbTestVariationSaveItem: AbTestVariationService.saveAbTestVariationItem.reducer,
        BuyoutItem: BuyoutService.getBuyoutItem.fetchReducer,
        BuyoutItems: BuyoutService.getBuyoutItems.fetchReducer,
        BuyoutPage: BuyoutService.getBuyoutPage.paginationReducer,
        BuyoutInfinitePage: BuyoutService.getBuyoutInfinitePage.paginationReducer,
        BuyoutCreateItem: BuyoutService.createBuyoutItem.reducer,
        BuyoutSaveItem: BuyoutService.saveBuyoutItem.reducer,
        ProductPriceItem: ProductPriceService.getProductPriceItem.fetchReducer,
        ProductPriceItems: ProductPriceService.getProductPriceItems.fetchReducer,
        ProductPricePage: ProductPriceService.getProductPricePage.paginationReducer,
        ProductPriceInfinitePage: ProductPriceService.getProductPriceInfinitePage.paginationReducer,
        ProductPriceCreateItem: ProductPriceService.createProductPriceItem.reducer,
        ProductPriceSaveItem: ProductPriceService.saveProductPriceItem.reducer,
        ProductPriceValueItem: ProductPriceValueService.getProductPriceValueItem.fetchReducer,
        ProductPriceValueItems: ProductPriceValueService.getProductPriceValueItems.fetchReducer,
        ProductPriceValuePage: ProductPriceValueService.getProductPriceValuePage.paginationReducer,
        ProductPriceValueInfinitePage: ProductPriceValueService.getProductPriceValueInfinitePage.paginationReducer,
        ProductPriceValueCreateItem: ProductPriceValueService.createProductPriceValueItem.reducer,
        ProductPriceValueSaveItem: ProductPriceValueService.saveProductPriceValueItem.reducer,
        PriceKindItem: PriceKindService.getPriceKindItem.fetchReducer,
        PriceKindItems: PriceKindService.getPriceKindItems.fetchReducer,
        PriceKindPage: PriceKindService.getPriceKindPage.paginationReducer,
        PriceKindInfinitePage: PriceKindService.getPriceKindInfinitePage.paginationReducer,
        PriceKindCreateItem: PriceKindService.createPriceKindItem.reducer,
        PriceKindSaveItem: PriceKindService.savePriceKindItem.reducer,
        CurrencyItem: CurrencyService.getCurrencyItem.fetchReducer,
        CurrencyItems: CurrencyService.getCurrencyItems.fetchReducer,
        CurrencyPage: CurrencyService.getCurrencyPage.paginationReducer,
        CurrencyInfinitePage: CurrencyService.getCurrencyInfinitePage.paginationReducer,
        CurrencyCreateItem: CurrencyService.createCurrencyItem.reducer,
        CurrencySaveItem: CurrencyService.saveCurrencyItem.reducer,
        PlaformServiceTypeItem: PlaformServiceTypeService.getPlaformServiceTypeItem.fetchReducer,
        PlaformServiceTypeItems: PlaformServiceTypeService.getPlaformServiceTypeItems.fetchReducer,
        PlaformServiceTypePage: PlaformServiceTypeService.getPlaformServiceTypePage.paginationReducer,
        PlaformServiceTypeInfinitePage: PlaformServiceTypeService.getPlaformServiceTypeInfinitePage.paginationReducer,
        PlaformServiceTypeCreateItem: PlaformServiceTypeService.createPlaformServiceTypeItem.reducer,
        PlaformServiceTypeSaveItem: PlaformServiceTypeService.savePlaformServiceTypeItem.reducer,
        PlatformServiceOptionsItem: PlatformServiceOptionsService.getPlatformServiceOptionsItem.fetchReducer,
        PlatformServiceOptionsItems: PlatformServiceOptionsService.getPlatformServiceOptionsItems.fetchReducer,
        PlatformServiceOptionsPage: PlatformServiceOptionsService.getPlatformServiceOptionsPage.paginationReducer,
        PlatformServiceOptionsInfinitePage: PlatformServiceOptionsService.getPlatformServiceOptionsInfinitePage.paginationReducer,
        PlatformServiceOptionsCreateItem: PlatformServiceOptionsService.createPlatformServiceOptionsItem.reducer,
        PlatformServiceOptionsSaveItem: PlatformServiceOptionsService.savePlatformServiceOptionsItem.reducer,
        UserPlatformServiceSubscriptionItem: UserPlatformServiceSubscriptionService.getUserPlatformServiceSubscriptionItem.fetchReducer,
        UserPlatformServiceSubscriptionItems: UserPlatformServiceSubscriptionService.getUserPlatformServiceSubscriptionItems.fetchReducer,
        UserPlatformServiceSubscriptionPage: UserPlatformServiceSubscriptionService.getUserPlatformServiceSubscriptionPage.paginationReducer,
        UserPlatformServiceSubscriptionInfinitePage: UserPlatformServiceSubscriptionService.getUserPlatformServiceSubscriptionInfinitePage.paginationReducer,
        UserPlatformServiceSubscriptionCreateItem: UserPlatformServiceSubscriptionService.createUserPlatformServiceSubscriptionItem.reducer,
        UserPlatformServiceSubscriptionSaveItem: UserPlatformServiceSubscriptionService.saveUserPlatformServiceSubscriptionItem.reducer,
        SeoTopObservationItem: SeoTopObservationService.getSeoTopObservationItem.fetchReducer,
        SeoTopObservationItems: SeoTopObservationService.getSeoTopObservationItems.fetchReducer,
        SeoTopObservationPage: SeoTopObservationService.getSeoTopObservationPage.paginationReducer,
        SeoTopObservationInfinitePage: SeoTopObservationService.getSeoTopObservationInfinitePage.paginationReducer,
        SeoTopObservationCreateItem: SeoTopObservationService.createSeoTopObservationItem.reducer,
        SeoTopObservationSaveItem: SeoTopObservationService.saveSeoTopObservationItem.reducer,
        ObservationProductItem: ObservationProductService.getObservationProductItem.fetchReducer,
        ObservationProductItems: ObservationProductService.getObservationProductItems.fetchReducer,
        ObservationProductPage: ObservationProductService.getObservationProductPage.paginationReducer,
        ObservationProductInfinitePage: ObservationProductService.getObservationProductInfinitePage.paginationReducer,
        ObservationProductCreateItem: ObservationProductService.createObservationProductItem.reducer,
        ObservationProductSaveItem: ObservationProductService.saveObservationProductItem.reducer,
        ObservationProductKeywordItem: ObservationProductKeywordService.getObservationProductKeywordItem.fetchReducer,
        ObservationProductKeywordItems: ObservationProductKeywordService.getObservationProductKeywordItems.fetchReducer,
        ObservationProductKeywordPage: ObservationProductKeywordService.getObservationProductKeywordPage.paginationReducer,
        ObservationProductKeywordInfinitePage: ObservationProductKeywordService.getObservationProductKeywordInfinitePage.paginationReducer,
        ObservationProductKeywordCreateItem: ObservationProductKeywordService.createObservationProductKeywordItem.reducer,
        ObservationProductKeywordSaveItem: ObservationProductKeywordService.saveObservationProductKeywordItem.reducer,
        ObservationProductCategoryItem: ObservationProductCategoryService.getObservationProductCategoryItem.fetchReducer,
        ObservationProductCategoryItems: ObservationProductCategoryService.getObservationProductCategoryItems.fetchReducer,
        ObservationProductCategoryPage: ObservationProductCategoryService.getObservationProductCategoryPage.paginationReducer,
        ObservationProductCategoryInfinitePage: ObservationProductCategoryService.getObservationProductCategoryInfinitePage.paginationReducer,
        ObservationProductCategoryCreateItem: ObservationProductCategoryService.createObservationProductCategoryItem.reducer,
        ObservationProductCategorySaveItem: ObservationProductCategoryService.saveObservationProductCategoryItem.reducer,
        AddingWatchingProductItem: AddingWatchingProductService.getAddingWatchingProductItem.fetchReducer,
        AddingWatchingProductItems: AddingWatchingProductService.getAddingWatchingProductItems.fetchReducer,
        AddingWatchingProductPage: AddingWatchingProductService.getAddingWatchingProductPage.paginationReducer,
        AddingWatchingProductInfinitePage: AddingWatchingProductService.getAddingWatchingProductInfinitePage.paginationReducer,
        AddingWatchingProductCreateItem: AddingWatchingProductService.createAddingWatchingProductItem.reducer,
        AddingWatchingProductSaveItem: AddingWatchingProductService.saveAddingWatchingProductItem.reducer,
        SearchMarketplaceProductItem: SearchMarketplaceProductService.getSearchMarketplaceProductItem.fetchReducer,
        SearchMarketplaceProductItems: SearchMarketplaceProductService.getSearchMarketplaceProductItems.fetchReducer,
        SearchMarketplaceProductPage: SearchMarketplaceProductService.getSearchMarketplaceProductPage.paginationReducer,
        SearchMarketplaceProductInfinitePage: SearchMarketplaceProductService.getSearchMarketplaceProductInfinitePage.paginationReducer,
        SearchMarketplaceProductCreateItem: SearchMarketplaceProductService.createSearchMarketplaceProductItem.reducer,
        SearchMarketplaceProductSaveItem: SearchMarketplaceProductService.saveSearchMarketplaceProductItem.reducer,
        AttributeDictionaryValueItem: AttributeDictionaryValueService.getAttributeDictionaryValueItem.fetchReducer,
        AttributeDictionaryValueItems: AttributeDictionaryValueService.getAttributeDictionaryValueItems.fetchReducer,
        AttributeDictionaryValuePage: AttributeDictionaryValueService.getAttributeDictionaryValuePage.paginationReducer,
        AttributeDictionaryValueInfinitePage: AttributeDictionaryValueService.getAttributeDictionaryValueInfinitePage.paginationReducer,
        AttributeDictionaryValueCreateItem: AttributeDictionaryValueService.createAttributeDictionaryValueItem.reducer,
        AttributeDictionaryValueSaveItem: AttributeDictionaryValueService.saveAttributeDictionaryValueItem.reducer,
        SearchImportedProductItem: SearchImportedProductService.getSearchImportedProductItem.fetchReducer,
        SearchImportedProductItems: SearchImportedProductService.getSearchImportedProductItems.fetchReducer,
        SearchImportedProductPage: SearchImportedProductService.getSearchImportedProductPage.paginationReducer,
        SearchImportedProductInfinitePage: SearchImportedProductService.getSearchImportedProductInfinitePage.paginationReducer,
        SearchImportedProductCreateItem: SearchImportedProductService.createSearchImportedProductItem.reducer,
        SearchImportedProductSaveItem: SearchImportedProductService.saveSearchImportedProductItem.reducer,
    };

}

