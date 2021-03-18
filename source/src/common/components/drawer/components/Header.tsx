import React, { FC, ReactNode } from 'react';

interface IProps {
    children: ReactNode;
}

const Header: FC<IProps> = ({ children }) => (
    <header className="drawer-header-wrapper">
        { children }
    </header>
)

export default Header;
