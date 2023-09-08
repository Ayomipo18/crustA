export enum TimeStatus {
    available = 'available', 
    unavailable = 'unavailable' 
};

export const jwtDetails = {
    expiresIn: 60 * 30,
    issuer: 'CrustA',
    audience: '*'
}

export const resourceParameter = {
    pageSize: 10,
    pageNumber: 1
}

export enum OAuthProvider {
    google = 'GOOGLE',
    microsoft = 'MICROSOFT',
    facebook = 'FACEBOOK',
    none = 'NONE'
}