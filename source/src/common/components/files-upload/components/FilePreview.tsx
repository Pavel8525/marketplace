import React, { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';


interface IProps {
    file: File;
    onDelete(): void;
    draggableId: string;
    isDragDisabled?: boolean;
    index: number;
}

const FilePreview: FC<IProps> = ({ file, onDelete, draggableId, isDragDisabled, index }) => (
    <Draggable isDragDisabled={isDragDisabled} draggableId={`draggable-${draggableId}`} index={index}>
        { (provided) => (
            <div className="file-preview-container" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <i className="fal fa-times" onClick={onDelete}/>
                <img draggable={false} src={URL.createObjectURL(file)} title={file.name} alt={file.name}/>
            </div>
        ) }
    </Draggable>
)

export default FilePreview;
