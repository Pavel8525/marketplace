
import { ICurrentUser } from './contracts';
import { capitalizeFirstLetter } from './string-helper';
import { userImagePath } from '../constants';
import { authService } from '../core/auth';


export function getCurrentUser(): ICurrentUser {
    const userAuthData = authService.getUserAuthData();

    if (userAuthData == null) {
        return {
            isAuthenticated: false
        }
    }

    const data = require('../../api/current-user.json') as ICurrentUser;

    data.isAuthenticated = true;
    data.userFullName = capitalizeFirstLetter(userAuthData.userName);
    data.email = userAuthData.userName;
    data.roles = [...userAuthData.roles];

    data.logoPath = data.logoPath || `${userImagePath}/soldado.png`;
    data.dispayName = data.dispayName || `${data.userFullName} (${data.email}, ${data.countryName}, ${data.id})`;

    return data;
}