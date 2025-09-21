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
        {/* Clean background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900" />

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Smart Campus Transportation
              </motion.div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-white">
                  Streamline Your
                </span>
                <br />
                <span className="text-blue-600 dark:text-blue-400">
                  Campus Transportation
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Connect students, drivers, and coordinators with our
                comprehensive platform. Track buses in real-time, manage routes
                efficiently, and ensure safe transportation for everyone.
              </p>

              {/* CTAs */}
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

              {/* Trust indicators */}
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
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center"
                >
                  <MapPin className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
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

      {/* Features Section */}
      <section
        id="features"
        className="relative py-20 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Platform Features
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Everything You Need for
              <span className="text-blue-600 dark:text-blue-400">
                {" "}
                Smart Transportation
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform brings together all the tools needed to
              manage campus transportation efficiently and safely.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="relative py-20 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Simple Process
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              How It{" "}
              <span className="text-blue-600 dark:text-blue-400">Works</span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our platform seamlessly connects all stakeholders in the campus
              transportation ecosystem through an intuitive process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto shadow-lg">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 dark:bg-blue-800">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.3 }}
                        className="absolute inset-0 bg-blue-600 origin-left"
                      />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section id="roles" className="relative py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              User Roles
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Choose Your{" "}
              <span className="text-blue-600 dark:text-blue-400">Role</span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
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
                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`h-24 flex items-center justify-center ${role.bgClass}`}
                >
                  <role.icon className="w-8 h-8 text-white" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {role.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {role.description}
                  </p>

                  <Link to={role.loginPath}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 border-gray-300 dark:border-gray-600"
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
      <section className="relative py-20 bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Campus Transportation?
            </h2>

            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students, drivers, and coordinators who are
              already using our platform to make campus transportation more
              efficient.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 mt-8 text-blue-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free to Start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Instant Setup</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 bg-gray-900 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bus className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-xl text-white">
                  Campus Bus Assistant
                </span>
              </div>

              <p className="text-gray-400 leading-relaxed">
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
                      className="text-gray-400 hover:text-blue-400 transition-colors"
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
                      className="text-gray-400 hover:text-blue-400 transition-colors"
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
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left">
                © {new Date().getFullYear()} Campus Bus Assistant. All rights
                reserved.
              </p>

              <div className="flex items-center space-x-4 mt-4 md:mt-0 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
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
    bgClass: "bg-gradient-to-br from-blue-500 to-blue-600",
    loginPath: "/login/student",
  },
  {
    title: "Driver",
    description:
      "Manage routes, update locations, and respond to emergency requests efficiently.",
    icon: Users,
    bgClass: "bg-gradient-to-br from-green-500 to-green-600",
    loginPath: "/login/driver",
  },
  {
    title: "Coordinator",
    description:
      "Oversee operations, manage schedules, and coordinate between all stakeholders.",
    icon: ShieldCheck,
    bgClass: "bg-gradient-to-br from-purple-500 to-purple-600",
    loginPath: "/login/coordinator",
  },
  {
    title: "Administrator",
    description:
      "Full system access with user management, analytics, and configuration controls.",
    icon: Shield,
    bgClass: "bg-gradient-to-br from-orange-500 to-orange-600",
    loginPath: "/login/admin",
  },
];

export default Index;
