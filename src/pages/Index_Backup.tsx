import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Bus,
  User,
  Users,
  ShieldCheck,
  Clock,
  MapPin,
  Bell,
  Shield,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeaderSolid = scrollY > 20;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground">
      {/* Navbar */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isHeaderSolid
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Bus className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-xl text-gray-900 dark:text-white">
                Campus Bus Assistant
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.getElementById("features");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.getElementById("how-it-works");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                How It Works
              </a>
              <a
                href="#roles"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.getElementById("roles");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                User Roles
              </a>
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden sm:inline-flex border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Get Started
                </Button>
              </Link>

              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <a
                      href="#features"
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        const section = document.getElementById("features");
                        if (section) {
                          section.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      Features
                    </a>
                    <a
                      href="#how-it-works"
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        const section = document.getElementById("how-it-works");
                        if (section) {
                          section.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      How It Works
                    </a>
                    <a
                      href="#roles"
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        const section = document.getElementById("roles");
                        if (section) {
                          section.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      User Roles
                    </a>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link to="/login" className="block w-full mb-3">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/register" className="block w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        {/* Modern, subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-8"
            >
              {/* Simplified badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Smart Campus Transportation
              </motion.div>
              
              {/* Clean, professional headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-white">
                  Streamline Your
                </span>
                <br />
                <span className="text-blue-600 dark:text-blue-400">
                  Campus Transportation
                </span>
              </h1>
              
              {/* Cleaner description */}
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Connect students, drivers, and coordinators with our comprehensive platform. 
                Track buses in real-time, manage routes efficiently, and ensure safe transportation for everyone.
              </p>
              
              {/* Simple, clean CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  onClick={() => {
                    const featuresSection = document.getElementById("features");
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  View Features
                </Button>
              </div>

              {/* Simple trust indicators */}
              <div className="flex items-center space-x-6 pt-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>24/7 support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Secure platform</span>
                </div>
              </div>
            </motion.div>

            {/* Right side - Clean illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-lg">
                {/* Main visual element */}
                <div className="relative w-full h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Mock interface */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Bus className="w-4 h-4 text-white" />
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="pt-4">
                      <div className="h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center"
                >
                  <MapPin className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-500 rounded-xl shadow-lg flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
            onClick={() => {
              const featuresSection = document.getElementById("features");
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </section>
        >
          <div className="container mx-auto flex flex-col space-y-4 px-4">
            <a
              href="#features"
              className="text-sm font-medium py-2 border-b border-gray-100 dark:border-gray-700 dark:text-gray-300 hover:dark:text-white"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                const section = document.getElementById("features");
                if (section) {
                  const rect = section.getBoundingClientRect();
                  const scrollTop =
                    window.pageYOffset || document.documentElement.scrollTop;
                  const targetPosition =
                    rect.top +
                    scrollTop -
                    window.innerHeight / 2 +
                    rect.height / 2;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                  });
                }
              }}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium py-2 border-b border-gray-100 dark:border-gray-700 dark:text-gray-300 hover:dark:text-white"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                const section = document.getElementById("how-it-works");
                if (section) {
                  const rect = section.getBoundingClientRect();
                  const scrollTop =
                    window.pageYOffset || document.documentElement.scrollTop;
                  const targetPosition =
                    rect.top +
                    scrollTop -
                    window.innerHeight / 2 +
                    rect.height / 2;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                  });
                }
              }}
            >
              How It Works
            </a>
            <a
              href="#roles"
              className="text-sm font-medium py-2 border-b border-gray-100 dark:border-gray-700 dark:text-gray-300 hover:dark:text-white"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                const section = document.getElementById("roles");
                if (section) {
                  const rect = section.getBoundingClientRect();
                  const scrollTop =
                    window.pageYOffset || document.documentElement.scrollTop;
                  const targetPosition =
                    rect.top +
                    scrollTop -
                    window.innerHeight / 2 +
                    rect.height / 2;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                  });
                }
              }}
            >
              User Roles
            </a>

            {isAuthenticated ? (
              <Link
                to={`/${user?.role}`}
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full shadow-md">
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full shadow-md">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Theme Toggle for Mobile */}
            <div className="py-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium dark:text-gray-300">
                  Theme
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/20 via-purple-300/10 to-transparent dark:from-blue-600/20 dark:via-purple-600/10" />
        </div>

        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 dark:from-indigo-500/20 dark:to-cyan-500/20 blur-3xl"
            animate={{
              x: [0, -25, 0],
              y: [0, 25, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute top-1/4 left-1/3 w-60 h-60 rounded-full bg-gradient-to-bl from-violet-400/15 to-pink-400/15 dark:from-violet-500/20 dark:to-pink-500/20 blur-3xl"
            animate={{
              x: [0, 20, 0],
              y: [0, -30, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: "easeInOut",
              delay: 4,
            }}
          />
        </div>

        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col space-y-8 px-4 md:px-0"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 mb-6 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm text-primary text-sm font-semibold shadow-lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Trusted Campus Transportation
                </span>
              </motion.div>
            </div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 dark:from-white dark:via-purple-100 dark:to-violet-100 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-gradient-to-r from-primary via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Campus Journey
                </span>
                <motion.span
                  className="absolute bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-sm -z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                ></motion.span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed"
            >
              Experience seamless campus transportation with our intelligent platform that connects students, drivers, and administrators in perfect harmony.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-6"
            >
              <Link to="/login">
                <Button
                  size="lg"
                  className="font-semibold text-lg px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-lg px-8 py-4 border-2 border-gray-300 dark:border-gray-600 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 w-full sm:w-auto transition-all duration-300 hover:shadow-lg"
                onClick={() => {
                  const howItWorksSection =
                    document.getElementById("how-it-works");
                  if (howItWorksSection) {
                    howItWorksSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Discover Features
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center space-x-6 pt-8"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold ring-4 ring-white dark:ring-gray-900 shadow-lg"
                  >
                    {i}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.3 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-bold ring-4 ring-white dark:ring-gray-900 shadow-lg"
                >
                  2K+
                </motion.div>
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-lg">2,000+ Happy Users</p>
                <p className="text-sm">Across multiple campuses</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[500px] flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              {/* Main hero visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-3xl bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-800/40 dark:to-gray-800/10 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-2xl flex items-center justify-center overflow-hidden"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-violet-500/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Bus className="w-40 h-40 text-primary drop-shadow-lg" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced floating elements */}
              <motion.div
                animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="absolute top-10 right-10 bg-white p-3 rounded-xl shadow-lg"
              >
                <MapPin className="h-5 w-5 text-red-500" />
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5], rotate: [0, -5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-20 left-10 bg-white p-3 rounded-xl shadow-lg"
              >
                <Clock className="h-5 w-5 text-primary" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a
            href="#features"
            className="flex flex-col items-center text-sm text-gray-500 hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              const section = document.getElementById("features");
              if (section) {
                const rect = section.getBoundingClientRect();
                const scrollTop =
                  window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition =
                  rect.top +
                  scrollTop -
                  window.innerHeight / 2 +
                  rect.height / 2;
                window.scrollTo({
                  top: targetPosition,
                  behavior: "smooth",
                });
              }
            }}
          >
            <span>Scroll Down</span>
            <ChevronDown className="w-5 h-5 mt-1" />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-24 overflow-hidden"
      >
        {/* Enhanced background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-500/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 mb-6 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm text-primary text-sm font-semibold shadow-lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Everything You Need
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-violet-600 bg-clip-text text-transparent">
                In One Platform
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform offers intelligent tools designed to revolutionize 
              campus transportation management with cutting-edge technology.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-gray-700/50 group-hover:border-primary/30 group-hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 dark:from-primary/30 dark:to-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-primary group-hover:text-purple-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover effect indicator */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 overflow-hidden">
        {/* Modern background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-300/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 mb-6 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm text-primary text-sm font-semibold shadow-lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Simple Process
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                How It
              </span>{" "}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-violet-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our platform seamlessly connects all stakeholders in the campus transportation 
              ecosystem through an intuitive and streamlined process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 hidden md:block z-0">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.3 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 origin-left rounded-full"
                    />
                  </div>
                )}
                
                {/* Step number with enhanced styling */}
                <div className="relative mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-2xl relative z-10 group-hover:shadow-primary/50 transition-all duration-300"
                  >
                    {index + 1}
                  </motion.div>
                  
                  {/* Pulsing background effect */}
                  <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 animate-ping opacity-20" />
                  
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-primary/30 group-hover:border-primary/60 transition-all duration-300 scale-125" />
                </div>
                
                <motion.h3
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300"
                >
                  {step.title}
                </motion.h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg max-w-sm">
                  {step.description}
                </p>
                
                {/* Subtle icon or indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                  className="mt-6 w-2 h-2 rounded-full bg-gradient-to-r from-primary to-purple-500 opacity-60"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section
        id="roles"
        className="relative py-24 overflow-hidden"
      >
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 dark:from-gray-900 dark:via-indigo-900/10 dark:to-purple-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-200/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 mb-6 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm text-primary text-sm font-semibold shadow-lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                User Roles
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Choose Your
              </span>{" "}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-violet-600 bg-clip-text text-transparent">
                Role
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our platform caters to different stakeholders in the campus bus
              ecosystem, each with tailored features and personalized experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Card container with enhanced styling */}
                <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  
                  {/* Gradient header with improved design */}
                  <div
                    className={`h-32 flex items-center justify-center ${role.bgClass} relative overflow-hidden`}
                  >
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-20">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, 0]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20"
                      />
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, -10, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                        className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/15"
                      />
                    </div>
                    
                    {/* Icon with enhanced animation */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative z-10"
                    >
                      <role.icon className="w-14 h-14 text-white drop-shadow-lg" />
                    </motion.div>
                    
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-black/20" />
                  </div>
                  
                  {/* Content area with enhanced padding and typography */}
                  <div className="p-8 relative">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                      {role.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                      {role.description}
                    </p>
                    
                    {/* Enhanced button */}
                    <Link to={role.loginPath}>
                      <Button
                        variant="outline"
                        className="w-full group/btn bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary font-semibold text-lg py-3 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
                      >
                        <span className="bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white group-hover/btn:from-primary group-hover/btn:to-purple-600 bg-clip-text text-transparent transition-all duration-300">
                          Login as {role.title}
                        </span>
                        <ChevronRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:text-primary transition-all duration-300" />
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                
                {/* Floating background decoration */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-600/10 dark:from-primary/20 dark:via-purple-500/20 dark:to-blue-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Enhanced badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 mb-8 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm text-primary text-sm font-semibold shadow-lg"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Start Your Journey
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Ready to Simplify
              </span><br />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-violet-600 bg-clip-text text-transparent">
                Campus Transportation?
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students, drivers, and coordinators who are
              already using our platform to make campus transportation more
              efficient, transparent, and user-friendly.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 text-lg px-10 py-4 font-semibold w-full sm:w-auto"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-lg px-10 py-4 border-2 border-gray-300 dark:border-gray-600 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 w-full sm:w-auto transition-all duration-300 hover:shadow-lg"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Learn More
              </Button>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center space-x-8 mt-12 text-gray-500 dark:text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Free to Start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Instant Setup</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 border-t border-gray-200/50 dark:border-gray-700/50">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand section with enhanced styling */}
            <div className="space-y-6 md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Campus Bus Assistant
                </span>
              </motion.div>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Revolutionizing campus transportation with smart technology, 
                real-time insights, and seamless user experiences.
              </p>
              
              {/* Social links (placeholder) */}
              <div className="flex space-x-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center hover:from-primary hover:to-purple-600 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-4 h-4 rounded-full bg-current opacity-60" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced navigation sections */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Features
              </h3>
              <ul className="space-y-4">
                {[
                  { name: "Real-time Tracking", href: "#features" },
                  { name: "Voting System", href: "#features" },
                  { name: "Route Guidance", href: "#features" },
                  { name: "Emergency Assistance", href: "#features" }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <a
                      href={item.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300 flex items-center group"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      {item.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                User Roles
              </h3>
              <ul className="space-y-4">
                {[
                  { name: "Student", path: "/login/student" },
                  { name: "Driver", path: "/login/driver" },
                  { name: "Coordinator", path: "/login/coordinator" },
                  { name: "Administrator", path: "/login/admin" }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300 flex items-center group"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Support
              </h3>
              <ul className="space-y-4">
                {[
                  { name: "Contact Support", href: "#" },
                  { name: "Help Center", href: "#" },
                  { name: "Privacy Policy", href: "#" },
                  { name: "Terms of Service", href: "#" }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <a
                      href={item.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300 flex items-center group"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      {item.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enhanced footer bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-t border-gray-200/50 dark:border-gray-700/50 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
                © {new Date().getFullYear()} Campus Bus Assistant. All rights reserved. 
                <span className="block md:inline md:ml-2 text-sm">
                  Built with ❤️ for campus communities.
                </span>
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>System Operational</span>
                </span>
                <span>Version 2.0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

// Features data
const features = [
  {
    title: "Real-time Bus Tracking",
    description:
      "Track bus locations and get accurate arrival time estimates for better planning.",
    icon: Bus,
  },
  {
    title: "Voting System",
    description:
      "Request additional buses through democratic voting when regular schedules don't meet demand.",
    icon: Users,
  },
  {
    title: "Emergency Assistance",
    description:
      "Quick access to emergency services with one-tap SOS alerts to coordinators.",
    icon: Bell,
  },
  {
    title: "Route Guidance",
    description:
      "Interactive maps showing bus routes, stops, and helpful navigation for new students.",
    icon: MapPin,
  },
  {
    title: "Complaint Management",
    description:
      "Simple system to report and track issues for continuous service improvement.",
    icon: Shield,
  },
  {
    title: "Dynamic Scheduling",
    description:
      "View and manage bus schedules that adapt to campus needs in real-time.",
    icon: Clock,
  },
];

// How it works steps
const steps = [
  {
    title: "Register & Login",
    description:
      "Sign up with your role (Student, Driver, Coordinator, or Admin) and access your personalized dashboard.",
  },
  {
    title: "Choose Your Bus",
    description:
      "View available buses, routes, and schedules. If needed, participate in voting for additional services.",
  },
  {
    title: "Travel Safely",
    description:
      "Enjoy safe, efficient transportation with real-time updates and emergency support if needed.",
  },
];

// User roles
const roles = [
  {
    title: "Student",
    description:
      "View bus schedules, vote for additional services, and report issues as needed.",
    icon: User,
    bgClass: "bg-gradient-to-r from-blue-500 to-blue-600",
    loginPath: "/login/student",
  },
  {
    title: "Driver",
    description:
      "Manage your bus schedule, respond to student needs, and provide safe transportation.",
    icon: Bus,
    bgClass: "bg-gradient-to-r from-green-500 to-green-600",
    loginPath: "/login/driver",
  },
  {
    title: "Coordinator",
    description:
      "Oversee bus operations, manage voting requests, and resolve complaints.",
    icon: Users,
    bgClass: "bg-gradient-to-r from-purple-500 to-purple-600",
    loginPath: "/login/coordinator",
  },
  {
    title: "Admin",
    description:
      "Full system control including user management, bus allocation, and data analytics.",
    icon: ShieldCheck,
    bgClass: "bg-gradient-to-r from-red-500 to-red-600",
    loginPath: "/login/admin",
  },
];

export default LandingPage;
