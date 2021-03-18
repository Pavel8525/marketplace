import { connect } from "react-redux";

import { Bantikom } from 'app/common/core/api/proxy';
import {
    GetNextPage
} from 'app/common/core/data/reducers/pagination-reducer-factory';

import { IStateProps, IDispatchProps, IOwnProps } from "../contracts";
import { Lookup } from "./Lookup";

const ContactLookupConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemsState: state.odataService.ContactPage
        };
    },
    {
        fetchItems: Bantikom.ContactService.getContactPage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.ContactService.getContactPage.clear
    }
)(Lookup);

export { ContactLookupConnected as ContactLookup };