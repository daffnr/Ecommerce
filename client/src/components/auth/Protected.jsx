import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"


const Protected = ({roles}) => {
    const navigate = useNavigate()
    const {user, signin} = useSelector(state => state.auth)

    useState(() => {
        const timeout = setTimeout (() => {
            if(!user || !roles.includes(user.level) || !signin){
                navigate("/signin")
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [user, signin, roles])

    return null;
};

export default Protected