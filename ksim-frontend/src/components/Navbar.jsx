import { Link } from "react-router-dom";
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
                    <Link
                        key={i}
                        to={item === "Tabels" ? "/Home" : "/"}
                        onClick={() => setMenuOpen(false)} // close menu on click
                    >
                        {item}
                    </Link>
                ))}


            </div>

        </nav >
    );
}
