"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Menu,
  X,
  Home,
  Library,
  Activity,
  Brain,
  Fingerprint,
  Mail,
  Heart,
  FileSearch,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { TrumpFilesBrand } from "@/components/TrumpFilesBrand";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={16} /> },
    { name: "Catalog", href: "/catalog", icon: <Library size={16} /> },
    { name: "Visualizer", href: "/visualizer", icon: <Activity size={16} /> },
    { name: "Insights", href: "/insights", icon: <FileSearch size={16} /> },
    { name: "WTF?", href: "/wtf", icon: <Brain size={16} /> },
    { name: "Enigma", href: "/enigma", icon: <Fingerprint size={16} /> },
    {
      name: "WHOAMI?", href: "/donate", icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
          <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
          <path d="m2 15 6 6" />
          <path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.83 2.83 0 0 0 16 3a2.8 2.8 0 0 0-2 1l-1.4 1.4" />
          <path d="m9.7 8.2-2.9-2.9a2.83 2.83 0 0 0-4 0 2.83 2.83 0 0 0 0 4l2.8 2.8" />
        </svg>
      )
    },
  ];

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setShowContact(false);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {/* Compact Horizontal Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-lg"
          style={{
            background: "linear-gradient(90deg, #f97316, #ef4444, #f97316)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: isHovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
            scale: isHovered ? 1.05 : 1,
            opacity: isHovered ? 0.5 : 0.25,
          }}
          transition={{
            backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.3 },
            opacity: { duration: 0.3 },
          }}
        />

        {/* Main compact container */}
        <motion.div
          className="relative flex items-center gap-0.5 px-2 py-1.5 rounded-full backdrop-blur-xl border border-orange-500/40"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,8,0,0.95) 50%, rgba(0,0,0,0.9) 100%)",
            boxShadow: isHovered
              ? "0 0 30px rgba(249, 115, 22, 0.35), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "0 0 15px rgba(249, 115, 22, 0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
          animate={{
            borderColor: isHovered ? "rgba(249, 115, 22, 0.6)" : "rgba(249, 115, 22, 0.4)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo + Brand - 3-Font Style (Static) */}
          <Link
            href="/"
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full hover:bg-orange-500/10 transition-all duration-300 group"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <Image
                src="/logos/trumpfiles_orange_logo.png"
                alt="Trump Files"
                width={34}
                height={34}
                className="drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                style={{ width: 'auto', height: 'auto' }}
              />
            </motion.div>
            <TrumpFilesBrand size="sm" static className="hidden sm:flex" />
          </Link>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent mx-3" />

          {/* Desktop Navigation - Compact */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <Link
                  href={item.href}
                  className={`relative group px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${pathname === item.href
                    ? "text-orange-300"
                    : "text-foreground/70 hover:text-orange-300"
                    }`}
                >
                  {/* Active background */}
                  {pathname === item.href && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-orange-500/15"
                      layoutId="activeNavBg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon */}
                  <span className={`relative z-10 ${pathname === item.href ? "text-orange-400" : "text-orange-400/50 group-hover:text-orange-400"}`}>
                    {item.icon}
                  </span>

                  <span className="relative z-10 text-[13px]" style={{ fontFamily: 'var(--font-arctic-guardian-regular)' }}>{item.name}</span>
                </Link>
              </motion.div>
            ))}

            {/* Contact Button */}
            <Button
              variant="ghost"
              onClick={() => setShowContact(true)}
              className="px-3 py-1.5 h-auto rounded-full text-[13px] font-medium text-foreground/70 hover:text-orange-300 transition-all duration-200 flex items-center gap-1.5 hover:bg-orange-500/10"
            >
              <Mail size={16} className="text-orange-400/50" />
              <span style={{ fontFamily: 'var(--font-arctic-guardian-regular)' }}>Contact</span>
            </Button>
          </div>



          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-1.5 rounded-full hover:bg-orange-500/10 transition-colors text-orange-400 ml-1"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 8, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-1/2 -translate-x-1/2 w-56 rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,8,0,0.95) 100%)",
                boxShadow: "0 0 30px rgba(249, 115, 22, 0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
                border: "1px solid rgba(249, 115, 22, 0.4)",
              }}
            >
              <div className="p-2 space-y-0.5">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${pathname === item.href
                        ? "bg-orange-500/15 text-orange-300"
                        : "text-foreground/70 hover:bg-orange-500/10 hover:text-orange-300"
                        }`}
                    >
                      <span className={pathname === item.href ? "text-orange-400" : "text-orange-400/50"}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Contact */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowContact(true);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/70 hover:bg-orange-500/10 hover:text-orange-300 transition-all duration-200 w-full"
                  >
                    <Mail size={16} className="text-orange-400/50" />
                    <span className="text-sm font-medium">Contact</span>
                  </button>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Contact Dialog */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="sm:max-w-[425px] bg-black/95 border-orange-500/30">
          <DialogHeader>
            <DialogTitle className="text-orange-400">Contact Us</DialogTitle>
            <DialogDescription>
              Have information to share? Found an error? We want to hear from you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                className="bg-black/50 border-orange-500/30 focus:border-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-black/50 border-orange-500/30 focus:border-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={4}
                className="bg-black/50 border-orange-500/30 focus:border-orange-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
