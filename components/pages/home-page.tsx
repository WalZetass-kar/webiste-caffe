"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCafeSettings } from "@/components/providers/settings-provider";
import { Badge } from "@/components/ui/badge";
import type { MenuRecord, RecommendedMenuRecord, RatingRecord } from "@/lib/models";
import { cafeStats, menuCategories, serviceHighlights, testimonials } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

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
    <div className="bg-[#f7f5f2] text-cafe-text">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#102126]/92 shadow-[0_22px_60px_rgba(6,12,14,0.28)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="section-shell flex items-center justify-between py-5">
          <Link href="/" className="flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold">
              {brandInitials}
            </div>
            <div>
              <p className="font-semibold">{settings.cafeName}</p>
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">Premium Coffee</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-xs uppercase tracking-[0.24em] text-white/75 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-all duration-300 hover:text-white hover:tracking-[0.28em]">
                {item.label}
              </a>
            ))}
            <Link href="/dashboard" className="transition-all duration-300 hover:text-white hover:tracking-[0.28em]">
              Dashboard
            </Link>
          </nav>

          <Link
            href="/order"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d8a23d] px-5 py-3 text-sm font-semibold text-[#1a1c1d] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0ab4a] hover:shadow-lg active:scale-95"
          >
            Order Online
          </Link>
        </div>
      </header>

      <section
        id="home"
        className="page-grain relative isolate min-h-screen overflow-hidden bg-[#0c1a1f] text-white"
      >
        <Image
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1800&q=80"
          alt="Barista pouring coffee"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,14,16,0.92)_18%,rgba(9,22,27,0.85)_48%,rgba(7,16,18,0.74)_100%)]" />
        <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_20%_20%,rgba(200,162,124,0.22),transparent_22%)]" />

        <div className="section-shell relative flex min-h-screen flex-col justify-center pb-16 pt-32">
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="animate-reveal-up space-y-8">
              <Badge tone="cream" className="border-[#d8a23d]/40 bg-[#d8a23d]/10 px-4 py-1.5 text-[#f6d7a0]">
                Premium Coffee Experience
              </Badge>
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.4em] text-[#d8a23d]">Welcome to {settings.cafeName}</p>
                <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.94] text-white sm:text-6xl lg:text-7xl">
                  Cinematic coffee moments, crafted for modern city rituals.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                  Dari signature espresso hingga pastry hangat, {settings.cafeName} menyatukan atmosfer premium cafe,
                  pemesanan online cepat, dan pengalaman brand yang terasa lebih eksklusif.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/order"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d8a23d] px-6 py-3 text-sm font-semibold text-[#152024] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0ab4a] hover:shadow-xl active:scale-95"
                >
                  View Menu
                </Link>
                <Link
                  href="/order"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/14 hover:border-white/30 active:scale-95"
                >
                  Order Online
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {cafeStats.map((stat, index) => (
                  <div key={stat.label} className={`rounded-[28px] border border-white/12 bg-white/6 p-5 backdrop-blur-sm animate-scale-in animate-delay-${(index + 3) * 100}`}>
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm text-white/62">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -left-12 top-12 h-60 w-60 rounded-full bg-[#c8a27c]/18 blur-3xl" />
              <div className="absolute right-10 top-4 h-48 w-48 rounded-full bg-[#d8a23d]/18 blur-3xl" />
              <div className="animate-float-slow relative mx-auto aspect-[0.96] max-w-[620px]">
                <div className="absolute left-0 top-[6%] w-[56%] rotate-[-10deg] overflow-hidden rounded-[32px] border border-white/12 bg-[#0f2025] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.36)]">
                  <div className="relative h-[290px] overflow-hidden rounded-[24px]">
                    <Image
                      src={heroMenus[0]?.image || galleryImages[0].src}
                      alt={heroMenus[0]?.name ?? "Signature coffee"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#f1d4a1]">Signature</p>
                      <p className="mt-2 font-serif text-3xl text-white">{heroMenus[0]?.name ?? "House Brew"}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute right-0 top-0 w-[58%] rotate-[13deg] overflow-hidden rounded-[32px] border border-white/10 bg-[#112329] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
                  <div className="relative h-[340px] overflow-hidden rounded-[24px]">
                    <Image
                      src={galleryImages[2].src}
                      alt="Barista making coffee"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 right-[8%] w-[62%] rotate-[-8deg] overflow-hidden rounded-[32px] border border-white/10 bg-[#102126] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.42)]">
                  <div className="relative h-[240px] overflow-hidden rounded-[24px]">
                    <Image
                      src={heroMenus[1]?.image || galleryImages[3].src}
                      alt={heroMenus[1]?.name ?? "Cafe dish"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-[#f1d4a1]">Chef Pick</p>
                        <p className="mt-2 font-serif text-2xl">{heroMenus[1]?.name ?? "Slow Brunch"}</p>
                      </div>
                      <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
                        {heroMenus[1] ? formatCurrency(heroMenus[1].price) : formatCurrency(38000)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            {serviceHighlights.map((item, index) => (
              <div key={item.title} className={`rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm hover-lift animate-fade-in animate-delay-${(index + 1) * 200}`}>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d8a23d]">{item.label}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/66">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="featured-menu" className="section-shell py-20 sm:py-24">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-cafe-accent/58">Featured Menu</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold text-cafe-text sm:text-5xl">
              Premium favorites plated with a softer, more elevated cafe mood.
            </h2>
          </div>
          <Link
            href="/order"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e3d6c6] bg-white px-5 py-3 text-sm font-semibold text-cafe-accent shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            Explore Full Menu
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredMenus.map((item, index) => (
            <article
              key={item.id}
              className={`group overflow-hidden rounded-[32px] bg-white shadow-[0_18px_40px_rgba(126,89,57,0.12)] transition duration-300 hover:-translate-y-2 animate-scale-in animate-delay-${index * 100}`}
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cafe-accent/56">{item.category}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-cafe-text">{item.name}</h3>
                  </div>
                  <Badge tone={item.status === "Promo" ? "cream" : item.status === "Spesial" ? "green" : "blue"}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm leading-7 text-cafe-accent/80">{item.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-cafe-accent">{formatCurrency(item.price)}</p>
                  <Link
                    href={`/order/${item.slug}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#1a292e] px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#24383f] hover:shadow-lg active:scale-95"
                  >
                    Order
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pb-20 sm:pb-24">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-cafe-accent/58">Best Seller</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold text-cafe-text sm:text-5xl">
              Menu recommendation yang dibentuk dari pesanan pelanggan paling sering dipilih.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-cafe-accent/76">
            Rekomendasi ini akan terus bergerak mengikuti order terbanyak, jadi homepage selalu terasa lebih hidup.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-4">
          {recommendedMenus.map((item, index) => (
            <article
              key={item.id}
              className={`overflow-hidden rounded-[32px] border border-[#eadfce] bg-[#fffaf5] shadow-soft hover-lift animate-fade-in animate-delay-${index * 100}`}
            >
              <div className="relative h-52 overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-[#102126]/82 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#f1d4a1]">
                  Top {index + 1}
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cafe-accent/58">{item.category}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-cafe-text">{item.name}</h3>
                  </div>
                  <Badge tone="cream">{item.orderCount} sold</Badge>
                </div>
                <p className="text-sm leading-7 text-cafe-accent/76">{item.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-cafe-accent">{formatCurrency(item.price)}</p>
                  <Link
                    href={`/order/${item.slug}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#1a292e] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#24383f]"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pb-20 sm:pb-24">
        <div className="grid gap-5 lg:grid-cols-4">
          {menuCategories.map((category, index) => (
            <article key={category.title} className={`overflow-hidden rounded-[32px] bg-white shadow-soft hover-scale animate-scale-in animate-delay-${index * 100}`}>
              <div className="relative h-48 overflow-hidden">
                <Image src={category.image} alt={category.title} fill className="object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-semibold text-cafe-text">{category.title}</h3>
                  <span className="text-sm text-cafe-accent/70">{category.itemCount}</span>
                </div>
                <p className="text-sm leading-7 text-cafe-accent/78">{category.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[#102126] py-20 text-white sm:py-24">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative min-h-[420px] overflow-hidden rounded-[36px] animate-slide-in-left">
            <Image
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80"
              alt="Cafe interior"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.32em] text-[#f1d4a1]">Signature House Coffee</p>
              <p className="mt-3 font-serif text-3xl">Roasted for balance, served with warmth.</p>
            </div>
          </div>
          <div className="space-y-6 animate-slide-in-right">
            <p className="text-xs uppercase tracking-[0.34em] text-[#d8a23d]">About {settings.cafeName}</p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Built around premium coffee, quiet luxury interiors, and a smoother ordering rhythm.
            </h2>
            <p className="text-base leading-8 text-white/68">
              {settings.cafeName} menghadirkan pengalaman cafe modern yang menggabungkan kopi spesialti, comfort food, dan
              service flow yang cepat. Dari counter hingga mobile ordering, setiap detail dirancang agar pelanggan
              merasa masuk ke brand yang rapi, hangat, dan premium.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/12 bg-white/6 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#d8a23d]">Our Craft</p>
                <p className="mt-3 text-sm leading-7 text-white/68">
                  Espresso blend house-roasted, milk texturing yang konsisten, dan plating yang tetap terasa branded.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/12 bg-white/6 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#d8a23d]">Signature Pairing</p>
                <p className="mt-3 text-sm leading-7 text-white/68">
                  Menu pastry dan brunch dipilih untuk menyeimbangkan rasa kopi, matcha, dan minuman musiman kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="section-shell py-20 sm:py-24">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.34em] text-cafe-accent/58">Gallery</p>
          <h2 className="mt-3 text-4xl font-semibold text-cafe-text sm:text-5xl">
            A visual moodboard of coffee, dessert, and cinematic interiors.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {galleryImages.map((image, index) => (
            <article
              key={image.title}
              className={`group overflow-hidden rounded-[34px] bg-white shadow-soft hover-lift animate-fade-in animate-delay-${index * 100} ${
                index === 1 ? "md:col-span-2" : ""
              }`}
            >
              <div className={`relative ${index === 1 ? "h-[420px]" : "h-[340px]"}`}>
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-serif text-2xl text-white">{image.title}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pb-20 sm:pb-24">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-cafe-accent/58">Customer Stories</p>
            <h2 className="mt-3 text-4xl font-semibold text-cafe-text sm:text-5xl">
              Reviews that match the warmth of the room and the quality in the cup.
            </h2>
          </div>
          <Badge tone="slate" className="px-4 py-2">
            ThemeForest-inspired premium layout
          </Badge>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ratings.length > 0
              ? ratings.slice(0, 3).map((rating, index) => (
                  <article key={rating.id} className={`rounded-[32px] bg-white p-6 shadow-soft hover-lift animate-scale-in animate-delay-${index * 100}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xl font-semibold text-cafe-text">{rating.customerName}</p>
                        <p className="mt-1 text-sm text-cafe-accent/68">Table {rating.tableNumber ?? "-"}</p>
                      </div>
                      <span className="rounded-full bg-[#fbf0df] px-3 py-1 text-sm font-semibold text-cafe-accent">
                        {((rating.serviceRating + rating.foodRating) / 2).toFixed(1)} ⭐
                      </span>
                    </div>
                    <p className="mt-5 text-sm leading-8 text-cafe-accent/78">{rating.comment || "Pelanggan tidak menambahkan komentar."}</p>
                  </article>
                ))
              : testimonials.map((testimonial, index) => (
                  <article key={testimonial.name} className={`rounded-[32px] bg-white p-6 shadow-soft hover-lift animate-scale-in animate-delay-${index * 100}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xl font-semibold text-cafe-text">{testimonial.name}</p>
                        <p className="mt-1 text-sm text-cafe-accent/68">{testimonial.role}</p>
                      </div>
                      <span className="rounded-full bg-[#fbf0df] px-3 py-1 text-sm font-semibold text-cafe-accent">
                        5.0
                      </span>
                    </div>
                    <p className="mt-5 text-sm leading-8 text-cafe-accent/78">{testimonial.quote}</p>
                  </article>
                ))}
          </div>
        </section>

        <section className="section-shell py-20 sm:py-24">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-cafe-accent/58">Customer Feedback</p>
              <h2 className="mt-3 text-4xl font-semibold text-cafe-text sm:text-5xl">
                Bagikan rating pelayanan dan makanan Anda
              </h2>
            </div>
            <Link
              href="/penilaian"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e3d6c6] bg-white px-5 py-3 text-sm font-semibold text-cafe-accent shadow-soft transition hover:-translate-y-0.5"
            >
              Beri Rating Sekarang
            </Link>
          </div>
          <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/20 via-white/5 to-transparent p-8 backdrop-blur-xl">
            <p className="text-lg leading-8 text-cafe-text/80 max-w-2xl">
              Bantu kami tingkatkan pelayanan dan kualitas makanan dengan rating sederhana. 
              Nama, skor pelayanan & makanan (1-5), dan komentar opsional.
            </p>
          </div>
        </section>

      <footer id="contact" className="bg-[#0f1d22] py-16 text-white">

        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_0.6fr_0.5fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold">
                {brandInitials}
              </div>
              <div>
                <p className="font-semibold">{settings.cafeName}</p>
                <p className="text-xs uppercase tracking-[0.28em] text-white/55">Cafe & Ordering System</p>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/66">
              {settings.footerText}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d8a23d]">Navigation</p>
            <div className="mt-5 grid gap-3 text-sm text-white/72">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </a>
              ))}
              <Link href="/order" className="transition hover:text-white">
                Order Online
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d8a23d]">Contact</p>
            <div className="mt-5 space-y-3 text-sm text-white/72">
              <p>{settings.address}</p>
              <p>{settings.email}</p>
              <p>{settings.phone}</p>
            </div>
            <div className="mt-6 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/8 text-white/78 transition hover:bg-white/14 hover:text-white"
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
