import { createContext, useContext } from "react";

export const AuthContext=createContext();

export const AuthProvider = ({ children }) => {

    const storeTokenInLS=(serverToken,userId,role)=>{
         localStorage.setItem("token",serverToken);
         localStorage.setItem("userID",userId);
         localStorage.setItem("role",role);
         return;
    };

    return (<AuthContext.Provider value={storeTokenInLS}> 
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