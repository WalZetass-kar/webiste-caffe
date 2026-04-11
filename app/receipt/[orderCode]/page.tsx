import Link from "next/link";
import { notFound } from "next/navigation";
import { ReceiptActions } from "@/components/receipts/receipt-actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReceiptRating } from "@/components/ui/receipt-rating";
import { getOrderByCode, getRatingByOrderId } from "@/lib/server/data-store";
import { getCafeSettings } from "@/lib/server/settings-store";
import {
  formatCurrency,
  formatDateTime,
  getReceiptLink,
  stripPaymentMethodFromNotes,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

type ReceiptPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { orderCode } = await params;
  const order = await getOrderByCode(decodeURIComponent(orderCode));

  if (!order) {
    notFound();
  }

  const settings = await getCafeSettings();
  const rating = await getRatingByOrderId(order.id);
  const cleanNotes = stripPaymentMethodFromNotes(order.notes);

  return (
    <div className="min-h-screen bg-[#f7f5f2] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[36px] bg-[#102126] p-6 text-white shadow-[0_24px_60px_rgba(12,25,29,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[#d8a23d]">{settings.cafeName} Receipt</p>
              <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{order.orderCode}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
                Receipt ini bisa dibuka kembali kapan saja, dibagikan lewat link, atau diunduh sebagai PDF untuk
                arsip pelanggan dan admin.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={getReceiptLink(order.orderCode)}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                Refresh Link
              </Link>
              <Link
                href="/order"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d8a23d] px-5 py-3 text-sm font-semibold text-[#162127] transition hover:bg-[#e0ab4a]"
              >
                Back to Order
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <Card className="space-y-6 bg-white p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/62">Receipt detail</p>
                <h2 className="mt-2 text-3xl font-semibold text-cafe-text">{settings.cafeName}</h2>
              </div>
              <Badge tone="green">{order.paymentMethod}</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Branch</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{order.branchName}</p>
              </div>
              <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Customer</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{order.customerName}</p>
              </div>
              <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Table Number</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{order.tableNumber}</p>
              </div>
              <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Date & Time</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Status</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{order.status}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[28px] border border-[#efe1d1] bg-[#fffaf5]">
              <div className="min-w-[620px]">
                <div className="grid grid-cols-[minmax(0,1.6fr)_90px_120px_140px] gap-3 border-b border-[#efe1d1] px-4 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-cafe-accent/62 sm:px-6">
                  <span>Item</span>
                  <span>Qty</span>
                  <span>Price</span>
                  <span>Total</span>
                </div>
                <div className="space-y-4 px-4 py-4 sm:px-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[minmax(0,1.6fr)_90px_120px_140px] gap-3 text-sm text-cafe-text">
                      <span className="font-medium">{item.menuName}</span>
                      <span>{item.quantity}</span>
                      <span>{formatCurrency(item.unitPrice)}</span>
                      <span className="font-semibold text-cafe-accent">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {cleanNotes ? (
              <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Order note</p>
                <p className="mt-3 text-sm leading-7 text-cafe-accent/78">{cleanNotes}</p>
              </div>
            ) : null}
          </Card>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <Card className="space-y-5 bg-white p-6 shadow-soft">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/62">Payment summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-cafe-text">Total pembayaran</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-cafe-accent/75">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-cafe-accent/75">
                  <span>Service fee</span>
                  <span>{formatCurrency(order.serviceFee)}</span>
                </div>
                <div className="flex justify-between border-t border-[#efe1d1] pt-3 text-base font-semibold text-cafe-text">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
              <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/78">
                Metode pembayaran: <span className="font-semibold text-cafe-text">{order.paymentMethod}</span>
              </div>
              <ReceiptActions orderCode={order.orderCode} />
            </Card>

            <Card className="space-y-4 bg-white p-6 shadow-soft">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/62">Admin access</p>
                <h2 className="mt-2 text-2xl font-semibold text-cafe-text">Receipt juga tersedia di dashboard</h2>
              </div>
              <p className="text-sm leading-7 text-cafe-accent/76">
                Tim admin bisa membuka receipt yang sama dari modul pesanan untuk verifikasi pembayaran atau pencocokan
                transaksi harian.
              </p>
              <Link
                href="/pesanan"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#eadfce] bg-[#fffaf5] px-5 py-3 text-sm font-semibold text-cafe-accent transition hover:bg-[#fbf0e2]"
              >
                Open Admin Orders
              </Link>
            </Card>
          </aside>
        </div>

        <div className="section-shell mt-10">
          <ReceiptRating
            orderId={order.id}
            orderCode={order.orderCode}
            customerName={order.customerName}
            tableNumber={order.tableNumber}
            orderStatus={order.status}
            existingRating={rating}
          />
        </div>
      </div>
    </div>
  );
}
