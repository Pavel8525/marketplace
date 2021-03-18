import React, { FC, useState } from 'react'
import { reduxForm } from 'redux-form';
import { MaterialTextField } from 'app/common/components/forms/components/MaterialTextField';
import { MaskedTextField } from 'app/common/components/forms/components/MaskedTextField';
import { DropdownField } from 'app/common/components/forms/components/DropdownField';
import { TextField, NumericField, SelectField, LookupField, DatePickerField } from 'app/common/components/forms/components';
import ControlGroup from './components/ControlGroup';
import { LookupEntityType, Drawer, CategoryChooser, ProductCategory, Panel, ChangePositionEvent, FilesUpload } from 'app/common/components';
import { FileRejection } from 'react-dropzone';
import { uploadProductFiles } from 'app/common/services';
import {Marketplace} from "app/common/components/lists/connected-marketplaces-list";

const HTMLDescription = `<div><p style="color: blue; margin: 0">HTML \n DESCRIPTION</p></div>`

const data: Marketplace[] = [
    { MarketPlaceKind: 'Ozon', ConnectedMarketplace: 'Интегра-С', Id: '1' },
    { MarketPlaceKind: 'Ozon', ConnectedMarketplace: null, Id: '2' },
    { MarketPlaceKind: 'Wildberries', ConnectedMarketplace: 'ООО Ромашка', Id: '3' }
]

interface IProps { }

const ControlExamplePage: FC<IProps> = (props) => {
    const [selectedCategory, setSelectedCategory] = useState()
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)

    const toggleDrawer = () => {
        setIsOpenDrawer(!isOpenDrawer)
    }

    const onClose = () => {
        setIsOpenDrawer(false)
    }

    const handleSelectCategory = (category: ProductCategory) => {
        setSelectedCategory(category)
        onClose()
    }

    const [files, setFiles] = useState<File[]>([])

    const handleFileUpload = (file: File) => {
        setFiles([...files, file])
    }

    const handleDeleteFile = (file: File) => {
        // It would be better to use id for filtering
        const filteredItems = files.filter(it => it.name !== file.name);
        setFiles(filteredItems);
    }

    const onDropRejected = (fileRejection: FileRejection[]) => {
        const [rejectedFile] = fileRejection;
        const [error] = rejectedFile.errors
        alert(error.message)
    }

    const onChangePosition = (event: ChangePositionEvent) => {
        const reorderedFiles = FilesUpload.reorder(files, event.sourceIndex, event.destinationIndex)
        setFiles(reorderedFiles)
    }

    const onFileUpload = async () => {
        await uploadProductFiles(
            files,
            {
                marketplaceKind: 'Ozon',
                productId: 'd5f1bbd1-51c7-ea11-b80b-d8d385e415c4'
            },
            {
                successMessage: 'Файл передан успешно.',
            }
        )
    }

    const onOpenConnectedMarketplaceList = () => {
        props.history.push('/personal/marketplace-list', data)
    }

    return (
        <form>
            <Panel title="CONNECTED MARKETPLACE LIST" uniqueIdentifier="ConnectedMarketplacesList">
                <ControlGroup controlName="ConnectedMarketplacesList">
                    <button
                        type="button"
                        onClick={onOpenConnectedMarketplaceList}
                    >
                        Open CONNECTED MARKETPLACE LIST
                    </button>

                </ControlGroup>
            </Panel>

            <Panel title="DRAWERS" uniqueIdentifier="drawers">
                <ControlGroup controlName="Category choose drawer">
                    <button type="button" onClick={toggleDrawer}>TOGGLE DRAWER</button>
                    <Drawer
                        onClose={onClose}
                        isOpen={isOpenDrawer}
                        headerComponent={<CategoryChooser.Header />}
                        mainComponent={<CategoryChooser marketplaceKind="Ozon" onChoose={handleSelectCategory} />}
                    />
                </ControlGroup>
            </Panel>

            <Panel title="FILES UPLOAD" uniqueIdentifier="drawers">
                <ControlGroup controlName="Category choose drawer">
                    <button type="button" onClick={onFileUpload} disabled={!files.length}>
                        UPLOAD
                    </button>

                    <FilesUpload
                        accept="image/*"
                        files={files}
                        onDelete={handleDeleteFile}
                        onFileUpload={handleFileUpload}
                        onDropRejected={onDropRejected}
                        onChangePosition={onChangePosition}
                        isDragDisabled
                    />
                </ControlGroup>
            </Panel>

            <Panel title="FORM CONTROLS" uniqueIdentifier="form-controls">
                <ControlGroup controlName="MaterialTextField">
                    <MaterialTextField
                        label="Enter name"
                        description={`Please \n enter your name in this field`}
                        name="productNameMaterialTextField"
                    />

                    <MaterialTextField
                        label="Enter name"
                        description={HTMLDescription}
                        name="productNameMaterialTextFieldHTML"
                    />
                </ControlGroup>

                <ControlGroup controlName="TextField">
                    <TextField
                        label="Enter name"
                        description="Please enter your name in this field"
                        name="productNameTextField"
                    />
                </ControlGroup>

                <ControlGroup controlName="NumericField">
                    <NumericField
                        classNameContainer="col-4"
                        min={0}
                        max={10}
                        step={1}
                        description="Please choose number"
                        label="Choose"
                        name="chooseNumber"
                    />
                </ControlGroup>

                <ControlGroup controlName="SelectField">
                    <SelectField
                        options={[{ name: 'Select Value 1', value: '1' }, { name: 'Select Value 2', value: '2' }]}
                        description="Please select"
                        label="Select"
                        name="select"
                    />
                </ControlGroup>

                <ControlGroup controlName="MaskedTextField">
                    <MaskedTextField
                        mask="+38095"
                        description="Please enter"
                        label="Phone"
                        name="masked"
                    />
                </ControlGroup>

                <ControlGroup controlName="LookupField">
                    <LookupField
                        count={1}
                        entityType={LookupEntityType.brand}
                        options={[{ name: 'LookupField 1', value: '1' }]}
                        description="Lookup"
                        label="Lookup"
                        name="lookup"
                    />
                </ControlGroup>

                <ControlGroup controlName="DropdownField">
                    <DropdownField
                        options={[{ name: 'LookupField 1', value: '1' }]}
                        description="Dropdown"
                        label="Dropdown"
                        name="dropdown"
                    />
                </ControlGroup>

                <ControlGroup controlName="DatePickerField">
                    <DatePickerField
                        description="DatePicker"
                        label="DatePicker"
                        name="datePicker"
                        required
                    />
                </ControlGroup>
            </Panel>
        </form>
    )
}

export default reduxForm({ form: 'ControlExamplePage', })(ControlExamplePage);
