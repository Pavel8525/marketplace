import { FC } from 'react';
import { Bantikom } from 'app/common/core/api/proxy';
import { IProps as IHeaderProps } from './component/Header'

export type ProductCategory = Bantikom.InternalCategory;

export type CategoryChooserStatic = {
    Header: FC<IHeaderProps>
}
