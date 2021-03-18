import React, { FC } from 'react';
import i18n from 'i18next';

interface IProps {
    onAddCategory(): void
}

const Description: FC<IProps> = ({ onAddCategory }) => (
    <div className="category-chooser-description">
        <p className="description">{ i18n.t('components:category-chooser.choose-category-for-sale-product') }</p>
        <p className="description">
            { i18n.t('components:category-chooser.if-category-not-found') }
            <span
                onClick={onAddCategory}
                className="link"
            >
                { i18n.t('components:category-chooser.ask-to-add') }
            </span>
        </p>
    </div>
)

export default Description;
