
import { IApplicationAddon } from './contracts';


export function getApplicationAddons(): IApplicationAddon[] {
    const data = require('../../api/application-addons.json') as IApplicationAddon[];
    return data;
}