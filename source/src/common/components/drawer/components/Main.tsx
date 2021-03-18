import React, { FC, ReactNode } from 'react';

interface IProps {
    children: ReactNode;
}

const Main: FC<IProps> = ({ children }) => (
    <section className="drawer-main">
        { children }
    </section>
)

export default Main;
