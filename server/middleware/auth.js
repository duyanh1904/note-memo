import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const initToken = req.headers.Authorization || '';
        const token = initToken.split(" ")[1];
        
        if (token) {
            const isCustomAuth = token.length < 500;
        }
        
        let decodeData;
        if (token && isCustomAuth) {
            decodeData = jwt.verify(token, 'test');
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