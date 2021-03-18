import *  as React from 'react';
import { GridDetailRow, GridDetailRowProps } from '@progress/kendo-react-grid';

import { Panel } from 'app/common/components';
import { ObservationProductKeywordsTable } from '../observation-product-keywords-table';


class KeywordRowDetail extends GridDetailRow {

    constructor(props: GridDetailRowProps) {
        super(props);

        this.id = `keyword-row-detail:${props.dataItem.Id}`
    }

    id: string;

    render() {
        const dataItem = this.props.dataItem;
        return (
            <section>
                <Panel
                    uniqueIdentifier={this.id}
                    headerPortalId={`${this.id}:header-portal`}
                >
                    <ObservationProductKeywordsTable
                        observationProductId={dataItem.Id}
                        toolbarPortalName={`${this.id}:header-portal`}
                    />
                </Panel>
            </section>
        );
    }
}

export {
    KeywordRowDetail
};