import React, { FC, ReactElement } from 'react';

interface IProps {
    controlName: string,
    children: ReactElement | ReactElement[]
}

const ControlGroup: FC<IProps> = ({ controlName, children }) => (
    <div className="mb-4">
        <header><h3>{controlName}</h3></header>
        {children}
    </div>
)

export default ControlGroup;
