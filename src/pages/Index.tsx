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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isHeaderSolid, setIsHeaderSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSolid(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <div className="w-8 h-8 bg-slate-800 dark:bg-slate-200 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Bus className="h-5 w-5 text-white dark:text-slate-800" />
              </div>
              <span className="font-semibold text-xl text-slate-900 dark:text-slate-100">
                Campus Bus Assistant
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
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
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
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
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
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
                  className="hidden sm:inline-flex border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register/student">
                <Button
                  size="sm"
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
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
                      className="text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-2"
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
                      className="text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-2"
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
                      className="text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-2"
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
                        <Button
                          variant="outline"
                          className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/register/student" className="block w-full">
                        <Button className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-slate-100 text-white dark:text-slate-900">
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
      <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
        {/* Unified background matching features section */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-stone-50/50 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-stone-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-500/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-8"
            >
              {/* Natural Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center px-5 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 text-sm font-semibold shadow-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                <span className="text-slate-800 dark:text-slate-200">
                  Smart Campus Transportation
                </span>
              </motion.div>

              {/* Main Headline with natural colors */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-slate-900 dark:text-slate-100 mb-2">
                  Campus Bus Transportation
                </span>
                <span className="block text-slate-700 dark:text-slate-300">
                  Made Effortless
                </span>
              </h1>

              {/* Enhanced Description with natural highlights */}
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
                A seamless platform connecting{" "}
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  students
                </span>
                ,{" "}
                <span className="text-slate-800 dark:text-slate-300 font-semibold">
                  drivers
                </span>
                , and{" "}
                <span className="text-amber-700 dark:text-amber-400 font-semibold">
                  administrators
                </span>{" "}
                for efficient campus transportation management.
              </p>

              {/* Natural CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link to="/register/student">
                  <Button
                    size="lg"
                    className="group bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-10 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="group px-10 py-4 text-lg font-bold border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    try {
                      const featuresSection =
                        document.getElementById("features");
                      if (featuresSection) {
                        featuresSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                          inline: "nearest",
                        });
                      }
                    } catch (error) {
                      console.warn("Scroll to features failed:", error);
                    }
                  }}
                >
                  Learn More
                  <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

            {/* Enhanced Right side illustration with natural colors - positioned lower */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex items-center justify-center -mt-8 lg:-mt-10"
            >
              <div className="relative w-full max-w-xl">
                {/* Main dashboard mockup with natural styling */}
                <div className="relative w-full h-[500px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-800 dark:bg-slate-200 rounded-xl flex items-center justify-center">
                        <Bus className="w-6 h-6 text-white dark:text-slate-800" />
                      </div>
                      <div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-32 mb-1"></div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-20"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="p-6 space-y-6">
                    {/* Live tracking section */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-24"></div>
                      </div>
                      <div className="h-20 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700/50 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-slate-600 dark:text-slate-400 animate-pulse" />
                      </div>
                    </div>

                    {/* Status cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="h-16 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Natural Floating elements */}
                <motion.div
                  animate={{
                    y: [-15, 15, -15],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -right-6 w-20 h-20 bg-slate-800 dark:bg-slate-200 rounded-2xl shadow-2xl flex items-center justify-center backdrop-blur-sm"
                >
                  <MapPin className="w-10 h-10 text-white dark:text-slate-800" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [15, -15, 15],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-6 -left-6 w-20 h-20 bg-emerald-600 dark:bg-emerald-500 rounded-2xl shadow-2xl flex items-center justify-center backdrop-blur-sm"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/3 -left-4 w-16 h-16 bg-amber-600 dark:bg-amber-500 rounded-xl shadow-xl flex items-center justify-center backdrop-blur-sm"
                >
                  <Bell className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer group"
            onClick={() => {
              const featuresSection = document.getElementById("features");
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <span className="text-sm mb-2 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300">
              Discover Features
            </span>
            <ChevronDown className="w-6 h-6 group-hover:animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Features Section with unified background */}
      <section id="features" className="relative py-24 overflow-hidden">
        {/* Same background as hero section */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-stone-50/50 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-stone-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-500/5 to-transparent" />

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
              className="inline-flex items-center px-6 py-3 mb-8 rounded-full border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 text-sm font-semibold shadow-lg"
            >
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-800 dark:text-slate-200">
                Powerful Features
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-slate-900 dark:text-slate-100">
                Everything You Need
              </span>
              <br />
              <span className="text-slate-700 dark:text-slate-300">
                In One Platform
              </span>
            </h2>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform offers intelligent tools designed to
              revolutionize campus transportation management with cutting-edge
              technology.
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
                <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-700/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-slate-200/50 dark:border-slate-700/50 group-hover:border-slate-300 dark:group-hover:border-slate-600 group-hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100 group-hover:text-slate-800 dark:group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect indicator */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 overflow-hidden">
        {/* Natural background */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-slate-50/30 to-gray-50/30 dark:from-slate-900 dark:via-stone-900/20 dark:to-slate-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-300/10 via-transparent to-transparent" />

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
              className="inline-flex items-center px-4 py-2 mb-6 rounded-full border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 text-sm font-semibold shadow-lg"
            >
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-800 dark:text-slate-200">
                Simple Process
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-slate-900 dark:text-slate-100">How It</span>{" "}
              <span className="text-slate-700 dark:text-slate-300">Works</span>
            </h2>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Our platform seamlessly connects all stakeholders in the campus
              transportation ecosystem through an intuitive and streamlined
              process.
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
                  <div className="absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block z-0">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.3 }}
                      className="absolute inset-0 bg-emerald-500 dark:bg-emerald-400 origin-left rounded-full"
                    />
                  </div>
                )}

                {/* Step number with natural styling */}
                <div className="relative mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-slate-800 dark:bg-slate-200 flex items-center justify-center text-white dark:text-slate-900 text-2xl font-bold shadow-2xl relative z-10 group-hover:shadow-slate-500/50 dark:group-hover:shadow-slate-300/50 transition-all duration-300"
                  >
                    {index + 1}
                  </motion.div>

                  {/* Pulsing background effect */}
                  <div className="absolute inset-0 w-20 h-20 rounded-full bg-slate-600 dark:bg-slate-400 animate-ping opacity-20" />

                  {/* Outer glow ring */}
                  <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-all duration-300 scale-125" />
                </div>

                <motion.h3
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100 group-hover:text-slate-800 dark:group-hover:text-white transition-colors duration-300"
                >
                  {step.title}
                </motion.h3>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg max-w-sm">
                  {step.description}
                </p>

                {/* Subtle indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                  className="mt-6 w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-60"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section
        id="roles"
        className="relative py-20 bg-slate-50 dark:bg-slate-900"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
              User Roles
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100">
              Choose Your{" "}
              <span className="text-slate-700 dark:text-slate-300">Role</span>
            </h2>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Our platform caters to different stakeholders in the campus bus
              ecosystem, each with tailored features and experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-24 flex items-center justify-center bg-slate-700 dark:bg-slate-600">
                  <role.icon className="w-8 h-8 text-white" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                    {role.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {role.description}
                  </p>

                  <Link to={role.loginPath}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-slate-50 dark:group-hover:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500"
                    >
                      Login as {role.title}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-slate-100 dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Ready to Transform Your Campus Transportation?
            </h2>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students, drivers, and coordinators who are
              already using our platform to make campus transportation more
              efficient.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/student">
                <Button
                  size="lg"
                  className="group bg-slate-800 dark:bg-white text-white dark:text-slate-800 hover:bg-slate-900 dark:hover:bg-slate-50 px-10 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="group px-10 py-4 text-lg font-bold border-2 border-slate-800 dark:border-white text-slate-800 dark:text-white hover:bg-slate-800 dark:hover:bg-white hover:text-white dark:hover:text-slate-800 transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  try {
                    const featuresSection = document.getElementById("features");
                    if (featuresSection) {
                      featuresSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                        inline: "nearest",
                      });
                    }
                  } catch (error) {
                    console.warn("Scroll to features failed:", error);
                  }
                }}
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 mt-8 text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Free to Start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Instant Setup</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 bg-slate-900 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-800 dark:bg-slate-200 rounded-lg flex items-center justify-center">
                  <Bus className="h-5 w-5 text-white dark:text-slate-800" />
                </div>
                <span className="font-semibold text-xl text-white">
                  Campus Bus Assistant
                </span>
              </div>

              <p className="text-slate-400 leading-relaxed">
                Revolutionizing campus transportation with smart technology,
                real-time insights, and seamless user experiences.
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Features</h3>
              <ul className="space-y-2">
                {[
                  "Real-time Tracking",
                  "Voting System",
                  "Route Guidance",
                  "Emergency Assistance",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#features"
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Roles */}
            <div>
              <h3 className="font-semibold mb-4 text-white">User Roles</h3>
              <ul className="space-y-2">
                {[
                  { name: "Student", path: "/login/student" },
                  { name: "Driver", path: "/login/driver" },
                  { name: "Coordinator", path: "/login/coordinator" },
                  { name: "Administrator", path: "/login/admin" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2">
                {[
                  "Contact Support",
                  "Help Center",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-center md:text-left">
                © {new Date().getFullYear()} Campus Bus Assistant. All rights
                reserved.
              </p>

              <div className="flex items-center space-x-4 mt-4 md:mt-0 text-sm text-slate-400">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>System Operational</span>
                </span>
                <span>Version 2.0</span>
              </div>
            </div>
          </div>
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
    loginPath: "/login/student",
  },
  {
    title: "Driver",
    description:
      "Manage routes, update locations, and respond to emergency requests.",
    icon: Users,
    loginPath: "/login/driver",
  },
  {
    title: "Coordinator",
    description:
      "Oversee operations, manage schedules, and coordinate between all stakeholders.",
    icon: ShieldCheck,
    loginPath: "/login/coordinator",
  },
  {
    title: "Administrator",
    description:
      "Full system access with user management, analytics, and configuration controls.",
    icon: Shield,
    loginPath: "/login/admin",
  },
];

export default Index;
