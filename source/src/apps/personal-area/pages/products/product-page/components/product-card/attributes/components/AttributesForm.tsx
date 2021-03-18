import * as React from 'react';
import i18n from 'i18next';

import { Bantikom } from 'app/common/core/api/proxy';
import {
    IFormRow,
    autoformFactory,
    FormState,
    Panel,
    FetchWithLoader, ISelectOption, IField, FormColumnLayout, FieldType, FieldControl
} from 'app/common/components';
import { IFetchState, InvokeSpecificUrl, Fetch, Clear } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { convertToObject, convertToString } from '../helpers/attributes-helper';
import { getEnumAttributesFormFilter } from 'app/common/core/api/enum-source';
import { AttributesFilterEnum } from '../contracts';

const getAttributesFilterFormName = (formName: string) => `ATTRIBUTES_FILTER_FORM_${formName}`;

const getFilerFormRows = (options: ISelectOption[]): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'AttributesFilter',
                    label: i18n.t('product:card.attributes.form-filter'),
                    type: FieldType.enum,
                    control: FieldControl.materialDropDown,
                    options,
                    keyField: 'value',
                    textField: 'name'
                } as IField
            ],
            columntLayout: FormColumnLayout.trio
        }
    ];

    return rows;
}

interface IStateProps {
    itemState: IFetchState<ISingleODataResponse<Bantikom.Product>>;
    rows?: IFormRow[];
}

interface IDispatchProps {
    fetchProductItem: Fetch<{}>;
    saveItem: InvokeSpecificUrl<{}, {}>;
    updateLocallyItem: (data: any) => void;
    clear: Clear;
}

interface IOwnProps {
    request: {};
    formName: string;
    itemId?: string;
}

interface IState {
    item?: Bantikom.Product;
    attributes?: {};
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class AttributesForm extends React.Component<IProps, IState> {
    private form: any;
    private filterForm: any;
    private filterFormRows: IFormRow[];
    private enumAttributesFilter: ISelectOption[] = getEnumAttributesFormFilter();
    private defaultAttributesFilter: ISelectOption = getEnumAttributesFormFilter().find((item) => item.value === AttributesFilterEnum.Required);


    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        return {
            ...state,
            item: props.itemState.data && props.itemState.data.item,
            attributes: props.itemState.data && (props.itemState.data.item.Attributes && convertToObject(props.itemState.data.item.Attributes))
        }
    }

    constructor(props: IProps) {
        super(props);

        this.state = {
            attributes: null
        };

        this.form = autoformFactory({
            formName: props.formName,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm();

        this.filterFormRows = getFilerFormRows(this.enumAttributesFilter);
        this.filterForm = autoformFactory({
            formName: getAttributesFilterFormName(props.formName),
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm();
    }

    public render() {
        const { itemState, rows } = this.props;
        const { attributes } = this.state;

        if (itemState.data && itemState.data.item && !itemState.data.item.CategoryId) {
            return null;
        }

        return (
            <FetchWithLoader fetchState={itemState}>
                <Panel
                    uniqueIdentifier="attributes-form-panel"
                    showHeader={true}
                    showIcon={true}
                    title={i18n.t(`product:card.attributes.title`)}
                >
                    <>
                        <this.filterForm
                            initialValues={{ AttributesFilter: this.defaultAttributesFilter.value }}
                            rows={this.filterFormRows}
                            showSubmitButton={false}
                        />

                        <div className="border-faded border-left-0 border-right-0 border-bottom-0 flex-row"></div>

                        <this.form
                            formState={FormState.editing}
                            initialValues={{ ...attributes }}
                            rows={rows}
                            onSubmit={this.saveItem}
                            submitTitle={i18n.t("components:autoform.submit.editing")}
                        />
                    </>

                </Panel>
            </FetchWithLoader>
        );
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private saveItem = (item: {}): Promise<{}> => {
        if (item) {
            return this.props.saveItem({ Attributes: convertToString(item) }, this.state.item.Id, { ...this.props.request });
        }

        return new Promise<{}>((resolve) => resolve(this.props.itemState.data));
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.Product>) => {
        this.props.updateLocallyItem(response);
    }
}

export {
    getAttributesFilterFormName,

    IOwnProps,
    IDispatchProps,
    IStateProps,
    AttributesForm
};