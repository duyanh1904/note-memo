import jwt from 'jsonwebtoken';
import { JWT_SECRET, CUSTOM_AUTH_TOKEN_LENGTH, AUTH_ERRORS } from '../constants/auth.js';
const auth = async (req, res, next) => {
    try {
        const initToken = req.headers.authorization || '';
        const token = initToken.split(" ")[1];
        const isCustomAuth = token.length < CUSTOM_AUTH_TOKEN_LENGTH;
        
        let decodeData;
        if (token && isCustomAuth) {
            decodeData = jwt.verify(token, JWT_SECRET);
            req.userId = decodeData?.id;
        } else {
            decodeData = jwt.decode(token);
            req.userId = decodeData?.sub;
        }
        next()
    } catch (error) {
        console.log(error);
    } 
}

export default auth;