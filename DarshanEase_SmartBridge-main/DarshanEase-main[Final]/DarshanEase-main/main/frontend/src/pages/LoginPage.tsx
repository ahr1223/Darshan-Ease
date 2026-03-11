import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Eye, EyeOff } from "lucide-react";
import { login as loginApi, register as registerApi } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { PageWrapper } from "@/components/animations";

const LoginPage = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      const { token, ...userData } = res.data;
      login(userData, token);
      
      // Role-based redirection
      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else if (userData.role === "ORGANIZER") {
        navigate("/organizer");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await registerApi({ name, email, password, role });
      const { token, ...userData } = res.data;
      login(userData, token);
      
      // Role-based redirection
      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else if (userData.role === "ORGANIZER") {
        navigate("/organizer");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Sun className="w-12 h-12 text-primary mx-auto" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gradient-saffron">TempleDarshan</h1>
            <p className="text-muted-foreground text-sm mt-1">Your sacred journey starts here</p>
          </div>

          {/* Card */}
          <div className="bg-card rounded-xl shadow-card p-8">
            {/* Tabs */}
            <div className="flex bg-muted rounded-lg p-1 mb-6">
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); }}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all capitalize ${
                    tab === t
                      ? "gradient-saffron text-primary-foreground shadow-saffron"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === "login" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {tab === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 gradient-saffron text-primary-foreground rounded-lg font-semibold shadow-saffron disabled:opacity-60"
                    >
                      {loading ? "Logging in..." : "Login"}
                    </motion.button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="USER">User (Devotee)</option>
                        <option value="ORGANIZER">Organizer (Temple Manager)</option>
                      </select>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 gradient-saffron text-primary-foreground rounded-lg font-semibold shadow-saffron disabled:opacity-60"
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
