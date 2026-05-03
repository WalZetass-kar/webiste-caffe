"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCafeSettings } from "@/components/providers/settings-provider";
import { Badge } from "@/components/ui/badge";
import type { MenuRecord, RecommendedMenuRecord, RatingRecord } from "@/lib/models";
import { cafeStats, menuCategories, serviceHighlights, testimonials } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { TechStack } from "@/components/sections/tech-stack";
import { TemplateFeatures } from "@/components/sections/template-features";
import { DemoCredentials } from "@/components/sections/demo-credentials";
import { TrustBadges } from "@/components/sections/trust-badges";
import { FAQ } from "@/components/sections/faq";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#featured-menu" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
    title: "Morning brew ritual",
  },
  {
    src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=80",
    title: "Warm cafe interior",
  },
  {
    src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1400&q=80",
    title: "Barista at work",
  },
  {
    src: "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1400&q=80",
    title: "Dessert pairing",
  },
];

const socialTemplates = [
  {
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.88 2.12a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M14.73 3c.18 1.5 1.02 2.9 2.27 3.77.87.61 1.9.94 2.96.95V10.4a7.41 7.41 0 0 1-3.72-1v6.22a5.63 5.63 0 1 1-5.63-5.63c.29 0 .58.03.86.08v2.77a2.9 2.9 0 0 0-.86-.13 2.91 2.91 0 1 0 2.91 2.91V3h2.25Z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M12 2.2A9.78 9.78 0 0 0 3.6 17.1L2 22l5.02-1.57A9.8 9.8 0 1 0 12 2.2Zm0 17.82a8 8 0 0 1-4.08-1.12l-.29-.17-2.98.93.96-2.9-.19-.3A7.99 7.99 0 1 1 12 20.02Zm4.39-5.98c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.17-.7-.63-1.17-1.4-1.31-1.64-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.08 3.62.57.24 1.01.38 1.36.48.57.18 1.08.15 1.49.09.45-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
      </svg>
    ),
  },
];

type HomePageViewProps = {
  menus: MenuRecord[];
  recommendedMenus: RecommendedMenuRecord[];
  ratings: RatingRecord[];
};

