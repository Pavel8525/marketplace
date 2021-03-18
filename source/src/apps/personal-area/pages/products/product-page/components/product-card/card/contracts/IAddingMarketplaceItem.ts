import { MarketplaceKind } from "app/common/core/api/proxy-ext";

export interface IAddingMarketplaceItem {
    Id: string;
    Name: string;
    MarketplaceKind: MarketplaceKind;
}
