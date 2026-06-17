import { Header } from "./Header.jsx"
import { Footer } from "./Footer.jsx"
import { Loader } from "../Loader.jsx"
import { Outlet, useNavigation } from "react-router-dom"
// import "./AppLayout.css"
export const AppLayout=()=>{

    const navigation=useNavigation();
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1 }}>
          {navigation.state === "loading" ? <Loader /> : <Outlet />}
        </main>
        <Footer />
      </div>
    );
}