import React, { FC, ReactElement, useState } from 'react';
import { NumericTextBox, NumericTextBoxChangeEvent } from '@progress/kendo-react-inputs';
import { Droppable } from 'react-beautiful-dnd';
import './styles.css';

interface IProps {
    onPageChange(index: number): void;
    items: any[];
    renderItem(item: any, index: number): ReactElement;
    total: number;
    itemPerPage?: number;
    onItemPerPageChange?(value: number): void;
    maxPerPage?: number;
    minPerPage?: number;
    currentPageIndex: number;
}

export const Pagination: FC<IProps> = (props) => {
    const {
        maxPerPage,
        minPerPage = 3,
        itemPerPage = 3,
        onItemPerPageChange,
        items,
        renderItem,
        currentPageIndex,
        total,
        onPageChange
    } = props;

    const [itemPerPageState, setItemPerPageState] = useState(itemPerPage)

    const handleChangeItemPerPage = (event: NumericTextBoxChangeEvent) => {
        setItemPerPageState(event.value)
        onItemPerPageChange(event.value)
        onPageChange(0)
    }

    const onNextPage = () => {
        const maxPageCount = Math.ceil(total / itemPerPage);
        if ((currentPageIndex + 1) < maxPageCount) {
            onPageChange(currentPageIndex + 1)
        }
    }

    const onPrevPage = () => {
        if (currentPageIndex >= 1) {
            onPageChange(currentPageIndex - 1)
        }
    }

    const startIndexByPage = currentPageIndex * itemPerPage + 1;

    const lastIndexByPage = startIndexByPage + items.length - 2;

    return (
        <div className="pagination-component-container">
            <Droppable droppableId="droppable" direction="horizontal">
                { (provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="pagination-component-content"
                    >
                        { items.map((it, index) => renderItem(it, index)) }
                    </div>
                ) }
            </Droppable>

            <footer className="pagination-controller-container">
                <p>Строк на странице</p>
                <NumericTextBox
                    width={50}
                    value={itemPerPageState}
                    min={minPerPage}
                    max={maxPerPage}
                    onChange={handleChangeItemPerPage}
                />
                <p>{total ? startIndexByPage : 0}-{lastIndexByPage} из {total}</p>

                <i className="fal fa-chevron-left" onClick={onPrevPage} />
                <i className="fal fa-chevron-right" onClick={onNextPage} />
            </footer>
        </div>
    )
}
