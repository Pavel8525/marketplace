import * as React from 'react';
import i18n from 'i18next';

import { Bantikom } from 'app/common/core/api/proxy';
import {
    IFormRow,
    autoformFactory,
    FormState,
    Panel,
    FetchWithLoader,
    forwardLookupValue,
    backwardLookupValue
} from 'app/common/components';
import { IFetchState, InvokeSpecificUrl, Fetch, Clear } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { getDelta } from 'app/common/helpers/object-helper';

interface IValidationResult {
    Weight?: string;
    Long?: string;
    Width?: string;
    Height?: string;
}

const validate = (product: Bantikom.Product) => {
    const result: IValidationResult = {};
    return result;
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
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class CommonOptionsForm extends React.Component<IProps, IState> {
    private form: any;

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        return {
            ...state,
            item: props.itemState.data && forwardLookupValue(props.itemState.data.item, props.rows)
        }
    }

    constructor(props: IProps) {
        super(props);

        this.state = {
            item: null
        };

        this.form = autoformFactory({
            formName: props.formName,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm()
    }

    public render() {
        const { itemState, rows } = this.props;
        const { item } = this.state;

        return (
            <FetchWithLoader fetchState={itemState}>
                <Panel
                    uniqueIdentifier="common-options-form-panel"
                    showHeader={true}
                    showIcon={true}
                    title={i18n.t(`product:card.common-options-form.title`)}
                >
                    <this.form
                        formState={FormState.editing}
                        initialValues={{ ...item }}
                        rows={rows}
                        onSubmit={this.saveItem}
                        validate={validate}
                        submitTitle={i18n.t("components:autoform.submit.editing")}
                    />
                </Panel>
            </FetchWithLoader>
        );
    }

    public componentDidMount() {
        this.fetchItem();
    }

    public componentDidUpdate(prevProps: IProps) {
        if (this.props.itemId != prevProps.itemId) {
            console.log('change product');
            this.fetchItem();
        }
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private fetchItem() {
        if (this.props.itemId) {
            this.props.fetchProductItem({ key: this.props.itemId, ...this.props.request });
        }
    }

    private saveItem = (item: Bantikom.Product): Promise<{}> => {
        const delta = backwardLookupValue(getDelta(this.state.item, item), this.props.rows);

        if (delta) {
            return this.props.saveItem(delta, item.Id, { ...this.props.request });
        }

        return new Promise<{}>((resolve) => resolve(this.props.itemState.data));
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.Product>) => {
        this.props.updateLocallyItem(response);
    }
}

export {
    IOwnProps,
    IDispatchProps,
    IStateProps,
    CommonOptionsForm
};