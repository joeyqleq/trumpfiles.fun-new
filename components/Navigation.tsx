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
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { TrumpFilesBrand } from "@/components/TrumpFilesBrand";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/catalog" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "WTF?", href: "/wtf" },
    { name: "Admin", href: "/admin" },
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
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10"
        data-oid="0o-.u5_"
      >
        <div className="container mx-auto px-4" data-oid="d4fe8_.">
          <div
            className="flex items-center justify-between h-16"
            data-oid="3lk4pi2"
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2"
              data-oid="p0ta1fe"
            >
              <Image
                src="/logos/trumpfiles_orange_logo.png"
                alt="Trump Files"
                width={48}
                height={48}
                data-oid="84iw-g7"
              />

              <TrumpFilesBrand size="md" variant="nav" data-oid="4o.0opf" />
            </Link>

            {/* Desktop Navigation */}
            <div
              className="hidden md:flex items-center space-x-1"
              data-oid="qljfxh1"
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-primary/20 text-primary"
                      : "text-foreground/80 hover:text-foreground hover:bg-white/5"
                  }`}
                  data-oid="embqi6p"
                >
                  {item.name}
                </Link>
              ))}
              <Button
                variant="ghost"
                onClick={() => setShowContact(true)}
                className="ml-2"
                data-oid="c9t447n"
              >
                Contact
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              data-oid="h1a37l:"
            >
              {isOpen ? (
                <X size={24} data-oid="klbmmz3" />
              ) : (
                <Menu size={24} data-oid="m1w-rf6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence data-oid="omsohx1">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/10"
              data-oid="g49r2li"
            >
              <div
                className="container mx-auto px-4 py-4 space-y-2"
                data-oid="6u6pwc-"
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
                    data-oid="7tbgw74"
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
                  data-oid="9._temc"
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
        data-oid="6_ti:j5"
      >
        <DialogContent
          className="glass-card border-white/10"
          data-oid="eknjg3g"
        >
          <DialogHeader data-oid="t86uohj">
            <DialogTitle data-oid="dmcc35c">Contact Us</DialogTitle>
            <DialogDescription data-oid="belpm9x">
              Send us a message and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleContactSubmit}
            className="space-y-4"
            data-oid="n_p:5:-"
          >
            <div className="space-y-2" data-oid="kz3unpe">
              <Label htmlFor="name" data-oid="9jv2nmh">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                required
                className="bg-white/5 border-white/10"
                data-oid="5cr.yz."
              />
            </div>
            <div className="space-y-2" data-oid="0j4zi88">
              <Label htmlFor="email" data-oid="lc.5f5e">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-white/5 border-white/10"
                data-oid="in_u05u"
              />
            </div>
            <div className="space-y-2" data-oid="nxxtw7j">
              <Label htmlFor="message" data-oid="qgu4upd">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={4}
                className="bg-white/5 border-white/10"
                data-oid=":poxvh0"
              />
            </div>
            <Button type="submit" className="w-full" data-oid="w32pdt:">
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
