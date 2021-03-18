
import { IPackageInfo } from './contracts';

export function getPackageInfo(): IPackageInfo {
    const packageFile = require('../../../package.json');
    
    const { name, displayName, description, version, logo } = packageFile;

    return {
        name,
        displayName,
        description,
        version,
        logo
    }
}