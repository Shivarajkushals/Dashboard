import { Link } from "react-router-dom";
import logo from "../assets/react.svg";
// import hamburger from "./assets/hamburger.svg";

export default function Navbar() {
    const navList = ["Sales", "Stocks"];

    return (
        <nav className="px-5 py-2 backdrop-blur-xl flex justify-between items-center px-6 py-3 bg-white border-b border-white/10">
            <img src={logo} alt="Logo" className="h-8" />
            <div className="flex gap-4 text-center bg-[rgba(255,255,255,0.2)]">
                {navList.map((item, i) => (
                    <Link
                        key={i}
                        to={item === "Sales" ? "/" : item === "Stocks" ? "/Stocks" : `/${item}`}
                        onClick={() => setMenuOpen(false)} className="text-black text-lg hover:text-blue-600" // close menu on click
                    >
                        {item}
                    </Link>
                ))}


            </div>

        </nav >
    );
}
