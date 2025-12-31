import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import logo from "./assets/logo.svg";
// import hamburger from "./assets/hamburger.svg";

export default function Navbar() {
    const navList = ["Tabels", "Stocks", "Sales"];
    // const location = useLocation();
    // const currentPath = location.pathname;
    // const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-blue-300 px-5 py-2 backdrop-blur-xl flex justify-between items-center px-6 md:px-12 lg:px-24 py-4">
            <button className="primaryBtn text-sm mx-auto py-2">
                Get a Demo
            </button>
            <div className="flex gap-4 text-center py-4 bg-[rgba(255,255,255,0.2)]">
                {navList.map((item, i) => (
                    // <Link
                    //     key={i}
                    //     to={item === "About Us" ? "/About" : "/"}
                    //     onClick={() => setMenuOpen(false)} // close menu on click
                    //     className={`py-2 navItem manrope ${(item === "Home" && currentPath === "/") ||
                    //         (item === "About Us" && currentPath === "/About")
                    //         ? "activeNav"
                    //         : ""
                    //         }`}
                    // >
                    //     {item}
                    // </Link>
                    <span key={i} className="py-2">{item}</span>
                ))}


            </div>
        </nav >
    );
}
