"use client";

import { useDeferredValue, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCafeSettings } from "@/components/providers/settings-provider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { requestJson } from "@/lib/client-api";
import {
  type BranchRecord,
  menuCategoryOptions,
  type MenuRecord,
  type OrderPayload,
  type OrderRecord,
  type PaymentMethod,
  type PaymentSettingsRecord,
  type RecommendedMenuRecord,
} from "@/lib/models";
import { formatCurrency, formatDate, getReceiptLink } from "@/lib/utils";


type CartState = Record<string, number>;

type OrderPageViewProps = {
  menus: MenuRecord[];
  paymentSettings: PaymentSettingsRecord;
  recommendedMenus: RecommendedMenuRecord[];
  branches: BranchRecord[];
  initialOrders: OrderRecord[];
};

type CheckoutFormState = {
  branchId: string;
  customerName: string;
  tableNumber: string;
  notes: string;
};

const cartStorageKey = "cafeflow-cart";
const lastCustomerStorageKey = "cafeflow-last-customer";

export function OrderPageView({ menus, paymentSettings, recommendedMenus, branches, initialOrders }: OrderPageViewProps) {
  const { settings } = useCafeSettings();
  const categoryOptions = ["All", ...menuCategoryOptions] as const;
  const defaultBranchId = branches[0]?.id ?? "";
  const getEmptyCheckoutForm = (branchId: string): CheckoutFormState => ({
    branchId,
    customerName: "",
    tableNumber: "",
    notes: "",
  });
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartState>({
    ...(menus[0] ? { [menus[0].id]: 1 } : {}),
  });
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormState>(getEmptyCheckoutForm(defaultBranchId));
  const [orderHistory, setOrderHistory] = useState(initialOrders);
  const [rememberedCustomerName, setRememberedCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState<OrderRecord | null>(null);

  const [successPaymentMethod, setSuccessPaymentMethod] = useState<PaymentMethod | null>(null);
  const deferredSearch = useDeferredValue(search);
  const darkFieldClassName =
    "border-white/12 bg-white/[0.08] text-white placeholder:text-white/45 shadow-none focus:border-[#d8a23d]/55 focus:ring-[#d8a23d]/18";
  const paymentOptions: Array<{
    value: PaymentMethod;
    label: string;
    description: string;
  }> = [
    {
      value: "Cash",
      label: "Cash",
      description: "Bayar langsung di kasir atau saat pesanan diantar ke meja.",
    },
    {
      value: "QRIS",
      label: "QRIS",
      description: "Tampilkan kode QR pembayaran agar pelanggan bisa scan dari ponsel.",
    },
    {
      value: "Transfer",
      label: "Transfer",
      description: "Gunakan transfer bank untuk pembayaran non-tunai sebelum pesanan diproses.",
    },
  ];
  const paymentAvailability: Record<PaymentMethod, boolean> = {
    Cash: true,
    QRIS: Boolean(paymentSettings.qrisImage),
    Transfer: Boolean(
      paymentSettings.transferBank &&
        paymentSettings.transferAccountNumber &&
        paymentSettings.transferAccountName,
    ),
  };

  useEffect(() => {
    const storedCart = window.localStorage.getItem(cartStorageKey);

    if (!storedCart) {
      return;
    }

    try {
      const parsedCart = JSON.parse(storedCart) as CartState;
      setCart(parsedCart);
    } catch {
      window.localStorage.removeItem(cartStorageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const storedCustomerName = window.localStorage.getItem(lastCustomerStorageKey);

    if (!storedCustomerName) {
      return;
    }

    setRememberedCustomerName(storedCustomerName);
    setCheckoutForm((current) =>
      current.customerName
        ? current
        : {
            ...current,
            customerName: storedCustomerName,
          },
    );
  }, []);

  const filteredMenus = menus.filter((item) => {
    const matchesCategory = category === "All" ? true : item.category === category;
    const query = deferredSearch.toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const cartItems = menus
    .filter((item) => cart[item.id])
    .map((item) => ({ ...item, quantity: cart[item.id] }));

  const activeCustomerName = checkoutForm.customerName.trim() || rememberedCustomerName;
  const customerOrderHistory = activeCustomerName
    ? orderHistory
        .filter((order) => order.customerName.toLowerCase() === activeCustomerName.toLowerCase())
        .slice(0, 4)
    : [];
  const selectedBranch = branches.find((branch) => branch.id === checkoutForm.branchId) ?? branches[0] ?? null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = subtotal > 0 ? 6000 : 0;
  const total = subtotal + serviceFee;

  const updateQuantity = (menuId: string, nextQuantity: number) => {
    setCart((current) => {
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[menuId];

        return next;
      }

      return {
        ...current,
        [menuId]: nextQuantity,
      };
    });
  };

  const reorderOrder = (order: OrderRecord) => {
    setCart((current) => {
      const next = { ...current };

      order.items.forEach((item) => {
        next[item.menuId] = (next[item.menuId] ?? 0) + item.quantity;
      });

      return next;
    });
    setCheckoutForm((current) => ({
      ...current,
      branchId: order.branchId,
      customerName: order.customerName,
      tableNumber: order.tableNumber,
      notes: order.notes,
    }));
    setRememberedCustomerName(order.customerName);
    window.localStorage.setItem(lastCustomerStorageKey, order.customerName);
  };

  const openPaymentModal = () => {
    setError("");
    setSuccessOrder(null);

    if (cartItems.length === 0) {
      setError("Tambahkan minimal satu item ke keranjang sebelum checkout.");
      return;
    }

    const defaultPaymentMethod = paymentOptions.find((option) => paymentAvailability[option.value])?.value ?? "Cash";

    setPaymentMethod(defaultPaymentMethod);
    setPaymentModalOpen(true);
  };

  const confirmCheckout = async () => {
    setSubmitting(true);
    setError("");

    try {
      const payload: OrderPayload = {
        branchId: checkoutForm.branchId,
        customerName: checkoutForm.customerName,
        tableNumber: checkoutForm.tableNumber,
        paymentMethod,
        notes: checkoutForm.notes.trim(),
        items: cartItems.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
      };
      const order = await requestJson<OrderRecord>("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setSuccessOrder(order);
      setSuccessPaymentMethod(paymentMethod);
      setOrderHistory((current) => [order, ...current]);
      setRememberedCustomerName(order.customerName);
      setPaymentModalOpen(false);
      setCart({});
      setCheckoutForm(getEmptyCheckoutForm(order.branchId));
      window.localStorage.removeItem(cartStorageKey);
      window.localStorage.setItem(lastCustomerStorageKey, order.customerName);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Checkout gagal diproses.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f0e7]">
      <section className="page-grain relative overflow-hidden bg-[#0f1d22] text-white">
        <Image
          src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1800&q=80"
          alt="Cafe ordering atmosphere"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,16,18,0.9),rgba(10,24,28,0.84))]" />
        <div className="section-shell relative pb-14 pt-7">
          <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#d8a23d]">Mobile Ordering</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{settings.cafeName} Ordering Studio</h1>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                Back to Home
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d8a23d] px-5 py-3 text-sm font-semibold text-[#162127] transition hover:bg-[#e0ab4a]"
              >
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-5">
              <Badge tone="cream" className="border-[#d8a23d]/40 bg-[#d8a23d]/12 text-[#f2d59e]">
                Premium cafe ordering flow
              </Badge>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Touch-friendly menu browsing with a checkout panel that feels built for mobile first.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/70">
                Pilih kategori, buka detail menu, dan checkout langsung. Begitu pesanan dibuat, stok bahan di sistem
                admin akan berkurang otomatis sesuai resep setiap item.
              </p>
              <Input
                placeholder="Cari kopi, makanan, dessert..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`max-w-xl ${darkFieldClassName}`}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Large food photography",
                "Quick cart controls",
                "Live stock deduction",
              ].map((item, index) => (
                <div key={item} className="rounded-[26px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#d8a23d]">0{index + 1}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-shell pb-14 pt-8">
        {successOrder ? (
          <div className="mb-6 rounded-[28px] border border-[#e2d2bc] bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cafe-accent/60">Order berhasil dibuat</p>
                <h2 className="mt-2 text-2xl font-semibold text-cafe-text">{successOrder.orderCode}</h2>
                <p className="mt-2 text-sm text-cafe-accent/78">
                  Pesanan untuk {successOrder.customerName} di {successOrder.branchName} sudah masuk ke sistem dan stok bahan telah diperbarui.
                </p>
                {successPaymentMethod ? (
                  <p className="mt-2 text-sm text-cafe-accent/72">Pembayaran dipilih: {successPaymentMethod}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge tone="green">{successOrder.status}</Badge>
                <Link href={getReceiptLink(successOrder.orderCode)} className={buttonStyles("secondary", "px-4 py-2")}>
                  View Receipt
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <section className="mb-6 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cafe-accent/60">Previous Orders</p>
              <h2 className="mt-2 text-2xl font-semibold text-cafe-text">Riwayat pesanan pelanggan</h2>
            </div>
            {activeCustomerName ? (
              <Badge tone="slate">{activeCustomerName}</Badge>
            ) : (
              <p className="text-sm text-cafe-accent/72">Isi nama pelanggan untuk melihat order sebelumnya.</p>
            )}
          </div>
          {customerOrderHistory.length === 0 ? (
            <div className="rounded-[28px] border border-[#eadfce] bg-white p-5 text-sm text-cafe-accent/75 shadow-soft">
              Belum ada riwayat order untuk pelanggan ini. Setelah order pertama berhasil, daftar previous orders akan muncul di sini.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {customerOrderHistory.map((order) => (
                <div key={order.id} className="rounded-[28px] border border-[#eadfce] bg-white p-5 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-cafe-accent/60">Order #{order.orderCode}</p>
                      <h3 className="mt-2 text-xl font-semibold text-cafe-text">{order.branchName}</h3>
                    </div>
                    <Badge tone="cream">{formatDate(order.createdAt)}</Badge>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-cafe-accent/78">
                    {order.items.map((item) => (
                      <p key={item.id}>
                        {item.menuName} x{item.quantity}
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 border-t border-[#efe1d1] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cafe-accent/58">Total</p>
                      <p className="mt-1 text-lg font-semibold text-cafe-accent">{formatCurrency(order.total)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={getReceiptLink(order.orderCode)} className={buttonStyles("secondary", "px-4 py-2 text-xs")}>
                        View Details
                      </Link>
                      <Button className="px-4 py-2 text-xs" onClick={() => reorderOrder(order)}>
                        Reorder
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-6">
            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cafe-accent/60">Recommended for you</p>
                <h2 className="mt-2 text-2xl font-semibold text-cafe-text">Popular menu berdasarkan order terbanyak</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {recommendedMenus.map((item) => (
                  <Link
                    key={item.id}
                    href={`/order/${item.slug}`}
                    className="group overflow-hidden rounded-[28px] border border-[#eadfce] bg-white shadow-soft transition hover:-translate-y-1"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3 rounded-full bg-[#102126]/80 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#f1d4a1]">
                        Best seller
                      </div>
                    </div>
                    <div className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-cafe-text">{item.name}</p>
                        <Badge tone="cream">{item.orderCount}</Badge>
                      </div>
                      <p className="text-sm text-cafe-accent/74">{formatCurrency(item.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="flex gap-3 overflow-x-auto pb-1">
              {categoryOptions.map((option) => {
                const active = category === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[#1c2c31] text-white shadow-soft"
                        : "border border-[#e3d6c6] bg-white text-cafe-accent hover:bg-[#fbf2e8]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              {filteredMenus.map((item) => {
                const quantity = cart[item.id] ?? 0;

                return (
                  <article key={item.id} className="overflow-hidden rounded-[34px] bg-white shadow-soft">
                    <div className="grid gap-4 p-4 sm:block sm:p-0">
                      <div className="grid gap-4 [grid-template-columns:84px_minmax(0,1fr)] sm:block">
                        <div className="relative h-20 overflow-hidden rounded-[24px] sm:h-64 sm:rounded-none sm:rounded-t-[34px]">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 space-y-3 sm:space-y-4 sm:p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-[0.24em] text-cafe-accent/60">{item.category}</p>
                              <h3 className="mt-2 text-xl font-semibold text-cafe-text sm:text-2xl">{item.name}</h3>
                            </div>
                            <Badge
                              tone={item.status === "Promo" ? "cream" : item.status === "Spesial" ? "green" : "blue"}
                            >
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm leading-7 text-cafe-accent/78">{item.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-cafe-accent/68">
                            <span>{item.prepTime}</span>
                            <span>{item.rating.toFixed(1)} rating</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-cafe-accent">{formatCurrency(item.price)}</p>
                            <Link
                              href={`/order/${item.slug}`}
                              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#eadfce] bg-[#fffaf5] px-4 py-2 text-xs font-semibold text-cafe-accent transition hover:bg-[#f8ecde]"
                            >
                              Detail
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 border-t border-[#f0e4d6] pt-3 sm:px-5 sm:pb-5 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#eadfce] bg-[#fffaf5] text-lg text-cafe-accent"
                        >
                          -
                        </button>
                        <div className="min-w-10 text-center text-sm font-semibold text-cafe-text">{quantity}</div>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cafe-accent text-lg text-white"
                        >
                          +
                        </button>
                        <Button className="ml-auto w-full sm:w-auto" onClick={() => updateQuantity(item.id, quantity + 1)}>
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            <div className="space-y-6">
              <section className="rounded-[34px] bg-white p-6 shadow-[0_22px_50px_rgba(90,61,34,0.12)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60">Cart summary</p>
                    <h2 className="mt-2 text-2xl font-semibold text-cafe-text">Your order</h2>
                  </div>
                  <Badge tone="slate">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {cartItems.length === 0 ? (
                    <div className="rounded-[24px] bg-[#fbf4ec] p-5 text-sm text-cafe-accent/75">
                      Keranjang masih kosong. Tambahkan item dari menu di sebelah kiri.
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="rounded-[24px] bg-[#fbf4ec] p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-cafe-text">{item.name}</p>
                            <p className="mt-1 text-sm text-cafe-accent/72">
                              {item.quantity} x {formatCurrency(item.price)}
                            </p>
                          </div>
                          <p className="font-semibold text-cafe-accent">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-5 space-y-3 border-t border-[#efe1d1] pt-5 text-sm">
                  <div className="flex justify-between text-cafe-accent/75">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-cafe-accent/75">
                    <span>Service fee</span>
                    <span>{formatCurrency(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-cafe-text">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-[34px] bg-[#112126] p-6 text-white shadow-[0_22px_50px_rgba(15,28,33,0.24)]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#d8a23d]">Checkout</p>
                <h2 className="mt-2 text-2xl font-semibold">Pickup or dine-in</h2>
                <form
                  className="mt-5 space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    openPaymentModal();
                  }}
                >
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-[0.22em] text-white/68">Branch</label>
                    <select
                      value={checkoutForm.branchId}
                      onChange={(event) =>
                        setCheckoutForm((current) => ({ ...current, branchId: event.target.value }))
                      }
                      className={`min-h-12 w-full rounded-[22px] border px-4 py-3 text-sm outline-none ${darkFieldClassName}`}
                    >
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id} className="text-cafe-text">
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-[0.22em] text-white/68">
                      Customer Name
                    </label>
                    <Input
                      placeholder="Masukkan nama pelanggan"
                      value={checkoutForm.customerName}
                      onChange={(event) =>
                        setCheckoutForm((current) => ({ ...current, customerName: event.target.value }))
                      }
                      required
                      className={darkFieldClassName}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-[0.22em] text-white/68">
                      Table Number
                    </label>
                    <Input
                      placeholder="Contoh: Meja 04 atau Pickup"
                      value={checkoutForm.tableNumber}
                      onChange={(event) =>
                        setCheckoutForm((current) => ({ ...current, tableNumber: event.target.value }))
                      }
                      required
                      className={darkFieldClassName}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-[0.22em] text-white/68">
                      Order Note
                    </label>
                    <Textarea
                      placeholder="Misal: less sugar, no ice, atau catatan khusus lainnya"
                      value={checkoutForm.notes}
                      onChange={(event) => setCheckoutForm((current) => ({ ...current, notes: event.target.value }))}
                      className={darkFieldClassName}
                    />
                  </div>
                  {error ? <p className="text-sm text-rose-300">{error}</p> : null}
                  <Button
                    type="button"
                    onClick={openPaymentModal}
                    className="w-full bg-[#d8a23d] text-[#162127] hover:bg-[#e0ab4a]"
                    disabled={submitting}
                  >
                    {submitting ? "Processing order..." : "Proceed to Checkout"}
                  </Button>
                </form>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <Modal
        open={paymentModalOpen}
        title="Pilih Metode Pembayaran"
        onClose={() => setPaymentModalOpen(false)}
        className="sm:max-w-xl"
      >
        <div className="space-y-5">
          <p className="text-sm leading-7 text-cafe-accent/75">
            Pilih metode pembayaran untuk order {checkoutForm.customerName || "pelanggan"} di{" "}
            <span className="font-semibold text-cafe-text">{selectedBranch?.name ?? "branch aktif"}</span> dengan total{" "}
            <span className="font-semibold text-cafe-text">{formatCurrency(total)}</span>.
          </p>

          <div className="grid gap-3">
            {paymentOptions.map((option) => {
              const available = paymentAvailability[option.value];
              const active = paymentMethod === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={!available}
                  onClick={() => setPaymentMethod(option.value)}
                  className={`rounded-[24px] border p-4 text-left transition ${
                    active
                      ? "border-cafe-accent bg-[#f8ecde] shadow-soft"
                      : "border-[#eadfce] bg-white hover:bg-[#fbf4ec]"
                  } ${available ? "" : "cursor-not-allowed opacity-60"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-cafe-text">{option.label}</p>
                      <p className="mt-1 text-sm leading-6 text-cafe-accent/72">{option.description}</p>
                    </div>
                    <Badge tone={available ? (active ? "cream" : "green") : "slate"}>
                      {available ? "Tersedia" : "Belum siap"}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-[28px] border border-[#eadfce] bg-[#fbf4ec] p-4">
            {paymentMethod === "Cash" ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-cafe-text">Pembayaran tunai</p>
                <p className="text-sm leading-7 text-cafe-accent/75">
                  {paymentSettings.cashNote || "Bayar langsung di kasir atau saat pesanan diantar ke meja."}
                </p>
              </div>
            ) : null}

            {paymentMethod === "QRIS" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cafe-text">{paymentSettings.qrisLabel || "QRIS"}</p>
                    <p className="mt-1 text-sm text-cafe-accent/72">
                      {paymentSettings.qrisNote || "Scan kode QR untuk menyelesaikan pembayaran."}
                    </p>
                  </div>
                  <Badge tone={paymentAvailability.QRIS ? "green" : "slate"}>
                    {paymentAvailability.QRIS ? "Scan siap" : "Belum tersedia"}
                  </Badge>
                </div>
                {paymentSettings.qrisImage ? (
                  <div className="relative h-56 overflow-hidden rounded-[24px] bg-white">
                    <Image
                      src={paymentSettings.qrisImage}
                      alt={paymentSettings.qrisLabel}
                      fill
                      sizes="320px"
                      className="object-contain p-4"
                    />
                  </div>
                ) : (
                  <div className="rounded-[22px] border border-dashed border-[#e2d3c1] bg-white/70 px-4 py-6 text-sm text-cafe-accent/75">
                    QRIS belum dikonfigurasi. Silakan pilih Cash atau Transfer untuk melanjutkan checkout.
                  </div>
                )}
              </div>
            ) : null}

            {paymentMethod === "Transfer" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cafe-text">
                      {paymentSettings.transferBank || "Bank transfer"}
                    </p>
                    <p className="mt-1 text-sm text-cafe-accent/72">
                      {paymentSettings.transferNote || "Transfer terlebih dahulu sebelum pesanan diproses."}
                    </p>
                  </div>
                  <Badge tone={paymentAvailability.Transfer ? "green" : "slate"}>
                    {paymentAvailability.Transfer ? "Rekening siap" : "Belum tersedia"}
                  </Badge>
                </div>
                <div className="rounded-[22px] bg-white/80 p-4 text-sm text-cafe-accent/78">
                  <p className="font-semibold text-cafe-text">
                    {paymentSettings.transferAccountNumber || "Nomor rekening belum diisi"}
                  </p>
                  <p className="mt-1">{paymentSettings.transferAccountName || "Nama rekening belum diisi"}</p>
                </div>
              </div>
            ) : null}
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setPaymentModalOpen(false)} className="w-full sm:w-auto">
              Kembali
            </Button>
            <Button
              onClick={confirmCheckout}
              disabled={submitting || !paymentAvailability[paymentMethod]}
              className="w-full bg-[#d8a23d] text-[#162127] hover:bg-[#e0ab4a] sm:w-auto"
            >
              {submitting ? "Memproses..." : `Konfirmasi ${paymentMethod}`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
