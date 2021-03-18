import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import classNames from 'classnames';

import 'app/common/components/forms/styles/material-fields.css';

import { ValidationTouched } from '.';
import {
    ProductCategoryLookup,
    BrandLookup,
    ContactLookup,
    AttributeDictionaryValueLookup,
    MultiSelectAttributeDictionaryValueLookup,
    DataProcessLookup,
    ConnectedMarketplaceLookup,
    ProductLookup,
    MarketplaceLookup
} from '../../lookups';
import { LookupEntityType, ILookupFieldProps } from '../..';

import { InfoIcon, Popover, ShowBox } from 'app/common/components';

const LookupField = ({
    name,
    label,
    placeholder,
    classNameInput,
    classNameContainer = "col-6",
    required = false,
    validate,
    disabled,
    textField,
    keyField,
    entityType,
    count,
    initFilter,
    description,
    uniqueIdentifier,
    typeIdString,
    dataProcessConfig,
    fetchOnLoad,
    selectFields,

    onFocus,
    itemRender
}: ILookupFieldProps) => {
    return (
        <div className={classNames(classNameContainer, "mb-3 position-relative")}>
            <Field
                name={name}
                type="text"
                component={renderLookup}
                label={label}
                placeholder={placeholder}
                className={classNameInput}
                validate={validate}
                disabled={disabled}
                textField={textField}
                keyField={keyField}
                required={required}
                entityType={entityType}
                count={count}
                initFilter={initFilter}
                description={description}
                uniqueIdentifier={uniqueIdentifier}
                typeIdString={typeIdString}
                dataProcessConfig={dataProcessConfig}
                fetchOnLoad={fetchOnLoad}
                onFocus={onFocus}
                itemRender={itemRender}
                selectFields={selectFields}
            />
        </div>
    );
}

const renderLookup = ({
    input,
    label,
    placeholder,
    meta,
    className,
    disabled,
    required,
    textField,
    keyField,
    entityType,
    count,
    initFilter,
    description,
    uniqueIdentifier,
    typeIdString,
    dataProcessConfig,
    fetchOnLoad,
    selectFields,

    itemRender
}
    : React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps & ILookupFieldProps) => {

    let Lookup = null;

    switch (entityType) {
        case LookupEntityType.brand: {
            Lookup = BrandLookup;
            break;
        }
        case LookupEntityType.contact: {
            Lookup = ContactLookup;
            break;
        }
        case LookupEntityType.productCategory: {
            Lookup = ProductCategoryLookup;
            break;
        }
        case LookupEntityType.attributeDictionaryValue: {
            Lookup = AttributeDictionaryValueLookup;
            break;
        }
        case LookupEntityType.multiSelectAttributeDictionaryValue: {
            Lookup = MultiSelectAttributeDictionaryValueLookup;
            break;
        }
        case LookupEntityType.dataProcess: {
            Lookup = DataProcessLookup;
            break;
        }
        case LookupEntityType.connectedMarketplace: {
            Lookup = ConnectedMarketplaceLookup;
            break;
        }
        case LookupEntityType.marketplace: {
            Lookup = MarketplaceLookup;
            break;
        }
        case LookupEntityType.product: {
            Lookup = ProductLookup;
            break;
        }
    }

    const onChange = (entity: any) => {
        input.onChange(entity);
    }

    return (
        <>
            <Lookup
                style={{ width: '100%' }}
                placeholder={placeholder}
                label={label as string}
                className={classNames(className, 'material-form-control')}
                disabled={disabled}
                required={required}
                textField={textField}
                keyField={keyField}
                value={input.value}
                count={count}
                initFilter={initFilter}
                uniqueIdentifier={uniqueIdentifier}
                typeIdString={typeIdString}
                dataProcessConfig={dataProcessConfig}
                fetchOnLoad={fetchOnLoad}
                selectFields={selectFields}
                onChange={onChange}
                itemRender={itemRender}
            />
            <ShowBox condition={description}>
                <Popover
                    wrapperStyle={{ top: '24px', right: '-24px' }}
                    wrapperClassName="position-absolute"
                    content={description}
                    useWrapper
                >
                    <InfoIcon />
                </Popover>
            </ShowBox>
            <ValidationTouched {...meta} />
        </>
    );
}

export { LookupField };
