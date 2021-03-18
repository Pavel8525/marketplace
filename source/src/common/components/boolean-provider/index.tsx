import React, { FC, ReactElement, ReactNode } from 'react';

const withFragment = (node: ReactNode) => <>{node}</>

interface IProps {
    condition?: any;
}

const Truthy: FC<IProps> = ({ condition, children }) => condition ? withFragment(children) : null;
const Falsy: FC<IProps> = ({ condition, children }) => condition ? null : withFragment(children);

type BooleanProviderInstance = {
    Truthy: FC<IProps>;
    Falsy: FC<IProps>;
} & FC<IProps>

const BooleanProvider: BooleanProviderInstance = ({ children, condition }) => {
    const childMap = React.Children.map(
        children as Array<ReactElement>,
        child => React.cloneElement(child, { condition: Boolean(condition) })
    )
    return withFragment(childMap)
}

BooleanProvider.Truthy = Truthy;
BooleanProvider.Falsy = Falsy;

export { BooleanProvider };


