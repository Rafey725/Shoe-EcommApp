import { jwtDecode } from 'jwt-decode'

export const isTokenExpired = (token: string) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000
        if (!decoded.exp) return true
        return decoded.exp < currentTime;
    } catch (err) {
        console.log('Expiry check error: ', err);
        return true;
    }
}