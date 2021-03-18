import * as React from 'react';

export const DataGridLoader = function () {
    return (
        <div className="k-loading-mask">
            <span className="k-loading-text">Loading</span>
            <div className="k-loading-image" />
            <div className="k-loading-color" />
        </div>
    );
}