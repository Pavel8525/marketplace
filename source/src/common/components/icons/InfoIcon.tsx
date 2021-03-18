import React, {FC} from "react";
import {PositionProperty} from 'csstype';

interface IProps {
    position?: PositionProperty;
}

export const InfoIcon: FC<IProps> = ({position = 'initial'}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Info Outline"
         style={{height: '24px', fill: '#886ab5', position}}>
        <path
            d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"></path>
    </svg>
);
