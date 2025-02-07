import { Header } from "./Header.jsx"
import { Footer } from "./Footer.jsx"
import { Outlet, useNavigation } from "react-router-dom"
// import "./AppLayout.css"
export const AppLayout=()=>{

    const navigation=useNavigation();
    if(navigation.state==="loading")return <h1>Loading....</h1>;
    return <>
    <Header />
    <Outlet />
    <Footer />
    </>
}