"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { canCreateOrders, isProductionFloorRole, roleLabels, type UserRole } from "@/lib/auth/roles";
import { requestJson } from "@/lib/client-api";
import type { BranchRecord, MenuRecord, OrderPayload, OrderRecord, SupplyRecord } from "@/lib/models";
import { formatCurrency, formatDateTime, formatQuantity, getReceiptLink, stripPaymentMethodFromNotes } from "@/lib/utils";

type OrderManagementProps = {
  menus: MenuRecord[];
  initialOrders: OrderRecord[];
  lowStockItems: SupplyRecord[];
  branches: BranchRecord[];
  currentRole: UserRole;
};

type CartState = Record<string, number>;

type OrderFormState = {
  branchId: string;
  customerName: string;
  tableNumber: string;
  notes: string;
};

const statuses = ["Pramusaji", "Dapur", "Siap Antar", "Selesai"] as const;
const selectClassName =
  "min-h-12 w-full rounded-[22px] border border-[#eadfce] bg-[#fffaf5] px-4 py-3 text-sm text-cafe-text outline-none shadow-inner focus:border-cafe-primary/70 focus:ring-2 focus:ring-cafe-primary/20";

function getStatusTone(status: OrderRecord["status"]) {
  if (status === "Selesai") {
    return "green";
  }

  if (status === "Dapur") {
    return "cream";
  }

  if (status === "Siap Antar") {
    return "blue";
  }

  return "slate";
}

