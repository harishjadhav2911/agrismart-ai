"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Sprout,
  Bug,
  CloudSun,
  Landmark,
  TrendingUp,
  ChevronRight,
  Star,
  Leaf
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Bot,
      title: t("f_ai_title"),
      description: t("f_ai_desc"),
      href: "/guidance"
    },
    {
      icon: Sprout,
      title: t("f_crop_title"),
      description: t("f_crop_desc"),
      href: "/crop-recommendation"
    },
    {
      icon: Bug,
      title: t("f_disease_title"),
      description: t("f_disease_desc"),
      href: "/disease-detection"
    },
    {
      icon: CloudSun,
      title: t("f_weather_title"),
      description: t("f_weather_desc"),
      href: "/weather"
    },
    {
      icon: Landmark,
      title: t("f_gov_title"),
      description: t("f_gov_desc"),
      href: "/schemes"
    },
    {
      icon: TrendingUp,
      title: t("f_market_title"),
      description: t("f_market_desc"),
      href: "/market"
    }
  ];

  const stats = [
    { value: "50,000+", label: t("stats_farmers") },
    { value: "120+", label: t("stats_crops") },
    { value: "98%", label: t("stats_acc") },
    { value: "15+", label: t("stats_lang") }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Wheat Farmer, Punjab",
      quote: "AgriSmart AI completely changed how I farm. The weather alerts saved my entire crop last season!"
    },
    {
      name: "Sunita Devi",
      role: "Vegetable Grower, Maharashtra",
      quote: "The disease detection feature is like magic. I just point my camera and it tells me exactly what pesticide to use."
    },
    {
      name: "Amit Patel",
      role: "Cotton Farmer, Gujarat",
      quote: "Knowing the live market prices helped me negotiate better and increase my income by 30% this year."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-gray-950 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex-grow flex items-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Happy Indian Farmer in green field"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/70 to-transparent dark:from-black/95 dark:via-gray-900/80"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary-500/20 text-primary-200 font-medium text-sm border border-primary-500/30 mb-6 backdrop-blur-sm">
                {t("hero_tag")}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                {t("hero_title1")} <br />
                <span className="text-primary-300">{t("hero_title2")}</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
                {t("hero_sub")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 group">
                  {t("btn_get_started")}
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/guidance" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
                  <Bot size={20} />
                  {t("btn_talk_ai")}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-400 mb-4">{t("feat_title")}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t("feat_sub")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link href={feature.href} key={index} className="block cursor-pointer">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all group h-full"
                >
                  <div className="w-14 h-14 bg-primary-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-500 transition-colors">
                    <feature.icon size={28} className="text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-900 dark:bg-gray-950 text-white border-y border-primary-800 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-primary-300 dark:text-primary-500 mb-2">{stat.value}</div>
                <div className="text-primary-100 dark:text-gray-400 font-medium text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-400 mb-4">{t("test_title")}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t("test_sub")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-primary-50/50 dark:bg-gray-900 p-8 rounded-2xl border border-primary-100 dark:border-gray-800 relative"
              >
                <div className="flex text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-gray-500 dark:text-gray-400">Advanced AI instantly identifies crop diseases from photos and recommends treatments in &quot;kisan-friendly&quot; language.</p>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-primary-700 dark:text-primary-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600 dark:bg-primary-900"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t("cta_title")}</h2>
          <p className="text-xl text-primary-100 mb-10">{t("cta_sub")}</p>
          <Link href="/register" className="inline-block bg-white text-primary-700 hover:bg-gray-50 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            {t("cta_btn")}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={24} className="text-primary-500" />
                <span className="font-bold text-xl text-white">AgriSmart AI</span>
              </div>
              <p className="mb-6 max-w-sm">
                Empowering farmers with artificial intelligence to make better decisions, increase yields, and maximize profits.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary-400 transition-colors">{t("nav_home")}</a></li>
                <li><a href="#features" className="hover:text-primary-400 transition-colors">Features</a></li>
                <li><a href="#testimonials" className="hover:text-primary-400 transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {new Date().getFullYear()} AgriSmart AI. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with ❤️ for farmers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
