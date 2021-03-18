export interface IApplicationAddon {
    id: string;
    name: string;
    order: number;
    url: string;
    logoClass: string;
    roles: string[];
}