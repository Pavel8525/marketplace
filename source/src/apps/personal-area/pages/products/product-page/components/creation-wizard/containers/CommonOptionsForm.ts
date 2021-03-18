import { IStateProps, IDispatchProps, CommonOptionsForm } from "../components/CommonOptionsForm";
import { connect } from "react-redux";
import { IStoreState } from "app/common/core";
import { InvokeSpecificUrl } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";

const CommonOptionsFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ProductItem
        };
    },
    {
        saveItem: Bantikom.ProductService.saveProductItem.invoke as InvokeSpecificUrl<{}, {}>,
        updateLocallyItem: Bantikom.ProductService.getProductItem.updateLocally
    }
)(CommonOptionsForm);

export { CommonOptionsFormConnected as CommonOptionsForm };
