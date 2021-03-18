import React, { FC } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ProductCategory } from '../entities';

interface IProps {
    categories: ProductCategory[];
    onChoose(category: ProductCategory):void;
    selectedCategories: ProductCategory[];
}

const CategoriesList: FC<IProps> = ({ categories, onChoose, selectedCategories }) => {

    const handleSelect = (category: ProductCategory) => () => {
        onChoose(category);
    }

    const isSelected = (category: ProductCategory) => selectedCategories.some(
        it => it.Id === category.Id
    )

    return (
        <div className="categories-list">
            <List component="nav" className="categories-list-nav">
                {
                    categories.map(category => (
                        <ListItem
                            selected={isSelected(category)}
                            className="list-item"
                            button
                            onClick={handleSelect(category)}
                            key={category.Id}
                        >
                            {category.Name}
                            <i className="fal fa-angle-right" />
                        </ListItem>
                    ))
                }
            </List>
        </div>
    )
}

CategoriesList.defaultProps = {
    categories: []
}

export default CategoriesList;
