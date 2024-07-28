import { Home, Info, LogIn, Key } from "lucide-react";
import Index from "./pages/Index.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Secrets from "./pages/Secrets.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "About",
    to: "/about",
    icon: <Info className="h-4 w-4" />,
    page: <About />,
  },
  {
    title: "Login",
    to: "/login",
    icon: <LogIn className="h-4 w-4" />,
    page: <Login />,
  },
  {
    title: "Secrets",
    to: "/secrets",
    icon: <Key className="h-4 w-4" />,
    page: <Secrets />,
  },
];