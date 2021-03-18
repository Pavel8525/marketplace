import i18n from 'i18next';
import pipe from 'lodash/fp/pipe';
import get from 'lodash/fp/get';
import defaultTo from 'lodash/fp/defaultTo';
import size from 'lodash/fp/size';
import groupBy from 'lodash/fp/groupBy';
import values from 'lodash/fp/values';
import head from 'lodash/head';
import { getGuid } from 'app/common/core/api/odata-helper';
import {
    FieldType,
    FormColumnLayout,
    IField,
    LookupEntityType,
} from 'app/common/components';
import { getCategoryInfo, getCategories } from 'app/common/hooks/use-fetching';
import { makeRequest } from 'app/common/helpers/category-info-helper';
import { Bantikom } from 'app/common/core/api/proxy';

const URL = '/InternalCategory';

export const isLastSubCategoryAsync = async (categoryId: string, marketplaceKind: Bantikom.MarketplaceKind) => {
    const or = [{ ParentId: getGuid(categoryId, 'eq') }];
    const filter = { and: [{ MarketPlaceKind: marketplaceKind }, { or }] }
    const payload = { params: { filter } }
    const result = await getCategories(URL, payload)
    return pipe(
        get(['data', 'value']),
        defaultTo([]),
        size,
        it => !Boolean(it)
    )(result)
}

export const getCategoryInfoById = async (categoryId: string) => {
    const or = [{ Id: getGuid(categoryId, 'eq') }];
    const filter = { and: [{ or }] }
    const result = await getCategoryInfo(URL, makeRequest(filter))
    return pipe(
        get(['data', 'value']),
        defaultTo([]),
        head
    )(result)
}

export const createCategoriesTree = pipe(
    get(['data', 'items']),
    defaultTo([]),
    groupBy(get(['ParentId'])),
    values
)

export const getSearchFields = (marketplaceKind: Bantikom.MarketplaceKind) => [
    {
        fields: [
            {
                name: 'selectedCategory',
                label: i18n.t('product:create.form.category-description'),
                type: FieldType.reference,
                entityType: LookupEntityType.dataProcess,
                textField: 'Name',
                keyField: 'Id',
                initFilter: { MarketPlaceKind: marketplaceKind },
                validate: [],
                uniqueIdentifier: 'category-search',
                classNameContainer: 'col-12',
                dataProcessConfig: {
                    apiUrl: URL,
                    request: makeRequest
                }
            } as IField
        ],
        columntLayout: FormColumnLayout.duet
    }
]
