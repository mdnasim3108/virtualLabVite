import React from "react"
const userContext=React.createContext({
    user:null,
    setUser:()=>{}
})
export default userContext