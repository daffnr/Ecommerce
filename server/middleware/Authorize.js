import jwt from "jsonwebtoken";
import { client } from "../config/connection.js"

;
export const authorize = (... levels) => {
    return async (req, res, next) => {
        const {token} = req.cookies

        if(!token){
            return null;
        }

        try {
            const decode = jwt.verify(token, process.env.KEY);

            const {id, level} = decode

            const data = await client.query(`SELECT * FROM users WHERE id = $1`,[
                id,
            ]);

            if(data.rowCount === 0){
                return res.status(404).json({message: "User tidak ditemukan"})
            }

            const user = data.rows[0];

            if(!levels.includes(user.level)){
                return res.status(403).json({message: "Tidak memiliki otoritas"});
            }

            req.user = user;

            console.log(decode);

            next();
        } catch (error) {
            console.log(error)
            res.status(500).json({message: error.message})
        }
    }
}