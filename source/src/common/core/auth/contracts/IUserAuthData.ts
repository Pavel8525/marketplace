/*
{
    "access_token": "wLSOycAtSMrEUWXPgbNqDXH3-LHIuENp3TORrBeEo0l7NOXywAFO6gpefZE7Y_LIjGywwfEEaVv09y7j9WkymKq0EOw0S3PblPATv9xiVAOGOytJ8WOO94-3xa3iPCnJYDg51Ldnl46rGZnL8ky6VxdFOa07mvj38jImMQP6_yuUjCf_mR8vztLzuaGOo8itqOs1r8YmRRZ-SCh2bSOMEOxXnrf2OJ9u3xwYds10Rtj-5zBlCVrF-5oQN_oVk6CWel12BtUdcvKvhFIZR-Xx0tPksCFZHkymJ6fvokzL7wSw5x0rVA0HODe4IqBqeJRSJ-r_gdRPKs94vZZ1mO-__rIOCCWkgTEV5O0kzcPjipXg6YeVo-0EE_4p84KLJc7K6hdIM_GMM720_NdYEus3fRRX1pBFWmljacqyjV14IjGTpDKaMZPm6-ixIPQauocYPIApRFPuk1JSWM_o5oy58g",
    "token_type": "bearer",
    "expires_in": 31535999,
    "as:client_id": "",
    "userName": "fordsoft@mail.ru",
    "roles": "qualitycontrol,admins",
    ".issued": "Sun, 28 Jun 2020 21:38:49 GMT",
    ".expires": "Mon, 28 Jun 2021 21:38:49 GMT"
}
*/

export interface IUserAuthData {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    userName: string;
    roles: string[];
    issued: Date;
    expires: Date;
}