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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isHeaderSolid
            ? "bg-white/90 backdrop-blur-sm shadow-subtle py-4"
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Bus className="h-6 w-6 text-primary z-10 relative" />
              <div className="absolute -inset-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"></div>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Campus Bus Assistant
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
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
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              onClick={(e) => {
                e.preventDefault();
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
              className="text-sm font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              onClick={(e) => {
                e.preventDefault();
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
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`h-0.5 w-full bg-gray-600 transition-transform ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`h-0.5 w-full bg-gray-600 transition-opacity ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`h-0.5 w-full bg-gray-600 transition-transform ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>

          <div className="hidden md:block">
            {isAuthenticated ? (
              <Link to={`/${user?.role}`}>
                <Button className="shadow-md hover:shadow-lg transition-shadow">
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="shadow-md hover:shadow-lg transition-shadow group">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden fixed inset-x-0 top-[72px] bg-white border-b transition-all duration-300",
            mobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          )}
        >
          <div className="container mx-auto flex flex-col space-y-4 px-4">
            <a
              href="#features"
              className="text-sm font-medium py-2 border-b border-gray-100"
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
              className="text-sm font-medium py-2 border-b border-gray-100"
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
              className="text-sm font-medium py-2 border-b border-gray-100"
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white pointer-events-none" />

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-100/50 blur-3xl"
            animate={{
              x: [0, 10, 0],
              y: [0, -15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-100/40 blur-3xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/4 left-1/3 w-60 h-60 rounded-full bg-blue-50/30 blur-3xl"
            animate={{
              x: [0, 15, 0],
              y: [0, 15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center py-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col space-y-6 px-4 md:px-0"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center px-3 py-1.5 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Reliable Campus
                Transportation
              </motion.div>
            </div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Campus Bus{" "}
              <span className="relative">
                <span className="relative z-10 text-primary">
                  Transportation
                </span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/10 rounded-sm -z-0"></span>
              </span>{" "}
              Made Effortless
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 max-w-lg"
            >
              A seamless platform connecting students, drivers, and
              administrators for efficient campus transportation management.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4"
            >
              <Link to="/login">
                <Button
                  size="lg"
                  className="font-medium text-base shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-0.5 duration-300 w-full sm:w-auto"
                >
                  Login Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="font-medium text-base border-2 hover:bg-gray-50 w-full sm:w-auto"
                onClick={() => {
                  const howItWorksSection =
                    document.getElementById("how-it-works");
                  if (howItWorksSection) {
                    const rect = howItWorksSection.getBoundingClientRect();
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
                Learn More
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center space-x-4 pt-6 text-sm text-gray-500"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-primary-400 flex items-center justify-center text-white text-xs font-medium ring-2 ring-white"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p>Trusted by 2000+ students across campuses</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[400px] flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gradient-to-br from-blue-400/5 to-primary/5 rounded-full flex items-center justify-center animate-spin-slow">
                  <div className="w-4 h-4 bg-primary rounded-full absolute top-0" />
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[250px] h-[250px] md:w-[350px] md:h-[350px] backdrop-blur-sm bg-white/30 rounded-full shadow-card flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/5" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Bus className="w-32 h-32 text-primary/80 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
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
        className="py-20 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" /> Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers a comprehensive set of tools designed to
              streamline campus transportation logistics.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow relative overflow-hidden group border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative z-10">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-gray-600 relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" /> Easy Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform connects all stakeholders in the campus
              transportation ecosystem through a simple process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-white text-xl font-bold mb-4 shadow-md">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-8 left-full w-full h-0.5 bg-primary/20 hidden md:block">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute inset-0 bg-primary origin-left"
                      />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section
        id="roles"
        className="py-20 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" /> User Roles
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Role
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform caters to different stakeholders in the campus bus
              ecosystem, each with tailored features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl overflow-hidden shadow-card hover:-translate-y-1 transition-transform"
              >
                <div
                  className={`h-28 flex items-center justify-center ${role.bgClass} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
                  </div>
                  <role.icon className="w-12 h-12 text-white relative z-10" />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                  <p className="text-gray-600 mb-6">{role.description}</p>
                  <Link to={role.loginPath}>
                    <Button
                      variant="outline"
                      className="w-full group hover:bg-gray-50/80"
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
      <section className="py-16 bg-gradient-to-r from-primary/10 to-blue-600/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Simplify Campus Transportation?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students, drivers, and coordinators who are
              already using our platform to make campus transportation more
              efficient.
            </p>
            <Link to="/login">
              <Button
                size="lg"
                className="shadow-lg hover:shadow-xl transition-shadow text-lg px-8"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Bus className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Campus Bus Assistant</span>
              </div>
              <p className="text-gray-500 text-sm">
                Simplifying campus transportation for students and
                administrators.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Real-time Tracking
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Voting System
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Route Guidance
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Emergency Assistance
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">User Roles</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/login/student"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Student
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login/driver"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Driver
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login/coordinator"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Coordinator
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login/admin"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Administrator
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-primary text-sm"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <div className="flex flex-col items-center space-y-3">
              <p>
                © {new Date().getFullYear()} Campus Bus Assistant. All rights
                reserved.
              </p>
              <p>Made by ZeN GrooT</p>
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
