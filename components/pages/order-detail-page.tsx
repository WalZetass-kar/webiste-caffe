"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { MenuRecord } from "@/lib/models";
import { formatCurrency, formatQuantity } from "@/lib/utils";

type OrderDetailPageProps = {
  item: MenuRecord;
  recommendations: MenuRecord[];
};

const cartStorageKey = "cafeflow-cart";

export function OrderDetailPageView({ item, recommendations }: OrderDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const darkFieldClassName =
    "border-white/12 bg-white/[0.08] text-white placeholder:text-white/45 shadow-none focus:border-[#d8a23d]/55 focus:ring-[#d8a23d]/18";

  const addToCart = () => {
    const current = window.localStorage.getItem(cartStorageKey);
    const parsed = current ? (JSON.parse(current) as Record<string, number>) : {};

    parsed[item.id] = (parsed[item.id] ?? 0) + quantity;
    window.localStorage.setItem(cartStorageKey, JSON.stringify(parsed));
    setAdded(true);
  };

  return (
    <div className="min-h-screen bg-[#f6f0e7]">
      <section className="page-grain relative overflow-hidden bg-[#0f1d22] text-white">
        <Image
          src={item.image}
          alt={item.name}
          fill
          priority
          className="object-cover opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,16,18,0.92),rgba(9,24,28,0.8))]" />
        <div className="section-shell relative pb-16 pt-7">
          <div className="flex flex-col gap-3 rounded-[32px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#d8a23d]">Product detail</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{item.name}</h1>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/order"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                Back to Menu
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d8a23d] px-5 py-3 text-sm font-semibold text-[#162127] transition hover:bg-[#e0ab4a]"
              >
                Home
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
            <div className="space-y-5">
              <Badge tone="cream" className="border-[#d8a23d]/40 bg-[#d8a23d]/12 text-[#f2d59e]">
                {item.category}
              </Badge>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Crafted with a richer story, softer texture, and a clean premium finish.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/70">{item.story}</p>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/78">
                  {item.prepTime}
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/78">
                  {item.rating.toFixed(1)} / 5
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/78">
                  {formatCurrency(item.price)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-shell pb-14 pt-8">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <section className="overflow-hidden rounded-[36px] bg-white shadow-soft">
            <div className="relative h-[380px] sm:h-[520px]">
              <Image src={item.image} alt={item.name} fill className="object-cover" priority />
            </div>
            <div className="space-y-6 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cafe-accent/60">{item.category}</p>
                  <h2 className="mt-3 text-4xl font-semibold text-cafe-text sm:text-5xl">{item.name}</h2>
                </div>
                <Badge tone={item.status === "Promo" ? "cream" : item.status === "Spesial" ? "green" : "blue"}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-base leading-8 text-cafe-accent/78">{item.story}</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cafe-accent/60">Price</p>
                  <p className="mt-2 text-lg font-semibold text-cafe-text">{formatCurrency(item.price)}</p>
                </div>
                <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cafe-accent/60">Prep time</p>
                  <p className="mt-2 text-lg font-semibold text-cafe-text">{item.prepTime}</p>
                </div>
                <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cafe-accent/60">Rating</p>
                  <p className="mt-2 text-lg font-semibold text-cafe-text">{item.rating.toFixed(1)}/5</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-cafe-text">Ingredients</p>
                <div className="flex flex-wrap gap-3">
                  {item.recipe.map((ingredient) => (
                    <Badge key={ingredient.id} tone="slate" className="px-4 py-2 text-xs">
                      {ingredient.ingredientName} · {formatQuantity(ingredient.quantity, ingredient.usageUnit)}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] border border-[#efe1d1] bg-[#fffaf5] p-5">
                <p className="text-sm font-semibold text-cafe-text">Pairing recommendation</p>
                <p className="mt-3 text-sm leading-7 text-cafe-accent/78">{item.pairing}</p>
              </div>
            </div>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="rounded-[34px] bg-[#112126] p-6 text-white shadow-[0_22px_50px_rgba(15,28,33,0.24)]">
              <p className="text-xs uppercase tracking-[0.3em] text-[#d8a23d]">Add to cart</p>
              <h2 className="mt-2 text-2xl font-semibold">Customize your order</h2>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/8 text-lg text-white"
                >
                  -
                </button>
                <div className="min-w-12 text-center text-lg font-semibold text-white">{quantity}</div>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#d8a23d] text-lg text-[#162127]"
                >
                  +
                </button>
              </div>
              <div className="mt-5 rounded-[24px] bg-white/8 p-4">
                <div className="flex justify-between text-sm text-white/72">
                  <span>Item total</span>
                  <span>{formatCurrency(item.price * quantity)}</span>
                </div>
                <div className="mt-3 flex justify-between text-sm text-white/72">
                  <span>Service fee</span>
                  <span>{formatCurrency(6000)}</span>
                </div>
                <div className="mt-3 flex justify-between font-semibold text-white">
                  <span>Checkout total</span>
                  <span>{formatCurrency(item.price * quantity + 6000)}</span>
                </div>
              </div>
              <Textarea
                className={`mt-5 ${darkFieldClassName}`}
                placeholder="Tambahkan catatan untuk barista atau kitchen"
              />
              {added ? (
                <div className="mt-4 rounded-[20px] border border-[#d8a23d]/25 bg-[#d8a23d]/10 px-4 py-3 text-sm text-[#f2d59e]">
                  Menu ini sudah masuk ke cart. Lanjutkan checkout dari halaman order.
                </div>
              ) : null}
              <Button className="mt-5 w-full bg-[#d8a23d] text-[#162127] hover:bg-[#e0ab4a]" onClick={addToCart}>
                Add to Cart
              </Button>
              <Link
                href="/order"
                className="mt-3 inline-flex w-full min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                Go to Checkout
              </Link>
            </section>

            <section className="rounded-[34px] bg-white p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60">You may also like</p>
              <div className="mt-5 space-y-4">
                {recommendations.map((menu) => (
                  <Link
                    key={menu.id}
                    href={`/order/${menu.slug}`}
                    className="flex items-center gap-4 rounded-[24px] bg-[#fbf4ec] p-4 transition hover:bg-[#f7ecdf]"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-[20px]">
                      <Image src={menu.image} alt={menu.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-cafe-text">{menu.name}</p>
                      <p className="mt-1 text-sm text-cafe-accent/70">{formatCurrency(menu.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
