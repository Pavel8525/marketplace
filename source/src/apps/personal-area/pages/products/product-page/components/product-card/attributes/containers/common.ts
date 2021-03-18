import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { any } from "underscore";

import {
    FieldType,
    IField,
    IFormRow,
    FieldControl,
    RequiredField,
    FormColumnLayout,
    LookupEntityType
} from "app/common/components";
import { IOverrideProduct } from "app/common/core/api/proxy-ext";
import { Bantikom } from "app/common/core/api/proxy";
import { Clear, Fetch, IFetchState, InvokeSpecificUrl } from "app/common/core/data";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { getOrAddAsyncReducer } from 'app/common/core/store/configure';
import { IStoreState } from "app/common/core";

import { AttributesFilterEnum } from "../contracts";
import { convertToObject } from "../helpers/attributes-helper";
import {
    IStateProps,
    IDispatchProps,
    AttributesForm,
    getAttributesFilterFormName,
    IOwnProps
} from "../components/AttributesForm";
import { productCardFetchReducerCreator, productCardStoreReducerCreator } from "../../common";


export enum FieldKindEnum {
    Decimal = "Decimal",
    Integer = "Integer",
    String = "String",
    Boolean = "Boolean",
    URL = "URL",
    ImageURL = "ImageURL"
}

function getFieldType(kind: FieldKindEnum): FieldType {
    switch (kind) {
        case FieldKindEnum.Decimal:
        case FieldKindEnum.Integer: {
            return FieldType.number;
        }
        case FieldKindEnum.Boolean: {
            return FieldType.boolean;
        }
        default: return FieldType.string;
    }
}

function getFieldControl(kind: FieldKindEnum): FieldControl {
    switch (kind) {
        case FieldKindEnum.Decimal:
        case FieldKindEnum.Integer: {
            return FieldControl.number;
        }
        case FieldKindEnum.Boolean: {
            return FieldControl.switch;
        }
        default: return FieldControl.materialText;
    }
}

const getOverrideFormRows = (
    item: IOverrideProduct,
    marketplaceKind: Bantikom.MarketplaceKind,
    product: IFetchState<ISingleODataResponse<Bantikom.Product>>,
    attributesFilterFormState: { AttributesFilter: AttributesFilterEnum }
): IFormRow[] => {

    if (!(product.data && product.data.item && product.data.item.Category && any(product.data.item.Category.Attributes))) {
        return null;
    }

    const formRows = product.data.item.Category.Attributes.map((attribute: Bantikom.CategoryAttribute) => {

        const fieldOptions = attribute.Options;
        if (fieldOptions && fieldOptions.HideInAttibutesForm === true) {
            return null;
        }
        var attributeCode = `code_${attribute.Code}`;

        if (attributesFilterFormState && attributesFilterFormState.AttributesFilter && attributesFilterFormState.AttributesFilter !== AttributesFilterEnum.All) {
            if (attributesFilterFormState.AttributesFilter === AttributesFilterEnum.Required && attribute.IsRequired === false) {
                return null;
            }

            if (attributesFilterFormState.AttributesFilter === AttributesFilterEnum.NotRequired && attribute.IsRequired === true) {
                return null;
            }

            var attributes = convertToObject(product.data.item.Attributes);

            if (attributesFilterFormState.AttributesFilter === AttributesFilterEnum.Empty && attributes[attributeCode]) {
                return null;
            }

            if (attributesFilterFormState.AttributesFilter === AttributesFilterEnum.Filled && !attributes[attributeCode]) {
                return null;
            }

            if (attributesFilterFormState.AttributesFilter === AttributesFilterEnum.Bad) {
                return null;
            }
        }

        let type = getFieldType(attribute.Kind as FieldKindEnum);
        let control = fieldOptions && fieldOptions.ControlType || getFieldControl(attribute.Kind as FieldKindEnum);
        const validate = [];

        if (attribute.IsRequired) {
            validate.push(RequiredField);
        }
        let entityType: LookupEntityType = null;
        let textField: string = null;
        let keyField: string = null;
        let initFilter: {} = null;
        let uniqueIdentifier: string = null;

        if (attribute.DictionaryId) {
            type = FieldType.reference;
            entityType = attribute.IsCollection ? LookupEntityType.multiSelectAttributeDictionaryValue : LookupEntityType.attributeDictionaryValue;
            textField = 'Name';
            keyField = 'Id';
            initFilter = {
                MarketplaceKind: marketplaceKind,
                DictionaryId: attribute.DictionaryId,
                CategoryId: product.data.item.Category.Code,
                AttributeId: attribute.Code
            };
            uniqueIdentifier = attribute.Code;
        }

        return {
            fields: [
                {
                    name: attributeCode,
                    label: attribute.Name,
                    required: attribute.IsRequired,
                    type,
                    control,
                    validate,
                    description: attribute.Description,
                    entityType,
                    textField,
                    keyField,
                    initFilter,
                    uniqueIdentifier,
                    typeIdString: true
                } as IField
            ],
            columntLayout: FormColumnLayout.trio
        }
    });

    return formRows.filter(row => row !== null);
}

const createAttributesForm = (formName: string, marketplaceKind: Bantikom.MarketplaceKind) => {
    const getKey = (operation: string, itemId: string) => `${operation}:${marketplaceKind}:${itemId}`;

    const ConnectedAttributesForm = connect<IStateProps, IDispatchProps>(
        (state: IStoreState, props: IOwnProps) => {
            const formItem = state.form[formName] && state.form[formName].values;
            const attributesFilterFormName = getAttributesFilterFormName(formName);
            const attributesFilterFormState = state.form[attributesFilterFormName] && state.form[attributesFilterFormName].values;
            const reducerKey = getKey('fetch', props.itemId);
            const itemState = state.odataService[reducerKey] || getOrAddAsyncReducer(reducerKey, productCardFetchReducerCreator).fetchReducer;

            return {
                itemState,
                rows: getOverrideFormRows(
                    formItem,
                    marketplaceKind,
                    itemState,
                    attributesFilterFormState)
            };
        },
        (dispatch: any, props: IOwnProps): IDispatchProps => {
            const reducerKey = getKey('fetch', props.itemId);

            return {
                fetchProductItem: bindActionCreators(getOrAddAsyncReducer(reducerKey, productCardFetchReducerCreator).fetch as Fetch<{}>, dispatch),
                saveItem: bindActionCreators(getOrAddAsyncReducer(getKey('invoke', props.itemId), productCardStoreReducerCreator).invoke as InvokeSpecificUrl<{}, {}>, dispatch),
                updateLocallyItem: bindActionCreators(getOrAddAsyncReducer(reducerKey, productCardFetchReducerCreator).updateLocally, dispatch),
                clear: bindActionCreators(getOrAddAsyncReducer(reducerKey, productCardFetchReducerCreator).clear as Clear, dispatch)
            };
        }
    )(AttributesForm);

    return ConnectedAttributesForm;
}


export {
    getOverrideFormRows,
    createAttributesForm
};
