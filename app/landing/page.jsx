"use client";

import { TreePine, Leaf, ShoppingCart, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-25 text-slate-900">

      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-lg">
            <TreePine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">CarbonLeaf</h1>
            <p className="text-xs text-slate-600">Restore nature. Reward owners. Offset pollution.</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <a href="#features" className="text-sm hover:text-emerald-700">Features</a>
          <a href="#how" className="text-sm hover:text-emerald-700">How it works</a>
          <a href="#pricing" className="text-sm hover:text-emerald-700">Pricing</a>
          <a href="/auth/login" className="text-sm px-3 py-2 rounded-md hover:bg-emerald-50">Log in</a>
          <Button asChild>
            <a href="/auth/register">Get Started</a>
          </Button>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold leading-tight"
          >
            Turn trees into value — empower growers, offset emissions.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg text-slate-600 max-w-xl"
          >
            CarbonLeaf connects land stewards with businesses that need verified carbon credits. Track sequestration, mint credits, and trade them on a transparent marketplace.
          </motion.p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild>
              <a href="/register">Start planting</a>
            </Button>
            <a href="#how" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 text-emerald-700 text-sm hover:bg-emerald-50">
              <Leaf className="w-4 h-4" /> Learn how it works
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            <div className="p-4 bg-white shadow rounded-lg">
              <p className="text-sm text-slate-500">Verified growers</p>
              <p className="mt-2 text-xl font-semibold">12k+</p>
            </div>
            <div className="p-4 bg-white shadow rounded-lg">
              <p className="text-sm text-slate-500">Credits minted</p>
              <p className="mt-2 text-xl font-semibold">320k</p>
            </div>
            <div className="p-4 bg-white shadow rounded-lg">
              <p className="text-sm text-slate-500">Companies onboard</p>
              <p className="mt-2 text-xl font-semibold">980</p>
            </div>
          </div>
        </div>

        {/* Illustration / card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 ring-1 ring-emerald-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TreePine className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Sample parcel</p>
                <p className="font-semibold">Riverbank Farm — 120 trees</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-slate-500">Sequestration</p>
                <p className="font-semibold">1.2 tCO₂ / year</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-slate-500">Credits</p>
                <p className="font-semibold">96</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button asChild>
                <a href="/dashboard/owner">Manage</a>
              </Button>
              <a className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-100 text-emerald-700 text-sm">
                <ShoppingCart className="w-4 h-4" /> Buy credits
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center">What makes CarbonLeaf different</h3>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-emerald-50">
                <Leaf className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-semibold">Nature-backed credits</h4>
            </div>
            <p className="mt-4 text-slate-600">Credits are generated from verified sequestration models and on-ground audits.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-emerald-50">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-semibold">Grower-first economics</h4>
            </div>
            <p className="mt-4 text-slate-600">Fair pricing, transparent payouts, and capacity building for land stewards.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-emerald-50">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-semibold">Market-grade compliance</h4>
            </div>
            <p className="mt-4 text-slate-600">Audit-ready records, verifiable credits, and marketplace tooling for buyers.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center">How it works</h3>
        <ol className="mt-10 space-y-6">
          <li className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold">Register parcel</h4>
              <p className="text-slate-600">Growers register land and trees; upload proof and geolocation for verification.</p>
            </div>
          </li>

          <li className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold">Verify & quantify</h4>
              <p className="text-slate-600">We run modelled sequestration and optional field audits to mint credits.</p>
            </div>
          </li>

          <li className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold">Buy & retire</h4>
              <p className="text-slate-600">Companies buy credits and retire them against emissions on our platform.</p>
            </div>
          </li>
        </ol>
      </section>

      {/* PRICING / CTA */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold">Buy credits or partner with growers</h3>
            <p className="mt-2 text-slate-600">Flexible packages for enterprises, SMEs, and one-off purchases. Transparent fees and tracking.</p>
          </div>

          <div className="flex items-center justify-end">
            <Button asChild>
              <a href="/marketplace">Explore marketplace</a>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-16 border-t bg-emerald-25">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold">CarbonLeaf</h4>
            <p className="mt-2 text-slate-600">Empowering land stewards and companies to act on climate — transparently and fairly.</p>
          </div>

          <div>
            <h5 className="font-semibold">Product</h5>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li><a href="#how" className="hover:text-emerald-700">How it works</a></li>
              <li><a href="/dashboard" className="hover:text-emerald-700">Dashboard</a></li>
              <li><a href="/marketplace" className="hover:text-emerald-700">Marketplace</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold">Company</h5>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-slate-500 text-sm">© {new Date().getFullYear()} CarbonLeaf — All rights reserved.</div>
      </footer>
    </main>
  );
}
