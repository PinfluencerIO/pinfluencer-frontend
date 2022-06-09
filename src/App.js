import { Outlet } from "react-router-dom";
import Footer from "./layout/Footer";
import NavLinks from "./layout/NavLinks";
import Topbar from "./layout/Topbar";

export default function App() {
  return (
    <>
      <Topbar />
      <NavLinks />
      <Outlet />
      <Footer />
    </>
  );
}
