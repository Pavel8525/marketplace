import '../styles/chip-list.css';

import * as React from 'react';
import i18n from 'app/common/core/translation/i18n';
import { GridCellProps, GridColumn } from '@progress/kendo-react-grid';
import { Chip, ChipList } from '@progress/kendo-react-buttons';

import { any } from 'app/common/helpers/array-helper';

import { DataGrid } from '../../data-grid';
import { autoformFactory, Button, FormState, Panel } from '../..';
import { IDispatchProps, IStateProps, IOwnProps, OperationChangeReference } from '../contracts';
import { Bantikom } from 'app/common/core/api/proxy';
import { Guid } from 'app/common/helpers/string-helper';

const LOOKUP_CHOOSER_FORM = 'LOOKUP_CHOOSER_FORM';

type AddItemCellProps = {
    onSelect: (dataItem: any) => void,
    commandAddButtonTitle?: string,
    commandRemoveButtonTitle?: string,
    operation: OperationChangeReference
} & GridCellProps;

const CommandButtonItemCell = (props: AddItemCellProps) => {
    const {
        commandAddButtonTitle = i18n.t("components:lookup-chooser.add"),
        commandRemoveButtonTitle = i18n.t("components:lookup-chooser.remove"),
        onSelect
    } = props;

    const buttonOnClick = () => {
        if (onSelect) {
            onSelect(props.dataItem)
        }
    }

    const disabled = props.dataItem['__DISABLED__'];

    return (
        <td className="number-task-column" style={{ padding: '8px' }}>
            <Button
                name={props.operation == OperationChangeReference.add ? commandAddButtonTitle : commandRemoveButtonTitle}
                buttonOnClick={buttonOnClick}
                disabled={disabled}
            />
        </td>
    );
}

interface IState {
    selectedItems: {}[];
}

type IProps<T> = IOwnProps & IDispatchProps & IStateProps<T>;

class LookupChooser<T> extends React.Component<IProps<T>, IState> {
    private gridRef = React.createRef<DataGrid>();
    private form: any;

    static getDerivedStateFromProps<T>(props: IProps<T>, state: IState): IState {
        type itemType = T & { Id: string };

        if (props.items && any(props.items.items)) {
            props.items.items.forEach((item: itemType) => {

                switch (props.selectKind) {
                    case 'multiple': {
                        const foundItem = state.selectedItems.find((selectedItem: itemType) => selectedItem.Id === item.Id);
                        if (foundItem) {
                            (item as any)['__DISABLED__'] = true;
                        } else {
                            delete (item as any)['__DISABLED__'];
                        }

                        break;
                    }
                    case 'single': {
                        if (any(state.selectedItems)) {
                            (item as any)['__DISABLED__'] = true;
                        } else {
                            delete (item as any)['__DISABLED__'];
                        }
                    }
                }
            });
        }

        return {
            ...state
        }
    }

    constructor(props: IProps<T>) {
        super(props);

        this.state = {
            selectedItems: []
        }

        this.form = autoformFactory({
            formName: LOOKUP_CHOOSER_FORM
        }).getForm();
    }

    public render() {
        const { selectedItems } = this.state;
        const {
            id,
            request,
            columns,
            operation,
            commandAddButtonTitle,
            commandRemoveButtonTitle,
            fetchItems,
            onClose
        } = this.props;

        return (
            <>
                <Panel
                    uniqueIdentifier={`panel-founded-items-${id}`}
                    canClose={false}
                    canCollapse={false}
                    hidePadding={true}
                    showHeader={true}
                    title={i18n.t("components:lookup-chooser.founded-items")}
                >
                    <DataGrid
                        id={id}
                        ref={this.gridRef}
                        request={request}
                        fetchItems={fetchItems}
                        items={this.props.items}
                        initSort={[{ field: 'LastModificationDate', dir: 'desc' }]}
                        height={400}
                    >
                        <GridColumn
                            width={100}
                            cell={(props) =>
                                <CommandButtonItemCell
                                    {...props}
                                    onSelect={this.onSelectItem}
                                    operation={operation}
                                    commandAddButtonTitle={commandAddButtonTitle}
                                    commandRemoveButtonTitle={commandRemoveButtonTitle}
                                />}
                            filterable={false}
                            sortable={false}
                        />

                        {React.Children.map(columns, (column: JSX.Element, idx) => React.cloneElement(column, { ref: idx }))}

                    </DataGrid>
                </Panel>

                {any(selectedItems) && (
                    <Panel
                        uniqueIdentifier={`panel-selected-items-${id}`}
                        canClose={false}
                        canCollapse={false}
                        canMaximize={false}
                        showHeader={true}
                        hidePadding={false}
                        title={i18n.t("components:lookup-chooser.selected-items")}
                    >
                        <ChipList
                            selection="none"
                            data={selectedItems}
                            textField="Name"
                            valueField="Id"
                            chip={(props) =>
                                <Chip {...props} removable={true} onRemove={() => this.onUnselectItem(props.dataItem)} />
                            }
                        />

                        <this.form
                            formState={FormState.creating}
                            renderRows={false}
                            onSubmit={this.onSave}
                            submitTitle={i18n.t('product:import-product.drawer.confirm')}
                            disableCheckDirty={true}
                            showCancelButton={true}
                            cancelButtonTitle={i18n.t("components:lookup-chooser.cancel")}
                            onClickCancelButton={onClose}
                        />

                    </Panel>
                )}

            </>
        );
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private onSelectItem = (item: {}) => {
        this.setState(() => ({
            selectedItems: [...this.state.selectedItems, item]
        }));
    }

    private onUnselectItem = (item: {}) => {
        this.setState(() => ({
            selectedItems: [...this.state.selectedItems.filter(i => i !== item)]
        }));
    }

    private onSave = () => {
        if (this.props.onSave) {
            return this.props.onSave(this.state.selectedItems);
        }

        if (!any(this.state.selectedItems)) {
            return new Promise<{}>((resolve) => resolve(null));
        }

        const {
            entityId,
            entityName,
            relatedEntityName,
            navigationProperty,
            operation,
            changeRefs,
            onSuccess,
            onClose
        } = this.props;

        type itemType = T & { Id: string };

        const request: Bantikom.ChangeEntityReferenceListRequest = {
            Id: Guid.newGuid(),
            RelatedEntities: this.state.selectedItems.map((item: itemType) => ({
                EntityId: item.Id,
                EntityName: relatedEntityName
            })),
            NavigationProperty: navigationProperty,
            Added: operation == OperationChangeReference.add
        };

        const promise = changeRefs(
            { request },
            entityId,
            { func: `ChangeRefs` }
        );

        promise.then(() => {
            if (onSuccess) {
                onSuccess();
                onClose();
            }
        });
        return promise;
    }
}

export { LookupChooser };
