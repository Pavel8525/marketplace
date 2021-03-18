import React, { FC, ReactElement } from 'react';

interface IProps {
    condition: any;
    children: ReactElement;
}

export const ShowBox: FC<IProps> = ({ condition, children }) => Boolean(condition) ? children : null;
