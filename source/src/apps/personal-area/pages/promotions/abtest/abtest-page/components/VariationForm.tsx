import * as React from 'react';
import i18n from 'app/common/core/translation/i18n';

import { AbTestVariation } from 'app/common/core/api/proxy-ext';
import {
    autoformFactory,
    Button,
    FetchWithLoader,
    FieldControl,
    FieldType,
    FormColumnLayout,
    IField,
    IFormRow,
    MaxLengthLongField,
    RequiredField
} from 'app/common/components';
import { getDelta } from 'app/common/helpers/object-helper';
import { IEnvironmentSettings } from 'app/common/contracts';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import {
    Clear,
    Fetch,
    IFetchState,
    InvokeSpecificUrl
} from 'app/common/core/data';

const getCommonFormRows = (): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'Name',
                    label: i18n.t('abtest:designed.variation.name'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    required: true,
                    validate: [RequiredField, MaxLengthLongField]
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        }
    ];

    return rows;
}

const getTitleFormRows = (): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'SubjectValue',
                    label: i18n.t('abtest:designed.subjects.Title.subject-value'),
                    description: i18n.t('abtest:designed.subjects.Title.subject-value-description'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    required: true,
                    validate: [RequiredField, MaxLengthLongField]
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        }
    ];

    return rows;
}
interface IDispatchProps {
    fetchItem: Fetch<{}>;
    saveItem: InvokeSpecificUrl<{}, {}>;
    updateLocallyItem: (data: any) => void;
    clear: Clear;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    itemState: IFetchState<ISingleODataResponse<AbTestVariation>>;
}
interface IState {

}

interface IOwnProps {
    title: string;
    initItem: AbTestVariation;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class VariationForm extends React.Component<IProps, IState> {
    private rows: IFormRow[];
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

        const { initItem } = this.props;
        const { Id } = initItem;
        let rows: IFormRow[];

        switch (initItem.Subject) {
            case 'Title': {
                rows = [...getCommonFormRows(), ...getTitleFormRows()];
                break;
            }
            case 'Description': {
                break;
            }
        }
        this.rows = rows;

        this.form = autoformFactory({
            formName: `VARIATION_FORM_FOR_${Id.toUpperCase()}`,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm();
    }

    public render() {
        const { itemState } = this.props;
        const { title } = this.props;
        const item = itemState.data && itemState.data.item;
        const rightButtons: React.ReactNode[] = item && item.Kind === 'Test' ? [
            <Button
                name={i18n.t("abtest:variation-form.buttons.delete")}
                buttonOnClick={this.onDeleteItem}
                dontSubmitButton={true}
                className="btn-light ml-auto margin-5"
            />
        ] : [];

        return (
            <FetchWithLoader fetchState={itemState}>
                <>
                    <div style={{ background: item && item.Color }}>
                        <h3>{title}</h3>

                        {item && (
                            <this.form
                                rows={this.rows}
                                onSubmit={this.saveItem}
                                initialValues={{ ...item }}
                                submitTitle={i18n.t("abtest:variation-form.buttons.save")}
                                rightButtons={rightButtons}
                            />
                        )}

                    </div>
                    <hr />
                </>
            </FetchWithLoader>
        )
    }

    public componentDidMount() {
        this.props.fetchItem({ key: this.props.initItem.Id });
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private saveItem = (item: AbTestVariation): Promise<{}> => {
        const delta = getDelta(this.props.initItem, item);
        return this.props.saveItem(delta, item.Id);
    }

    private onDeleteItem = () => {
        //TODO implemented
    }

    private onSumbitSuccess = (response: ISingleODataResponse<AbTestVariation>) => {
        this.props.updateLocallyItem(response);
    }

}

export {
    IOwnProps,
    IStateProps,
    IDispatchProps,
    VariationForm
};
