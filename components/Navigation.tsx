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
import { Menu, X, Home, Library, Activity, HelpCircle, FileQuestion, ShieldAlert, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { TrumpFilesBrand } from "@/components/TrumpFilesBrand";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Catalog", href: "/catalog", icon: <Library size={18} /> },
    { name: "Visualizer", href: "/visualizer", icon: <Activity size={18} /> },
    { name: "WTF?", href: "/wtf", icon: <HelpCircle size={18} /> },
    { name: "The Enigma", href: "/enigma", icon: <FileQuestion size={18} /> },
    //{ name: "Admin", href: "/admin", icon: <ShieldAlert size={18} /> }, // Hidden for now as per task
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
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-linear-to-r from-orange-950/80 via-black/80 to-orange-950/80 border-b border-orange-500/20 shadow-lg shadow-orange-500/10"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2"
              data-oid="aplmg26"
            >
              <Image
                src="/logos/trumpfiles_orange_logo.png"
                alt="Trump Files"
                width={48}
                height={48}
              />

              <TrumpFilesBrand size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative group px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300 overflow-hidden flex items-center gap-2 ${
                    pathname === item.href
                      ? "text-orange-400"
                      : "text-foreground/80 hover:text-orange-300"
                  }`}
                >
                  {/* Multi-layered animated background */}
                  <span className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    pathname === item.href
                      ? "bg-linear-to-r from-orange-600/30 via-orange-500/30 to-red-500/30 scale-100"
                      : "bg-linear-to-r from-orange-600/0 via-orange-500/0 to-red-500/0 scale-95 group-hover:scale-100 group-hover:from-orange-600/20 group-hover:via-orange-500/20 group-hover:to-red-500/20"
                  }`} />
                  
                  {/* Glowing border layer */}
                  <span className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    pathname === item.href
                      ? "ring-2 ring-orange-500/50 ring-offset-2 ring-offset-transparent"
                      : "ring-0 ring-orange-500/0 group-hover:ring-1 group-hover:ring-orange-500/30"
                  }`} />

                  {/* Icon with animation */}
                  <span className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 text-orange-400/80 group-hover:text-orange-400">
                    {item.icon}
                  </span>

                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}
              <Button
                variant="ghost"
                onClick={() => setShowContact(true)}
                className="ml-2 relative group px-5 py-2.5 rounded-full text-base font-medium text-foreground/80 hover:text-orange-300 transition-all duration-300 overflow-hidden flex items-center gap-2"
              >
                <span className="absolute inset-0 rounded-full bg-linear-to-r from-orange-600/0 via-orange-500/0 to-red-500/0 scale-95 group-hover:scale-100 group-hover:from-orange-600/20 group-hover:via-orange-500/20 group-hover:to-red-500/20 transition-all duration-300" />
                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 text-orange-400/80 group-hover:text-orange-400">
                  <Mail size={18} />
                </span>
                <span className="relative z-10">Contact</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              data-oid="cwx3jj4"
            >
              {isOpen ? (
                <X size={24} data-oid="7ogodd3" />
              ) : (
                <Menu size={24} data-oid="74490it" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence data-oid="bu.5ht9">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/10"
              data-oid="_ha-9-."
            >
              <div
                className="container mx-auto px-4 py-4 space-y-2"
                data-oid="g6-ij6j"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === item.href
                        ? "bg-primary/20 text-primary"
                        : "text-foreground/80 hover:text-foreground hover:bg-white/5"
                    }`}
                    data-oid="o84b_j7"
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowContact(true);
                    setIsOpen(false);
                  }}
                  className="w-full justify-start"
                  data-oid="rj1l0x-"
                >
                  Contact
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Contact Dialog */}
      <Dialog
        open={showContact}
        onOpenChange={setShowContact}
        data-oid="8bhrqky"
      >
        <DialogContent
          className="glass-card border-white/10"
          data-oid="qbhgxw5"
        >
          <DialogHeader data-oid="24bdr5a">
            <DialogTitle data-oid="dqa8f:-">Contact Us</DialogTitle>
            <DialogDescription data-oid="g4r5bjl">
              Send us a message and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleContactSubmit}
            className="space-y-4"
            data-oid="e_9d3dt"
          >
            <div className="space-y-2" data-oid="0p9cl5v">
              <Label htmlFor="name" data-oid="z8p0qp6">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                required
                className="bg-white/5 border-white/10"
                data-oid="nrsaig-"
              />
            </div>
            <div className="space-y-2" data-oid="31z1cn6">
              <Label htmlFor="email" data-oid="3hy1wgt">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-white/5 border-white/10"
                data-oid="bvzor6k"
              />
            </div>
            <div className="space-y-2" data-oid="868y0ls">
              <Label htmlFor="message" data-oid="_4w_ut6">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={4}
                className="bg-white/5 border-white/10"
                data-oid="7pkediz"
              />
            </div>
            <Button type="submit" className="w-full" data-oid="xdx4fd3">
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
