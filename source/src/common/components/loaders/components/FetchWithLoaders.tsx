import { FORBIDDEN } from 'http-status-codes';
import * as React from 'react';

import { IFetchable } from 'app/common/core/data';
import { IFetchState } from 'app/common/core/data/reducers/fetch-reducer-factory';

import { ErrorLoading } from './ErrorLoading';
import { Loading } from './Loading';

interface IProps {
    fetchStates: (IFetchable & Partial<Pick<IFetchState<any>, 'error' | 'data'>>)[];
    showLoadingOnFirstLoad?: boolean;
}

export class FetchWithLoaders<T> extends React.Component<IProps> {
    public render() {
        const {
            fetchStates,
            showLoadingOnFirstLoad,
            children
        } = this.props;

        if (fetchStates.find(x => x.failed)) {
            if (fetchStates.find(x => x.error && x.error.status === FORBIDDEN)) {
                return null;
            } else {
                return <ErrorLoading />;
            }
        }

        if (showLoadingOnFirstLoad) {
            if (fetchStates.find(x => x.fetching && x.data === null)) {
                return <Loading />;
            }
        } else {
            if (fetchStates.find(x => x.fetching || x.data === null)) {
                return <Loading />;
            }
        }

        return children;
    }
}
