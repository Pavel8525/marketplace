import React, {FC, useEffect} from 'react';
import {
    autoformFactory,
    FormState,
} from 'app/common/components';
import get from 'lodash/get'
import { getSearchFields } from 'app/common/components/category-chooser/helpers/category-chooser-helper';
import {useSelector} from 'react-redux';
import {RootStore} from 'app/common/reducers';
import { Bantikom } from 'app/common/core/api/proxy';

const FORM_NAME = 'SEARCH_CATEGORY_CHOOSER';

interface IProps {
    onSearch(categoryId: string): void;
    marketplaceKind: Bantikom.MarketplaceKind;
}

const Form = autoformFactory({formName: FORM_NAME}).getForm()

const Search: FC<IProps> = (props) => {
    const formState = useSelector((state: RootStore) => state.form[FORM_NAME]);
    const selectedCategory = get(formState, ['values', 'selectedCategory'])

    useEffect(() => {
        if (selectedCategory) {
            props.onSearch(selectedCategory)
        }
    }, [selectedCategory])

    return (
        <Form
            formState={FormState.creating}
            showSubmitButton={false}
            rows={getSearchFields(props.marketplaceKind)}
        />
    )
}

export default Search;
