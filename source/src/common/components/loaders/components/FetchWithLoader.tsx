import { FORBIDDEN } from 'http-status-codes';
import * as React from 'react';

import { IFetchable } from 'app/common/core/data';
import { IFetchState } from 'app/common/core/data/reducers/fetch-reducer-factory';

import { ErrorLoading } from './ErrorLoading';
import { Loading } from './Loading';

interface IProps<T> {
    fetchState: IFetchable & Partial<Pick<IFetchState<T>, 'error' | 'data'>>;
    showLoadingOnFirstLoad?: boolean;
    text?: string;
    forbidden?: () => JSX.Element;
    loader?: React.ComponentType;
}

export class FetchWithLoader<T> extends React.Component<IProps<T>> {
    public render() {
        const {
            fetchState,
            showLoadingOnFirstLoad,
            children,
            text,
            forbidden,
            loader
        } = this.props;

        const Forbidden = forbidden;
        const Loader = loader;
        
        if (fetchState.failed) {
            if (fetchState.error && fetchState.error.status === FORBIDDEN) {
                return Forbidden
                    ? <Forbidden />
                    : null;
            } else {
                return <ErrorLoading />;
            }
        }

        if (showLoadingOnFirstLoad) {
            if (fetchState.fetching && fetchState.data === null) {
                return (loader ? <Loader /> : <Loading text={text} />);
            }
        } else {
            if (fetchState.fetching || fetchState.data === null) {
                return (loader ? <Loader /> : <Loading text={text} />);
            }
        }
        return children;
    }
}