export function OrderManagement({ menus, initialOrders, lowStockItems, branches, currentRole }: OrderManagementProps) {
  const defaultBranchId = branches[0]?.id ?? "";
  const canManageOrders = canCreateOrders(currentRole);
  const productionView = isProductionFloorRole(currentRole);
  const createEmptyOrderForm = (): OrderFormState => ({
    branchId: defaultBranchId,
    customerName: "",
    tableNumber: "",
    notes: "",
  });

  const [orders, setOrders] = useState(initialOrders);
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [cart, setCart] = useState<CartState>({});
  const [form, setForm] = useState<OrderFormState>(createEmptyOrderForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredOrders = useMemo(
    () => orders.filter((order) => selectedBranchId === "all" || order.branchId === selectedBranchId),
    [orders, selectedBranchId],
  );
  const visibleOrders = useMemo(
    () => (productionView ? filteredOrders.filter((order) => order.status !== "Selesai") : filteredOrders),
    [filteredOrders, productionView],
  );
  const filteredLowStockItems = useMemo(
    () => lowStockItems.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId),
    [lowStockItems, selectedBranchId],
  );

  const customerHistory = useMemo(
    () =>
      Array.from(
        filteredOrders.reduce<
          Map<
            string,
            {
              customerName: string;
              totalOrders: number;
              totalSpent: number;
              lastOrder: string;
              branchNames: string[];
            }
          >
        >((map, order) => {
          const key = order.customerName.trim().toLowerCase();
          const current = map.get(key);

          if (current) {
            current.totalOrders += 1;
            current.totalSpent += order.total;
            if (order.createdAt > current.lastOrder) {
              current.lastOrder = order.createdAt;
            }
            if (!current.branchNames.includes(order.branchName)) {
              current.branchNames.push(order.branchName);
            }

            return map;
          }

          map.set(key, {
            customerName: order.customerName,
            totalOrders: 1,
            totalSpent: order.total,
            lastOrder: order.createdAt,
            branchNames: [order.branchName],
          });

          return map;
        }, new Map()),
      )
        .map(([, value]) => value)
        .sort((left, right) => right.lastOrder.localeCompare(left.lastOrder))
        .slice(0, 6),
    [filteredOrders],
  );

  const cartItems = menus
    .filter((menu) => (cart[menu.id] ?? 0) > 0)
    .map((menu) => ({
      ...menu,
      quantity: cart[menu.id],
    }));

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = subtotal > 0 ? 6000 : 0;
  const total = subtotal + serviceFee;
  const latestOrder = visibleOrders[0] ?? null;

  const openModal = () => {
    setModalOpen(true);
    setCart({});
    setForm(createEmptyOrderForm());
    setError("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setCart({});
    setForm(createEmptyOrderForm());
    setError("");
  };

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

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (cartItems.length === 0) {
        throw new Error("Tambahkan minimal satu menu ke pesanan.");
      }

      const payload: OrderPayload = {
        branchId: form.branchId,
        customerName: form.customerName,
        tableNumber: form.tableNumber,
        paymentMethod: "Cash",
        notes: form.notes,
        items: cartItems.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
      };
      const newOrder = await requestJson<OrderRecord>("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setOrders((current) => [newOrder, ...current]);
      closeModal();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Gagal membuat pesanan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5 bg-[#fffaf5]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Order Tracking</p>
              <h3 className="mt-2 text-2xl font-semibold text-cafe-text">Pesanan live yang terhubung ke stok bahan</h3>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <select className={selectClassName} value={selectedBranchId} onChange={(event) => setSelectedBranchId(event.target.value)}>
                <option value="all">Semua Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {canManageOrders ? <Button onClick={openModal}>Buat Order</Button> : null}
            </div>
          </div>
          <div className="rounded-[24px] border border-cafe-line bg-cafe-secondary/20 p-4 text-sm text-cafe-accent/78">
            Tampilan aktif: <span className="font-semibold text-cafe-text">{roleLabels[currentRole]}</span>
            {productionView ? " • mode ini hanya menampilkan order masuk untuk area operasional." : " • mode ini dapat membuat pesanan baru dan mengelola invoice."}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Order hari ini", value: String(visibleOrders.length) },
              { label: "Perlu diproses", value: String(visibleOrders.filter((item) => item.status !== "Selesai").length) },
              { label: "Low stock alert", value: String(filteredLowStockItems.length) },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-cafe-text">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 bg-[#fffaf5]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Auto stock impact</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Peringatan bahan yang sudah menipis</h3>
          </div>
          <div className="space-y-3">
            {filteredLowStockItems.length === 0 ? (
              <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/75">
                Semua bahan masih dalam kondisi aman.
              </div>
            ) : (
              filteredLowStockItems.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-[24px] bg-[#fbf4ec] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-cafe-text">{item.materialName}</p>
                      <p className="mt-1 text-xs text-cafe-accent/68">{item.branchName} | {item.supplier}</p>
                    </div>
                    <Badge tone="rose">{formatQuantity(item.stockQuantity, item.unit)}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card className="space-y-4 bg-[#fffaf5]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Kitchen board</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Alur pesanan dari kasir ke penyajian</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statuses.map((status) => (
              <div key={status} className="rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-cafe-text">{status}</h4>
                  <Badge tone={getStatusTone(status)}>{visibleOrders.filter((order) => order.status === status).length}</Badge>
                </div>
                <div className="space-y-3">
                  {visibleOrders
                    .filter((order) => order.status === status)
                    .slice(0, 4)
                    .map((order) => (
                      <div key={order.id} className="rounded-[20px] bg-white/90 p-3 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-cafe-text">{order.tableNumber}</p>
                          <span className="text-xs text-cafe-accent/65">{order.orderCode}</span>
                        </div>
                        <p className="mt-1 text-sm text-cafe-accent/80">{order.customerName}</p>
                        <p className="mt-1 text-xs text-cafe-accent/65">{order.branchName}</p>
                        <p className="mt-2 text-xs text-cafe-accent/65">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} item
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5 bg-[#fffaf5]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Latest invoice</p>
              <h3 className="mt-2 text-xl font-semibold text-cafe-text">
                {latestOrder?.orderCode ?? "Belum ada pesanan"}
              </h3>
            </div>
            {latestOrder ? <Badge tone={getStatusTone(latestOrder.status)}>{latestOrder.status}</Badge> : null}
          </div>
          {latestOrder ? (
            <>
              <div className="rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-cafe-accent/65">
                  <span>{latestOrder.customerName}</span>
                  <span>{latestOrder.branchName}</span>
                </div>
                <p className="mb-3 text-sm text-cafe-accent/72">{latestOrder.tableNumber}</p>
                <div className="space-y-3">
                  {latestOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-cafe-text">
                      <span>
                        {item.quantity}x {item.menuName}
                      </span>
                      <span>{formatCurrency(item.quantity * item.unitPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 border-t border-[#efe1d1] pt-4 text-sm">
                <div className="flex justify-between text-cafe-accent/72">
                  <span>Subtotal</span>
                  <span>{formatCurrency(latestOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-cafe-accent/72">
                  <span>Service fee</span>
                  <span>{formatCurrency(latestOrder.serviceFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-cafe-text">
                  <span>Total</span>
                  <span>{formatCurrency(latestOrder.total)}</span>
                </div>
              </div>
              <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/75">
                Dibuat {formatDateTime(latestOrder.createdAt)}
              </div>
              <Link
                href={getReceiptLink(latestOrder.orderCode)}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#eadfce] bg-white px-5 py-3 text-sm font-semibold text-cafe-accent transition hover:bg-[#fbf0e2]"
              >
                View Receipt
              </Link>
            </>
          ) : (
            <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/75">
              Belum ada pesanan yang tercatat.
            </div>
          )}
        </Card>
      </section>

      <Card className="space-y-4 bg-[#fffaf5]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Recent orders</p>
          <h3 className="mt-2 text-xl font-semibold text-cafe-text">Riwayat pesanan terbaru</h3>
        </div>
        <div className="space-y-3">
          {visibleOrders.map((order) => (
            <div
              key={order.id}
              className="grid gap-4 rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4 md:grid-cols-[1.2fr_0.8fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold text-cafe-text">{order.orderCode}</p>
                  <Badge tone={getStatusTone(order.status)}>{order.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-cafe-accent/78">
                  {order.customerName} - {order.tableNumber}
                </p>
                <p className="mt-2 text-xs text-cafe-accent/68">{order.branchName} | {formatDateTime(order.createdAt)}</p>
              </div>
              <div className="space-y-1 text-sm text-cafe-text">
                {order.items.map((item) => (
                  <p key={item.id}>
                    {item.quantity}x {item.menuName}
                  </p>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4 md:block md:text-right">
                <p className="text-sm text-cafe-accent/68">
                  {stripPaymentMethodFromNotes(order.notes) || "Tanpa catatan"}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-cafe-accent/58">{order.paymentMethod}</p>
                <div className="mt-2 flex items-center gap-3 md:justify-end">
                  <p className="font-semibold text-cafe-accent">{formatCurrency(order.total)}</p>
                  <Link
                    href={getReceiptLink(order.orderCode)}
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-semibold text-cafe-accent transition hover:bg-[#fbf0e2]"
                  >
                    Receipt
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {!productionView ? <Card className="space-y-4 bg-[#fffaf5]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Customer history</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Riwayat order per customer</h3>
          </div>
          <Badge tone="slate">{customerHistory.length} customers</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {customerHistory.map((customer) => (
            <div key={customer.customerName} className="rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-cafe-text">{customer.customerName}</p>
                  <p className="mt-1 text-xs text-cafe-accent/68">{customer.branchNames.join(", ")}</p>
                </div>
                <Badge tone="cream">{customer.totalOrders} order</Badge>
              </div>
              <p className="mt-4 text-sm text-cafe-accent/75">Total spend {formatCurrency(customer.totalSpent)}</p>
              <p className="mt-2 text-xs text-cafe-accent/68">Last order {formatDateTime(customer.lastOrder)}</p>
            </div>
          ))}
        </div>
      </Card> : null}

      {canManageOrders ? <Modal open={modalOpen} title="Buat Pesanan Baru" onClose={closeModal} className="sm:max-w-4xl">
        <form className="space-y-5" onSubmit={submitOrder}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Branch</label>
              <select
                className={selectClassName}
                value={form.branchId}
                onChange={(event) => setForm((current) => ({ ...current, branchId: event.target.value }))}
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Nama pelanggan</label>
              <Input
                value={form.customerName}
                onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
                placeholder="Contoh: Kartika"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Nomor meja / pickup</label>
              <Input
                value={form.tableNumber}
                onChange={(event) => setForm((current) => ({ ...current, tableNumber: event.target.value }))}
                placeholder="Contoh: Meja 08"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-cafe-text">Catatan pesanan</label>
              <Textarea
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Less sugar, no ice, atau catatan dapur lainnya"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-[26px] bg-[#fbf4ec] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-cafe-text">Pilih menu</p>
                <p className="mt-1 text-sm text-cafe-accent/75">
                  Pesanan dari sini otomatis mengurangi stok bahan berdasarkan recipe setiap menu.
                </p>
              </div>
              <Badge tone="cream">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</Badge>
            </div>
            <div className="space-y-3">
              {menus.map((menu) => {
                const quantity = cart[menu.id] ?? 0;

                return (
                  <div
                    key={menu.id}
                    className="grid gap-4 rounded-[24px] border border-white/80 bg-white/80 p-4 [grid-template-columns:72px_minmax(0,1fr)] sm:grid-cols-[88px_minmax(0,1fr)_auto]"
                  >
                    <div className="relative h-20 overflow-hidden rounded-[20px]">
                      <Image src={menu.image} alt={menu.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-cafe-text">{menu.name}</p>
                      <p className="mt-1 text-sm text-cafe-accent/75">{menu.description}</p>
                      <p className="mt-2 text-sm font-semibold text-cafe-accent">{formatCurrency(menu.price)}</p>
                    </div>
                    <div className="col-span-full flex items-center justify-end gap-2 border-t border-[#efe1d1] pt-3 sm:col-span-1 sm:border-t-0 sm:pt-0 sm:flex-col sm:justify-center">
                      <button
                        type="button"
                        onClick={() => updateQuantity(menu.id, quantity - 1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-[#fffaf5] text-lg text-cafe-accent"
                      >
                        -
                      </button>
                      <div className="min-w-10 text-center font-semibold text-cafe-text">{quantity}</div>
                      <button
                        type="button"
                        onClick={() => updateQuantity(menu.id, quantity + 1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cafe-accent text-lg text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[24px] bg-[#fbf4ec] p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-cafe-accent/72">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-cafe-accent/72">
                <span>Service fee</span>
                <span>{formatCurrency(serviceFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-cafe-text">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Membuat pesanan..." : "Simpan Pesanan"}
            </Button>
          </div>
        </form>
      </Modal> : null}
    </div>
  );
}
