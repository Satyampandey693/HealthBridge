import { createContext, useContext,useState } from "react";

export const AuthContext=createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userID, setUserID] = useState(localStorage.getItem("userID"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const authorizationToken=`Bearer ${token}`;

    const storeTokenInLS=(serverToken,userId,role)=>{
         localStorage.setItem("token",serverToken);
         localStorage.setItem("userID",userId);
         localStorage.setItem("role",role);
         setToken(serverToken);
         setUserID(userId);
         setRole(role);
         return;
    };
    let isLoggedIn=!!token;

    const LogoutUser=()=>{
        setToken("");
        setUserID("");
        setRole("");
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        localStorage.removeItem("role");
    }

    return (<AuthContext.Provider value={{isLoggedIn,storeTokenInLS,LogoutUser,authorizationToken}}> 
    {children} 
    </AuthContext.Provider>
    );
};

export const useAuth=()=>{
    const authContextValue=useContext(AuthContext);
    if(!authContextValue){
        throw new Error("useAuth must be used within AuthProvider");
    }
    return authContextValue;
}