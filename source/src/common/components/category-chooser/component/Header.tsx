import React, { FC } from 'react';
import i18n from 'i18next';

export interface IProps {

}

const Header: FC<IProps> = () => (
    <header>
        <h2 className="category-chooser-headline">
            { i18n.t('components:category-chooser.headline') }
        </h2>
    </header>
);

export default Header;
