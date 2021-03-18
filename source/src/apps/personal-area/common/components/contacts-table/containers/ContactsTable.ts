import { connect } from "react-redux";

import { Bantikom } from 'app/common/core/api/proxy';
import {
    GetNextPage,
    SetFilter,
    SetPrepareResponse
} from 'app/common/core/data/reducers/pagination-reducer-factory';

import { ContactsTable, IStateProps, IDispatchProps, IOwnProps } from "../components/ContactsTable";

const ContactsTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService.ContactPage
        };
    },
    {
        setFilterItems: Bantikom.ContactService.getContactPage.setFilter as SetFilter<{}>,
        setPrepareResponseSchemes: Bantikom.ContactService.getContactPage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchItems: Bantikom.ContactService.getContactPage.getNextPage as GetNextPage<{}>
    }
)(ContactsTable);

export { ContactsTableConnected as ContactsTable };