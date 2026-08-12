"use client";

import { useState, useEffect } from "react";
import {
  TreePine,
  Leaf,
  ShoppingCart,
  UserCheck,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Globe,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/components/global/language-provider";

export default function LandingPage() {
  const { t, lang, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Active section detection
      const sections = ["features", "howitworks", "pricing"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 300;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax Hooks
  const { scrollY } = useScroll();

  // Hero background movements
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const rotate1 = useTransform(scrollY, [0, 500], [6, 0]);

  // Feature blobs movements
  const blobY1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const blobY2 = useTransform(scrollY, [0, 1000], [0, -100]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const navItems = [
    { label: t("landing.features"), id: "features" },
    { label: t("landing.how_it_works"), id: "howitworks" },
    { label: t("landing.explore"), id: "pricing" }
  ];

  const stats = [
    { label: t("landing.verified_growers"), val: "12k+" },
    { label: t("landing.credits_minted"), val: "320k" },
    { label: t("landing.companies"), val: "980" },
  ];

  const features = [
    {
      icon: Leaf,
      title: t("landing.nature_backed"),
      desc: t("landing.nature_backed_desc"),
    },
    {
      icon: UserCheck,
      title: t("landing.grower_first"),
      desc: t("landing.grower_first_desc"),
    },
    {
      icon: ShoppingCart,
      title: t("landing.market_grade"),
      desc: t("landing.market_grade_desc"),
    },
  ];

  const howWorks = [
    {
      step: "1",
      title: t("landing.register_parcel"),
      desc: t("landing.register_parcel_desc"),
      icon: Globe,
    },
    {
      step: "2",
      title: t("landing.verify_quantify"),
      desc: t("landing.verify_quantify_desc"),
      icon: CheckCircle,
    },
    {
      step: "3",
      title: t("landing.buy_retire"),
      desc: t("landing.buy_retire_desc"),
      icon: TrendingUp,
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-emerald-50 text-slate-900">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-emerald-100/50 shadow-sm py-3 md:py-4 md:top-4 md:max-w-7xl md:mx-auto md:rounded-2xl"
            : "bg-transparent py-6 max-w-7xl mx-auto"
        }`}
      >
        <div
          className={`flex items-center justify-between px-6 w-full ${
            isScrolled ? "" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-18 h-18 rounded-xl flex items-center justify-center  overflow-hidden"
            >
              <Image
                src="/images/logos/CARBON-LEAF-LOGO.png"
                alt="CarbonLeafs Logo"
                width={100}
                height={100}
                className="object-contain p-1"
              />
            </motion.div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`text-sm font-medium transition-colors relative group ${
                  activeSection === item.id 
                    ? "text-emerald-600" 
                    : "text-slate-600 hover:text-emerald-600"
                }`}
              >
                {item.label}
                <span 
                  className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${
                    activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>
            ))}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              {/* Language Dropdown */}
              <div className="relative group">
                <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
                  {lang.toUpperCase()}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {["en", "fr", "rw"].map((language) => (
                    <button
                      key={language}
                      onClick={() => setLanguage(language)}
                      className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        lang === language
                          ? "bg-emerald-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {language === "en" && "English"}
                      {language === "fr" && "Français"}
                      {language === "rw" && "Kinyarwanda"}
                    </button>
                  ))}
                </div>
              </div>
              <a
                href="/signin"
                className="text-sm font-medium hover:text-emerald-700 px-2 transition-colors"
              >
                {t("landing.log_in")}
              </a>
              <Button
                asChild
                className="shadow-emerald-200/50 shadow-lg hover:shadow-emerald-200/80 transition-all hover:-translate-y-0.5"
              >
                <a href="/signup">{t("landing.get_started")}</a>
              </Button>
            </div>
          </nav>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-b border-emerald-100 shadow-lg overflow-hidden fixed top-[88px] left-0 right-0 z-40"
          >
            <nav className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-base font-medium text-slate-700 hover:text-emerald-700 py-2 flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </a>
              ))}
              <hr className="border-slate-100" />
              {/* Mobile Language Switcher */}
              <div className="space-y-2 py-2">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2">Language</p>
                {["en", "fr", "rw"].map((language) => (
                  <button
                    key={language}
                    onClick={() => {
                      setLanguage(language);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      lang === language
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {language === "en" && "English"}
                    {language === "fr" && "Français"}
                    {language === "rw" && "Kinyarwanda"}
                  </button>
                ))}
              </div>
              <a
                href="/signin"
                className="text-base font-medium hover:text-emerald-700 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("landing.log_in")}
              </a>
              <Button asChild className="w-full">
                <a href="/signup" onClick={() => setIsMenuOpen(false)}>
                  {t("landing.get_started")}
                </a>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0, y: 0 }}
            transition={{ delay: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold mt-[60px] mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900"
          >
            {t("landing.hero_title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed"
          >
            {t("landing.hero_description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base shadow-emerald-200 shadow-lg hover:shadow-xl hover:shadow-emerald-200/60 transition-all hover:-translate-y-1"
            >
              <a href="/signup">
                {t("landing.start_planting")} <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
            >
              <Leaf className="w-4 h-4" /> {t("landing.learn_how")}
            </a>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-4 bg-white shadow-sm hover:shadow-md transition-all rounded-xl border border-emerald-50/50 group hover:-translate-y-1"
              >
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">
                  {stat.val}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="relative perspective-1000">
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 6 }}
            style={{ y: y1, rotate: rotate1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="absolute top-0 left-12 right-0 bottom-0 bg-emerald-100 rounded-[2.5rem] -z-10 transform origin-bottom-right"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: -3 }}
            style={{ y: y2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-4 left-4 right-4 -bottom-2.5 bg-teal-50/80 rounded-4xl -z-20 border border-emerald-100"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, y: 20, rotate: 0 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: -2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative aspect-square md:aspect-video lg:aspect-4/3 rounded-4xl shadow-2xl ring-4 ring-white group transform hover:rotate-0 transition-all duration-500"
          >
            <div className="absolute inset-0 rounded-4xl overflow-hidden">
              <Image
                src="/images/tree.png"
                alt="Sustainable forestry project"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-80"></div>
            </div>

            <motion.div
              initial={{ x: -20, y: 20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 md:-left-10 md:bottom-8 right-4 md:right-auto md:w-80 z-20"
            >
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/50 flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 shadow-inner">
                  <TreePine className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {t("landing.live_project")}
                  </p>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {t("landing.riverbank_reforestation")}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-600" />
                      <span className="text-xs text-slate-600 font-medium">
                        120 {t("landing.trees")}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <section className="border-y border-emerald-100 bg-emerald-50/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              {t("landing.supervised_by")}
            </p>
            <div className="hidden md:block h-8 w-px bg-emerald-200"></div>
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/images/Rema_logo.png"
                alt="REMA Rwanda"
                width={180}
                height={80}
                className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative overflow-hidden"
      >
        {/* Background decoration with Parallax */}
        <motion.div
          style={{ y: blobY1 }}
          className="absolute top-40 left-0 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"
        ></motion.div>
        <motion.div
          style={{ y: blobY2 }}
          className="absolute bottom-40 right-0 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"
        ></motion.div>

        <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900">
            {t("landing.what_makes_different")}
          </h3>
          <p className="mt-4 text-slate-600 text-lg">
            {t("landing.bridge_gap")}
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="p-8 bg-white rounded-2xl shadow-sm border border-emerald-50 hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xl text-slate-800">
                  {feature.title}
                </h4>
              </div>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="howitworks"
        className="bg-slate-50 border-y border-slate-200 relative"
      >
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900">{t("landing.how_works_title")}</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-emerald-100 z-0"></div>

            {howWorks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center z-10"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white border-2 border-emerald-100 flex items-center justify-center text-xl font-bold text-emerald-600 shadow-sm mb-6 group hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300">
                  <item.icon className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-lg mb-3 text-slate-800">
                  {item.title}
                </h4>
                <p className="text-slate-600 text-sm px-4 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / CTA */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[2.5rem] shadow-2xl shadow-emerald-900/20 p-8 md:p-16 grid md:grid-cols-2 gap-10 items-center text-white overflow-hidden"
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner-tree-maintenance.jpg"
              alt="Sustainable tree maintenance"
              fill
              className="object-cover"
            />
            {/* Gradient Overlays for Text Readability */}
            <div className="absolute inset-0 bg-linear-to-r from-emerald-950 via-emerald-950/90 to-emerald-900/60"></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold leading-tight">
              {t("landing.ready_impact")}
            </h3>
            <p className="mt-6 text-emerald-100 text-lg max-w-md">
              {t("landing.join_hundreds")}
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3 text-emerald-50 font-medium">
                <div className="bg-emerald-800/50 p-1.5 rounded-full">
                  <Leaf className="w-4 h-4 text-emerald-300" />
                </div>
                <span>{t("landing.verified_credits")}</span>
              </li>
              <li className="flex items-center gap-3 text-emerald-50 font-medium">
                <div className="bg-emerald-800/50 p-1.5 rounded-full">
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                </div>
                <span>{t("landing.direct_impact")}</span>
              </li>
            </ul>

            <div className="mt-8 pt-8 border-t border-emerald-800/50">
              <p className="text-xs text-emerald-300 font-semibold uppercase tracking-widest mb-3">
                {t("landing.supervised_by")}
              </p>
              <div className=" p-3 rounded-xl inline-block">
                <Image
                  src="/images/Rema_logo.png"
                  alt="REMA Rwanda"
                  width={140}
                  height={50}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end relative z-10 mt-4 md:mt-0">
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
              asChild
            >
              <a href="/marketplace">{t("landing.explore_marketplace")}</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg border-emerald-700/50 bg-emerald-900/50 backdrop-blur-sm text-white hover:bg-emerald-800 hover:text-white hover:border-emerald-600 transition-all duration-300"
              asChild
            >
              <a href="/signup">{t("landing.register_practioner")}</a>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-md border border-emerald-100 overflow-hidden">
                <Image
                  src="/images/logos/CARBON-LEAF-LOGO.png"
                  alt="CarbonLeafs Logo"
                  width={40}
                  height={40}
                  className="object-contain p-1"
                />
              </div>
              <span className="font-bold text-xl text-slate-900">
                CarbonLeaf
              </span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
              {t("landing.empower_land")}
            </p>

            <div className="mt-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t("landing.supervised_by")}
              </p>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl inline-block grayscale hover:grayscale-0 transition-all">
                <Image
                  src="/images/Rema_logo.png"
                  alt="REMA Rwanda"
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-6">{t("landing.product")}</h5>
            <ul className="space-y-4 text-slate-600">
              <li>
                <a
                  href="#features"
                  className="hover:text-emerald-600 transition-colors block"
                >
                  {t("landing.features")}
                </a>
              </li>
              <li>
                <a
                  href="#how"
                  className="hover:text-emerald-600 transition-colors block"
                >
                  {t("landing.how_it_works")}
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-emerald-600 transition-colors block"
                >
                  {t("landing.dashboard")}
                </a>
              </li>
              <li>
                <a
                  href="/marketplace"
                  className="hover:text-emerald-600 transition-colors block"
                >
                  {t("landing.marketplace")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-6">{t("landing.company")}</h5>
            <ul className="space-y-4 text-slate-600">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 transition-colors block"
                >
                  {t("landing.about_us")}
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 transition-colors block"
                >
                  {t("landing.privacy_policy")}
                </a>
              </li> */}
              <li>
                <a
                  href="/terms"
                  className="hover:text-emerald-600 transition-colors block"
                >
                  {t("landing.terms_service")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 transition-colors block"
                >
                  {t("landing.contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} CarbonLeaf. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-600 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
