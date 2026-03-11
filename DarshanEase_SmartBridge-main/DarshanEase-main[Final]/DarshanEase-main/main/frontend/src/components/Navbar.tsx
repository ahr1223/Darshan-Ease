import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, User, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Role-based nav items
  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { label: "Home", path: "/" },
        { label: "Temples", path: "/temples" },
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" },
      ];
    }
    if (user?.role === "ADMIN") {
      return [
        { label: "Home", path: "/" },
        { label: "Dashboard", path: "/admin" },
      ];
    }
    if (user?.role === "ORGANIZER") {
      return [
        { label: "Home", path: "/" },
        { label: "My Temples", path: "/organizer" },
      ];
    }
    // USER
    return [
      { label: "Home", path: "/" },
      { label: "Temples", path: "/temples" },
      { label: "Live Darshan", path: "/live-darshan" },
      { label: "My Bookings", path: "/dashboard" },
    ];
  };

  const navItems = getNavItems();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-card" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Sun className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold text-gradient-saffron">TempleDarshan</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path + item.label}
              to={item.path}
              className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {item.label}
              {isActive(item.path) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 gradient-saffron rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}

          {/* Services dropdown — only for non-authenticated */}
          {!isAuthenticated && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                Services <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-card min-w-[200px] overflow-hidden"
                  >
                    <Link to="/temples" onClick={() => setServicesOpen(false)}>
                      <div className="px-4 py-3 text-sm hover:bg-muted transition-colors cursor-pointer">
                        <p className="font-semibold">Darshan Booking</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Book a slot at any temple</p>
                      </div>
                    </Link>
                    <div className="border-t border-border" />
                    <Link to="/live-darshan" onClick={() => setServicesOpen(false)}>
                      <div className="px-4 py-3 text-sm hover:bg-muted transition-colors cursor-pointer">
                        <p className="font-semibold">Live Darshan</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Watch darshan live online</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Auth button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-4">
              <div className="flex items-center gap-2 px-3 py-1.5 glass-dark rounded-lg text-sm text-primary-foreground">
                <User className="w-4 h-4" />
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs opacity-60 capitalize">({user?.role?.toLowerCase()})</span>
              </div>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-border rounded-lg text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 px-5 py-2 gradient-saffron text-primary-foreground rounded-lg text-sm font-semibold shadow-saffron"
            >
              Login / Sign Up
            </motion.button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass border-t border-border"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {isAuthenticated && user && (
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> {user.name} <span className="text-xs capitalize">({user.role?.toLowerCase()})</span>
              </div>
            )}
            {navItems.map((item) => (
              <Link key={item.path + item.label} to={item.path} onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-primary/5 rounded-lg transition-colors">
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <div className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Services</div>
                <Link to="/temples" onClick={() => setMobileOpen(false)} className="px-6 py-2 text-sm text-foreground/80 hover:bg-primary/5 rounded-lg">Darshan Booking</Link>
                <Link to="/live-darshan" onClick={() => setMobileOpen(false)} className="px-6 py-2 text-sm text-foreground/80 hover:bg-primary/5 rounded-lg">Live Darshan</Link>
              </>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="w-full mt-2 px-5 py-3 border border-border text-foreground/70 rounded-lg text-sm font-semibold">
                Logout
              </button>
            ) : (
              <button onClick={() => { navigate("/login"); setMobileOpen(false); }}
                className="w-full mt-2 px-5 py-3 gradient-saffron text-primary-foreground rounded-lg text-sm font-semibold">
                Login / Sign Up
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
