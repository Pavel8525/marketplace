import React, {FC, useEffect, useState} from 'react';
import i18n from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getGuid } from 'app/common/core/api/odata-helper';
import { RootStore } from 'app/common/reducers';
import CategoriesList from './component/CategoriesList';
import Description from './component/Description';
import Search from './component/Search';
import Header from './component/Header';
import { ProductCategory, CategoryChooserStatic } from './entities';
import { Bantikom } from 'app/common/core/api/proxy';
import { isLastSubCategoryAsync, createCategoriesTree, getCategoryInfoById } from 'app/common/components/category-chooser/helpers/category-chooser-helper';
import { FetchWithLoader, Button } from 'app/common/components';
import { indexingCycle } from 'app/common/helpers/array-helper';
import './styles.css'

const { fetch: fetchListCategories, clear } = Bantikom.InternalCategoryService.getInternalCategoryItems;

interface IProps {
    onChoose(category: ProductCategory): void;
    numberOfColumns?: number;
    marketplaceKind: Bantikom.MarketplaceKind;
}

const CategoryChooser: FC<IProps> & CategoryChooserStatic = ({ onChoose, numberOfColumns, marketplaceKind }) => {
    const [tree, setTree] = useState([null])
    const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
    const [isSelected, setIsSelected] = useState(false);
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootStore) => state.odataService.InternalCategoryItems);

    const columnWidth = 240;
    const columns = createCategoriesTree(categoryState);

    const onChooseCategory = (columnIndex: number) => async (category: ProductCategory) => {
        const newTree = [...tree].slice(0, columnIndex + 1)
        const newSelectedCategories = [...selectedCategories].slice(0, columnIndex)
        setTree([...newTree, category.Id])
        setSelectedCategories([...newSelectedCategories, category])
        const isLast = await isLastSubCategoryAsync(category.Id, marketplaceKind);
        setIsSelected(isLast)
    }

    const handleChoose = () => {
        onChoose(selectedCategories[selectedCategories.length - 1])
    }

    const fetchCategories = (ids: string[]) => {
        const or = ids.map(id => [{ ParentId:  getGuid(id, 'eq')}]);
        const filter = { and: [{ MarketPlaceKind: marketplaceKind }, { or }] }
        dispatch(fetchListCategories({ filter }))
    }

    const onAddCategory = () => {

    }

    const onSearch = async (categoryId: string) => {
        const categoryInfo = await getCategoryInfoById(categoryId);
        onChoose(categoryInfo)
    }

    const createColumn = (index: number) => (
        <CategoriesList
            selectedCategories={selectedCategories}
            categories={columns[index]}
            onChoose={onChooseCategory(index)}
            key={index}
        />
    )

    useEffect(() => {
        fetchCategories(tree)
        return clear
    }, [tree])

    const categoriesTree = indexingCycle(numberOfColumns, createColumn)

    return (
        <div className="categories-chooser-page" style={{ width: columnWidth * numberOfColumns }}>
            <Description onAddCategory={onAddCategory}/>
            <Search marketplaceKind={marketplaceKind} onSearch={onSearch} />
            <div className="categories-chooser-wrapper">
                <FetchWithLoader fetchState={categoryState}>
                    {categoriesTree}
                </FetchWithLoader>
            </div>
            <footer className="categories-chooser-page-footer">
                <Button
                    showName
                    name={i18n.t('components:category-chooser.confirm')}
                    className="btn-primary apply-btn"
                    buttonOnClick={handleChoose}
                    disabled={!isSelected}
                />
            </footer>
        </div>
    )
}

CategoryChooser.defaultProps = {
    numberOfColumns: 3
}

CategoryChooser.Header = Header;

export { CategoryChooser, ProductCategory }