export function HomePageView({ menus, recommendedMenus, ratings }: HomePageViewProps) {
  const { settings } = useCafeSettings();
  const [scrolled, setScrolled] = useState(false);
  const brandInitials =
    settings.cafeName
      .split(/\s+/)
      .map((item) => item.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CF";
  const socials = [
    { ...socialTemplates[0], href: settings.instagramUrl },
    { ...socialTemplates[1], href: settings.tiktokUrl },
    { ...socialTemplates[2], href: settings.whatsappUrl },
  ].filter((item) => item.href);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredMenus = menus.filter((item) => item.featured).slice(0, 4);
  const heroMenus = menus.slice(0, 3);

  return (
    <div className="bg-[#3e2723] text-[#d7ccc8]">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#4e342e]/95 shadow-[0_22px_60px_rgba(33,17,12,0.4)] backdrop-blur-xl" : "bg-[#4e342e]/80 backdrop-blur-sm"
        }`}
      >
        <div className="section-shell flex items-center justify-between py-3 lg:py-5">
          <Link href="/" className="flex items-center gap-2 lg:gap-3 text-[#d7ccc8]">
            <div className="flex h-9 w-9 lg:h-11 lg:w-11 items-center justify-center rounded-full border border-[#8d6e63]/40 bg-[#5d4037]/30 text-xs lg:text-sm font-semibold">
              {brandInitials}
            </div>
            <div>
              <p className="font-semibold text-sm lg:text-base">{settings.cafeName}</p>
              <p className="text-[9px] lg:text-xs uppercase tracking-wider lg:tracking-[0.28em] text-[#bcaaa4]">Premium Coffee</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-xs uppercase tracking-[0.24em] text-[#bcaaa4] lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-all duration-300 hover:text-[#d7ccc8] hover:tracking-[0.28em]">
                {item.label}
              </a>
            ))}
            <Link href="/login" className="transition-all duration-300 hover:text-[#d7ccc8] hover:tracking-[0.28em]">
              Login
            </Link>
          </nav>

          <Link
            href="/order"
            className="inline-flex min-h-9 lg:min-h-11 items-center justify-center rounded-full bg-[#8d6e63] px-4 lg:px-5 py-2 lg:py-3 text-xs lg:text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a1887f] hover:shadow-lg active:scale-95"
          >
            Order Online
          </Link>
        </div>
      </header>

      <section
        id="home"
        className="page-grain relative isolate min-h-screen overflow-hidden bg-[#3e2723] text-[#d7ccc8]"
      >
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            poster="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1800&q=80"
          >
            <source
              src="https://cdn.pixabay.com/video/2023/05/02/160547-822902404_large.mp4"
              type="video/mp4"
            />
            <source
              src="https://videos.pexels.com/video-files/3044127/3044127-uhd_2560_1440_25fps.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(62,39,35,0.95)_18%,rgba(78,52,46,0.88)_48%,rgba(93,64,55,0.82)_100%)] z-[1]" />
        <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_20%_20%,rgba(141,110,99,0.25),transparent_22%)] z-[1]" />

        <div className="section-shell relative flex min-h-screen flex-col justify-center pb-16 pt-32 z-[2]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="animate-reveal-up space-y-6 lg:space-y-8">
              <Badge tone="cream" className="border-[#8d6e63]/40 bg-[#8d6e63]/20 px-4 py-1.5 text-[#d7ccc8]">
                Premium Coffee Experience
              </Badge>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-[#a1887f]">Welcome to {settings.cafeName}</p>
                <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight text-[#efebe9] sm:text-5xl lg:text-6xl">
                  Cinematic coffee moments, crafted for modern city rituals.
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-[#d7ccc8]/80">
                  Dari signature espresso hingga pastry hangat, {settings.cafeName} menyatukan atmosfer premium cafe dengan pengalaman brand yang eksklusif.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/order"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#8d6e63] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a1887f] hover:shadow-xl active:scale-95"
                >
                  View Menu
                </Link>
                <Link
                  href="/order"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d7ccc8]/25 bg-[#d7ccc8]/10 px-6 py-3 text-sm font-semibold text-[#efebe9] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d7ccc8]/20 hover:border-[#d7ccc8]/40 active:scale-95"
                >
                  Order Online
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {cafeStats.map((stat, index) => (
                  <div key={stat.label} className={`rounded-2xl border border-[#d7ccc8]/15 bg-[#d7ccc8]/8 p-4 backdrop-blur-sm animate-scale-in animate-delay-${(index + 3) * 100}`}>
                    <p className="text-2xl font-semibold text-[#efebe9]">{stat.value}</p>
                    <p className="mt-1 text-xs text-[#d7ccc8]/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -left-12 top-12 h-60 w-60 rounded-full bg-[#8d6e63]/20 blur-3xl" />
              <div className="absolute right-10 top-4 h-48 w-48 rounded-full bg-[#a1887f]/20 blur-3xl" />
              <div className="animate-float-slow relative mx-auto aspect-[0.96] max-w-[620px]">
                <div className="absolute left-0 top-[6%] w-[56%] rotate-[-10deg] overflow-hidden rounded-3xl border border-[#d7ccc8]/15 bg-[#4e342e] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
                  <div className="relative h-[290px] overflow-hidden rounded-2xl">
                    <Image
                      src={heroMenus[0]?.image || galleryImages[0].src}
                      alt={heroMenus[0]?.name ?? "Signature coffee"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs uppercase tracking-wider text-[#d7ccc8]">Signature</p>
                      <p className="mt-2 font-serif text-2xl text-white">{heroMenus[0]?.name ?? "House Brew"}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute right-0 top-0 w-[58%] rotate-[13deg] overflow-hidden rounded-3xl border border-[#d7ccc8]/12 bg-[#5d4037] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
                  <div className="relative h-[340px] overflow-hidden rounded-2xl">
                    <Image
                      src={galleryImages[2].src}
                      alt="Barista making coffee"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 right-[8%] w-[62%] rotate-[-8deg] overflow-hidden rounded-3xl border border-[#d7ccc8]/12 bg-[#4e342e] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
                  <div className="relative h-[240px] overflow-hidden rounded-2xl">
                    <Image
                      src={heroMenus[1]?.image || galleryImages[3].src}
                      alt={heroMenus[1]?.name ?? "Cafe dish"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#d7ccc8]">Chef Pick</p>
                        <p className="mt-2 font-serif text-xl">{heroMenus[1]?.name ?? "Slow Brunch"}</p>
                      </div>
                      <span className="rounded-full border border-[#d7ccc8]/20 bg-[#d7ccc8]/15 px-3 py-1 text-sm backdrop-blur-sm">
                        {heroMenus[1] ? formatCurrency(heroMenus[1].price) : formatCurrency(38000)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-16 grid gap-4 md:grid-cols-3">
            {serviceHighlights.map((item, index) => (
              <div key={item.title} className={`rounded-2xl border border-[#d7ccc8]/12 bg-[#d7ccc8]/8 p-5 backdrop-blur-sm hover-lift animate-fade-in animate-delay-${(index + 1) * 200}`}>
                <p className="text-xs uppercase tracking-wider text-[#a1887f]">{item.label}</p>
                <h2 className="mt-3 text-xl font-semibold text-[#efebe9]">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#d7ccc8]/75">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="featured-menu" className="section-shell py-16 sm:py-20">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#8d6e63]">Featured Menu</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-[#4e342e] sm:text-4xl">
              Premium favorites plated with elevated cafe mood.
            </h2>
          </div>
          <Link
            href="/order"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#8d6e63] bg-white px-5 py-3 text-sm font-semibold text-[#4e342e] shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            Explore Full Menu
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredMenus.map((item, index) => (
            <article
              key={item.id}
              className={`group overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(126,89,57,0.12)] transition duration-300 hover:-translate-y-2 animate-scale-in animate-delay-${index * 100}`}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-[#8d6e63]">{item.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#4e342e] truncate">{item.name}</h3>
                  </div>
                  <Badge tone={item.status === "Promo" ? "cream" : item.status === "Spesial" ? "green" : "blue"}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-[#6d4c41] line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-lg font-semibold text-[#5d4037]">{formatCurrency(item.price)}</p>
                  <Link
                    href={`/order/${item.slug}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#6d4c41] px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#8d6e63] hover:shadow-lg active:scale-95"
                  >
                    Order
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pb-16 sm:pb-20">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#8d6e63]">Best Seller</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-[#4e342e] sm:text-4xl">
              Menu rekomendasi dari pesanan terpopuler.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[#6d4c41]">
            Rekomendasi berdasarkan order terbanyak pelanggan.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {recommendedMenus.map((item, index) => (
            <article
              key={item.id}
              className={`overflow-hidden rounded-3xl border border-[#bcaaa4] bg-[#efebe9] shadow-soft hover-lift animate-fade-in animate-delay-${index * 100}`}
            >
              <div className="relative h-48 overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-[#4e342e]/85 px-3 py-1 text-xs uppercase tracking-wider text-[#d7ccc8]">
                  Top {index + 1}
                </div>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-[#8d6e63]">{item.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#4e342e] truncate">{item.name}</h3>
                  </div>
                  <Badge tone="cream">{item.orderCount}</Badge>
                </div>
                <p className="text-sm leading-relaxed text-[#6d4c41] line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-lg font-semibold text-[#5d4037]">{formatCurrency(item.price)}</p>
                  <Link
                    href={`/order/${item.slug}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#6d4c41] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#8d6e63]"
                  >
                    Order
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pb-16 sm:pb-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {menuCategories.map((category, index) => (
            <article key={category.title} className={`overflow-hidden rounded-3xl bg-white shadow-soft hover-scale animate-scale-in animate-delay-${index * 100}`}>
              <div className="relative h-44 overflow-hidden">
                <Image src={category.image} alt={category.title} fill className="object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div className="space-y-2 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-[#4e342e]">{category.title}</h3>
                  <span className="text-sm text-[#8d6e63]">{category.itemCount}</span>
                </div>
                <p className="text-sm leading-relaxed text-[#6d4c41]">{category.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[#4e342e] py-16 text-[#d7ccc8] sm:py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="relative min-h-[380px] overflow-hidden rounded-3xl animate-slide-in-left">
            <Image
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80"
              alt="Cafe interior"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-[#d7ccc8]/15 bg-[#d7ccc8]/12 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-[#d7ccc8]">Signature House Coffee</p>
              <p className="mt-3 font-serif text-2xl">Roasted for balance, served with warmth.</p>
            </div>
          </div>
          <div className="space-y-5 animate-slide-in-right">
            <p className="text-xs uppercase tracking-wider text-[#a1887f]">About {settings.cafeName}</p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-[#efebe9] sm:text-4xl">
              Premium coffee, luxury interiors, and smoother ordering.
            </h2>
            <p className="text-base leading-relaxed text-[#d7ccc8]/75">
              {settings.cafeName} menghadirkan pengalaman cafe modern dengan kopi spesialti, comfort food, dan service yang cepat.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#d7ccc8]/15 bg-[#d7ccc8]/8 p-4">
                <p className="text-xs uppercase tracking-wider text-[#a1887f]">Our Craft</p>
                <p className="mt-2 text-sm leading-relaxed text-[#d7ccc8]/75">
                  Espresso house-roasted, milk texturing konsisten, dan plating branded.
                </p>
              </div>
              <div className="rounded-2xl border border-[#d7ccc8]/15 bg-[#d7ccc8]/8 p-4">
                <p className="text-xs uppercase tracking-wider text-[#a1887f]">Signature Pairing</p>
                <p className="mt-2 text-sm leading-relaxed text-[#d7ccc8]/75">
                  Menu pastry dan brunch untuk menyeimbangkan rasa kopi dan matcha.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="section-shell py-16 sm:py-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-wider text-[#8d6e63]">Gallery</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#4e342e] sm:text-4xl">
            Visual moodboard of coffee, dessert, and interiors.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {galleryImages.map((image, index) => (
            <article
              key={image.title}
              className={`group overflow-hidden rounded-3xl bg-white shadow-soft hover-lift animate-fade-in animate-delay-${index * 100} ${
                index === 1 ? "md:col-span-2" : ""
              }`}
            >
              <div className={`relative ${index === 1 ? "h-[380px]" : "h-[320px]"}`}>
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-serif text-xl text-white">{image.title}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pb-16 sm:pb-20">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#8d6e63]">Customer Stories</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#4e342e] sm:text-4xl">
              Reviews that match the warmth and quality.
            </h2>
          </div>
          <Badge tone="slate" className="px-4 py-2">
            Premium layout
          </Badge>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ratings.length > 0
              ? ratings.slice(0, 3).map((rating, index) => (
                  <article key={rating.id} className={`rounded-3xl bg-white p-6 shadow-soft hover-lift animate-scale-in animate-delay-${index * 100}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-[#4e342e]">{rating.customerName}</p>
                        <p className="mt-1 text-sm text-[#8d6e63]">Table {rating.tableNumber ?? "-"}</p>
                      </div>
                      <span className="rounded-full bg-[#efebe9] px-3 py-1 text-sm font-semibold text-[#5d4037]">
                        {((rating.serviceRating + rating.foodRating) / 2).toFixed(1)}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[#6d4c41]">{rating.comment || "Pelanggan tidak menambahkan komentar."}</p>
                  </article>
                ))
              : testimonials.map((testimonial, index) => (
                  <article key={testimonial.name} className={`rounded-3xl bg-white p-6 shadow-soft hover-lift animate-scale-in animate-delay-${index * 100}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-[#4e342e]">{testimonial.name}</p>
                        <p className="mt-1 text-sm text-[#8d6e63]">{testimonial.role}</p>
                      </div>
                      <span className="rounded-full bg-[#efebe9] px-3 py-1 text-sm font-semibold text-[#5d4037]">
                        5.0
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[#6d4c41]">{testimonial.quote}</p>
                  </article>
                ))}
          </div>
        </section>

        <section className="section-shell py-16 sm:py-20">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8d6e63]">Customer Feedback</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#4e342e] sm:text-4xl">
                Bagikan rating pelayanan dan makanan Anda
              </h2>
            </div>
            <Link
              href="/penilaian"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#8d6e63] bg-white px-5 py-3 text-sm font-semibold text-[#4e342e] shadow-soft transition hover:-translate-y-0.5"
            >
              Beri Rating Sekarang
            </Link>
          </div>
          <div className="rounded-3xl border border-[#bcaaa4] bg-gradient-to-br from-white/40 via-white/20 to-transparent p-8 backdrop-blur-xl">
            <p className="text-base leading-relaxed text-[#4e342e] max-w-2xl">
              Bantu kami tingkatkan pelayanan dan kualitas makanan dengan rating sederhana. 
              Nama, skor pelayanan & makanan (1-5), dan komentar opsional.
            </p>
          </div>
        </section>

      <TechStack />

      <TemplateFeatures />

      <DemoCredentials />

      <TrustBadges />

      <FAQ />

      <section className="section-shell py-16 sm:py-20">
        <div className="rounded-3xl border border-[#8d6e63]/40 bg-gradient-to-br from-[#4e342e] to-[#5d4037] p-8 sm:p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] mx-auto">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#efebe9]">Tertarik dengan Website Ini?</h2>
            <p className="text-base leading-relaxed text-[#d7ccc8]/90">
              Hubungi kami untuk membeli template website cafe management system lengkap dengan semua fitur yang ada
            </p>
            <a
              href="https://wa.me/6289880982388?text=Halo,%20saya%20tertarik%20dengan%20website%20CafeFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#20BA5A] hover:shadow-xl active:scale-95"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Hubungi via WhatsApp
            </a>
            <p className="text-sm text-[#d7ccc8]/70">
              📱 089880982388
            </p>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#3e2723] py-12 text-[#d7ccc8]">
        <div className="section-shell grid gap-8 md:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7ccc8]/20 bg-[#d7ccc8]/12 text-sm font-semibold">
                {brandInitials}
              </div>
              <div>
                <p className="font-semibold text-sm">{settings.cafeName}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#bcaaa4]">Cafe & Ordering System</p>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#d7ccc8]/70">
              {settings.footerText}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-[#a1887f]">Navigation</p>
            <div className="mt-4 grid gap-2 text-sm text-[#d7ccc8]/75">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="transition hover:text-[#efebe9]">
                  {item.label}
                </a>
              ))}
              <Link href="/order" className="transition hover:text-[#efebe9]">
                Order Online
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-[#a1887f]">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-[#d7ccc8]/75">
              <p className="line-clamp-2">{settings.address}</p>
              <p>{settings.email}</p>
              <p>{settings.phone}</p>
            </div>
            <div className="mt-5 flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7ccc8]/18 bg-[#d7ccc8]/10 text-[#d7ccc8]/80 transition hover:bg-[#d7ccc8]/18 hover:text-[#efebe9]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
