import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { PageHeader } from "@/components/sections/page-header";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { selectFieldClassName } from "@/lib/design-system";
import { getOperationalSummary, filterOrdersByParams } from "@/lib/services/order";
import { getBranchItems } from "@/lib/server/branch-store";
import { getOrders } from "@/lib/server/data-store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type LaporanPageProps = {
  searchParams: Promise<{
    from?: string | string[];
    to?: string | string[];
    branch?: string | string[];
  }>;
};

function getSingleValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LaporanPage({ searchParams }: LaporanPageProps) {
  const params = await searchParams;
  const from = getSingleValue(params.from) ?? "";
  const to = getSingleValue(params.to) ?? "";
  const branchId = getSingleValue(params.branch) ?? "all";
  const [orders, branches] = await Promise.all([getOrders(), getBranchItems()]);
  const filteredOrders = filterOrdersByParams(orders, { from, to, branchId });
  const summary = getOperationalSummary(filteredOrders);
  const selectedBranch = branchId === "all" ? null : branches.find((branch) => branch.id === branchId) ?? null;
  const branchLabel = selectedBranch?.name ?? "Semua Branch";
  const exportParams = new URLSearchParams();

  if (from) {
    exportParams.set("from", from);
  }

  if (to) {
    exportParams.set("to", to);
  }

  if (branchId && branchId !== "all") {
    exportParams.set("branch", branchId);
  }

  const exportQuery = exportParams.toString();
  const csvHref = `/api/reports/export?${exportQuery}${exportQuery ? "&" : ""}format=csv`;
  const excelHref = `/api/reports/export?${exportQuery}${exportQuery ? "&" : ""}format=excel`;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Laporan Penjualan"
          title="Analitik penjualan, filter tanggal, dan export operasional"
          description="Laporan ini sekarang mendukung filter server-side berdasarkan rentang tanggal dan cabang, lengkap dengan export CSV/Excel untuk kebutuhan owner dan manager."
        />

        <Card className="space-y-4">
          <form className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_auto_auto_auto] xl:items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Dari tanggal</label>
              <input type="date" name="from" defaultValue={from} className={selectFieldClassName} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Sampai tanggal</label>
              <input type="date" name="to" defaultValue={to} className={selectFieldClassName} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Cabang</label>
              <select name="branch" defaultValue={branchId} className={selectFieldClassName}>
                <option value="all">Semua Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className={buttonStyles("primary", "w-full xl:w-auto")}>
              Terapkan Filter
            </button>
            <Link href={csvHref} className={buttonStyles("secondary", "w-full xl:w-auto")} prefetch={false}>
              Export CSV
            </Link>
            <Link href={excelHref} className={buttonStyles("glass", "w-full xl:w-auto")} prefetch={false}>
              Export Excel
            </Link>
          </form>
          <p className="text-sm leading-7 text-cafe-accent/78">
            Menampilkan data untuk <span className="font-semibold text-cafe-text">{branchLabel}</span>
            {from || to ? ` dengan periode ${from || "awal data"} sampai ${to || "hari ini"}.` : " untuk seluruh periode yang tersimpan."}
          </p>
        </Card>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Total order", value: String(summary.totalOrders), detail: branchLabel },
            { label: "Total pendapatan", value: formatCurrency(summary.totalRevenue), detail: "Omzet kotor" },
            { label: "Rata-rata transaksi", value: formatCurrency(summary.averageTransaction), detail: "Per order" },
            {
              label: "Menu terlaris",
              value: summary.topMenu?.menuName ?? "Belum ada",
              detail: summary.topMenu ? `${summary.topMenu.quantity} porsi` : "Data belum cukup",
            },
            {
              label: "Jam sibuk",
              value: summary.busyHour.count > 0 ? summary.busyHour.label : "-",
              detail: summary.busyHour.count > 0 ? `${summary.busyHour.count} order` : "Belum ada transaksi",
            },
          ].map((item) => (
            <Card key={item.label} className="space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">{item.label}</p>
              <p className="text-2xl font-semibold text-cafe-text">{item.value}</p>
              <p className="text-sm text-cafe-accent/72">{item.detail}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <SalesChart orders={filteredOrders} branchLabel={branchLabel} />
          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Summary operasional</p>
              <h3 className="mt-2 text-xl font-semibold text-cafe-text">Ringkasan harian yang bisa langsung dibaca</h3>
            </div>
            <div className="space-y-3">
              <div className="rounded-[24px] border border-cafe-line bg-cafe-secondary/20 p-4">
                <p className="text-sm font-semibold text-cafe-text">Order aktif</p>
                <p className="mt-2 text-sm text-cafe-accent/78">
                  {filteredOrders.filter((order) => order.status !== "Selesai").length} order masih berjalan pada periode ini.
                </p>
              </div>
              <div className="rounded-[24px] border border-cafe-line bg-cafe-secondary/20 p-4">
                <p className="text-sm font-semibold text-cafe-text">Customer paling sering terlihat</p>
                <p className="mt-2 text-sm text-cafe-accent/78">
                  {filteredOrders[0]?.customerName ?? "Belum ada customer dalam rentang ini."}
                </p>
              </div>
              <div className="rounded-[24px] border border-cafe-line bg-cafe-secondary/20 p-4">
                <p className="text-sm font-semibold text-cafe-text">Data source</p>
                <p className="mt-2 text-sm text-cafe-accent/78">
                  Semua angka diambil dari order tersimpan dan dihitung di server sebelum halaman dirender.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Order dataset</p>
              <h3 className="mt-2 text-xl font-semibold text-cafe-text">Daftar transaksi terfilter</h3>
            </div>
            <p className="text-sm text-cafe-accent/72">{filteredOrders.length} transaksi</p>
          </div>
          <div className="overflow-x-auto rounded-[24px] border border-cafe-line bg-cafe-surface">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-cafe-line bg-cafe-secondary/30 text-cafe-accent/80">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Branch</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-cafe-accent/72">
                      Belum ada transaksi yang cocok dengan filter ini.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.slice(0, 20).map((order) => (
                    <tr key={order.id} className="border-b border-cafe-line/60 last:border-b-0">
                      <td className="px-4 py-3 font-semibold text-cafe-text">{order.orderCode}</td>
                      <td className="px-4 py-3 text-cafe-accent/80">{order.customerName}</td>
                      <td className="px-4 py-3 text-cafe-accent/80">{order.branchName}</td>
                      <td className="px-4 py-3 text-cafe-accent/80">{order.paymentMethod}</td>
                      <td className="px-4 py-3 font-semibold text-cafe-text">{formatCurrency(order.total)}</td>
                      <td className="px-4 py-3 text-cafe-accent/80">{new Date(order.createdAt).toLocaleString("id-ID")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
