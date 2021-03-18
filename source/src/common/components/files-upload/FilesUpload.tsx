import React, { FC, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import FilePicker from './components/FilePicker';
import FilePreview from './components/FilePreview';
import { Pagination } from './components/Pagination';
import { DropEvent, FileRejection } from 'react-dropzone';
import { ShowBox } from 'app/common/components';
import { reorder, Reorder, getImageMetaData } from './FilesUpload.utility';

const ITEM_PER_PAGE = 3;

export interface ChangePositionEvent {
    sourceIndex: number;
    destinationIndex: number;
}

interface IProps {
    files: File[];
    onFileUpload(file: File): void;
    onDelete(file: File): void;
    accept?: string | string[];
    disabled?: boolean;
    maxSize?: number;
    minSize?: number;
    onDropRejected?(fileRejections: FileRejection[], event?: DropEvent): void
    onChangePosition?(event: ChangePositionEvent): void;
    isDragDisabled?: boolean;
    maxWidth?: number;
    maxHeight?: number;
}

export const FilesUpload: FC<IProps> & { reorder: Reorder } = ({
    files,
    onFileUpload,
    onDelete,
    accept,
    maxSize,
    minSize,
    disabled,
    onDropRejected,
    onChangePosition,
    isDragDisabled,
    maxHeight,
    maxWidth
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(ITEM_PER_PAGE);
    const [isDraggableActive, setIsDraggableActive] = useState(false)

    const renderUploadFileComponent = () => (
        <ShowBox condition={!isDraggableActive}>
            <FilePicker
                onDropRejected={onDropRejected}
                maxSize={maxSize}
                minSize={minSize}
                disabled={disabled}
                accept={accept}
                onPick={handleFileUpload}
                key={Math.random()}
            />
        </ShowBox>
    )

    const startItemIndex = (currentPage * itemPerPage) < files.length ? currentPage * itemPerPage : 0
    const itemsToRender = [...files.slice(startItemIndex, startItemIndex + itemPerPage), renderUploadFileComponent]

    const onPageChange = (pageIndex: number) => {
        setCurrentPage(pageIndex)
    }

    const onFileDelete = (file: File) => () => {
        const isLastFile = itemsToRender.length - 1 === 1;
        onDelete(file);
        if (isLastFile && currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    const onDragEnd = (event: DropResult) => {
        if (!event.destination || !onChangePosition) return;
        const sourceIndex = currentPage * (itemsToRender.length - 1) + event.source.index;
        const destinationIndex = currentPage * (itemsToRender.length - 1) + event.destination.index;
        onChangePosition({ sourceIndex, destinationIndex })
        setIsDraggableActive(false);
    }

    const onDragStart = () => {
        setIsDraggableActive(true);
    }

    const renderImage = (item: File, index: number) => {
        if (item instanceof Function) return item();
        return (
            <FilePreview
                isDragDisabled={isDragDisabled}
                draggableId={item.name}
                index={index}
                onDelete={onFileDelete(item)}
                file={item}
                key={item.name}
            />
        )
    }

    const handleFileUpload = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
            const image = acceptedFiles[0]
            const imageUrl = URL.createObjectURL(image);
            const metadata = await getImageMetaData(imageUrl)
            if (maxHeight && metadata.height > maxHeight || maxWidth && metadata.width > maxWidth) {
                const fileRejections = [
                    { file: image, errors: [{ message: 'The width or height of this file is too high' }] }
                ] as FileRejection[]
                onDropRejected(fileRejections)
            } else {
                onFileUpload(image)
            }
        }
    }

    return (
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Pagination
                items={itemsToRender}
                onPageChange={onPageChange}
                total={files.length}
                itemPerPage={itemPerPage}
                onItemPerPageChange={setItemPerPage}
                renderItem={renderImage}
                currentPageIndex={currentPage}
            />
        </DragDropContext>
    )
}

FilesUpload.reorder = reorder;
