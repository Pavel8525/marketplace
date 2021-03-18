import React, { FC, useCallback } from 'react';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import './styles.css';

interface IProps {
    onPick: (acceptedFiles: File[]) => void;
    accept?: string | string[];
    disabled?: boolean;
    maxSize?: number;
    minSize?: number;
    onDropRejected?(fileRejections: FileRejection[], event: DropEvent): void;
}

const FilePicker: FC<IProps> = ({ onPick, accept, maxSize, disabled, minSize, onDropRejected }) => {
    const onDrop = useCallback((acceptedFiles) => {
        onPick(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        minSize,
        maxSize,
        disabled,
        accept,
        onDropRejected
    })

    return (
        <div {...getRootProps()} className="file-picker-container">
            <input {...getInputProps()} />
            { isDragActive ? <p>Drop the files here ...</p> : <i className="fal fa-file-image" /> }
        </div>
    )
}

export default FilePicker;
