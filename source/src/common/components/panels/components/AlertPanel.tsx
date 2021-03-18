import * as React from 'react';
import { RawHtml } from "../../common/RawHtml"
import { FC } from 'react';

interface IProps {
    message: string;
    type?: 'success' | 'info' | 'secondary' | 'warning' | 'danger';
}

const AlertPanel: FC<IProps> = ({ message, type = 'info' }) => (
    <div className="panel-content d-flex flex-row align-items-center">
        <div className={`alert alert-${type} w-100`} role="alert">
            <RawHtml content={message} />
        </div>
    </div>
)

export {
    AlertPanel
};
