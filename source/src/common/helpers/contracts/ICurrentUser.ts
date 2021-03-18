export interface ICurrentUser {
    id?: string;
    email?: string;
    userName?: string;
    userFullName?: string;
    countryName?: string;    
    logoPath?: string;
    dispayName?: string;
    roles?: string[];
    isAuthenticated: boolean;
}