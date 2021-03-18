import { connect } from 'react-redux';
import { Bantikom } from 'app/common/core/api/proxy';
import {
    GetNextPage
} from 'app/common/core/data/reducers/pagination-reducer-factory';
import { IStateProps, IDispatchProps, IOwnProps } from '../contracts';
import { Lookup } from './Lookup';

const MarketplaceLookupConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemsState: state.odataService.MarketPlacePage
        };
    },
    {
        fetchItems: Bantikom.MarketPlaceService.getMarketPlacePage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.MarketPlaceService.getMarketPlacePage.clear
    }
)(Lookup);

export { MarketplaceLookupConnected as MarketplaceLookup };
