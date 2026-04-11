"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DataTable } from "@/components/ui/table";
import { requestJson } from "@/lib/client-api";
import {
  supplyUnitOptions,
  type BranchRecord,
  type StockHistoryRecord,
  type SupplyPayload,
  type SupplyRecord,
  type SupplyStockAdjustmentPayload,
  type SupplyUnit,
} from "@/lib/models";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatQuantity,
  getDefaultLowStockThreshold,
  isLowStock,
} from "@/lib/utils";

type SupplyManagementProps = {
  initialItems: SupplyRecord[];
  initialHistory: StockHistoryRecord[];
  branches: BranchRecord[];
};

type SupplyFormState = {
  branchId: string;
  materialName: string;
  supplier: string;
  stockQuantity: number;
  unit: SupplyUnit;
  purchasePrice: number;
  lastRestockDate: string;
  lowStockThreshold: number;
};

type RestockFormState = {
  quantity: number;
  note: string;
};

const selectClassName =
  "min-h-12 w-full rounded-[22px] border border-[#eadfce] bg-[#fffaf5] px-4 py-3 text-sm text-cafe-text outline-none shadow-inner focus:border-cafe-primary/70 focus:ring-2 focus:ring-cafe-primary/20";

const emptyForm: SupplyFormState = {
  branchId: "",
  materialName: "",
  supplier: "",
  stockQuantity: 0,
  unit: "kg",
  purchasePrice: 0,
  lastRestockDate: "",
  lowStockThreshold: getDefaultLowStockThreshold("kg"),
};

const emptyRestockForm: RestockFormState = {
  quantity: 0,
  note: "",
};

function toFormState(item: SupplyRecord): SupplyFormState {
  return {
    branchId: item.branchId,
    materialName: item.materialName,
    supplier: item.supplier,
    stockQuantity: item.stockQuantity,
    unit: item.unit,
    purchasePrice: item.purchasePrice,
    lastRestockDate: item.lastRestockDate,
    lowStockThreshold: item.lowStockThreshold,
  };
}

function getHistoryTone(changeType: StockHistoryRecord["changeType"]) {
  if (changeType === "Restock") {
    return "green";
  }

  if (changeType === "Order") {
    return "cream";
  }

  return "slate";
}

export function SupplyManagement({ initialItems, initialHistory, branches }: SupplyManagementProps) {
  const defaultBranchId = branches[0]?.id ?? "";
  const [items, setItems] = useState(initialItems);
  const [history, setHistory] = useState(initialHistory);
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<SupplyRecord | null>(null);
  const [editingItem, setEditingItem] = useState<SupplyRecord | null>(null);
  const [restockItem, setRestockItem] = useState<SupplyRecord | null>(null);
  const [form, setForm] = useState<SupplyFormState>(emptyForm);
  const [restockForm, setRestockForm] = useState<RestockFormState>(emptyRestockForm);
  const [submitting, setSubmitting] = useState(false);
  const [restocking, setRestocking] = useState(false);
  const [error, setError] = useState("");
  const [restockError, setRestockError] = useState("");

  const filteredItems = items.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId);
  const filteredHistory = history.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId);
  const lowStockItems = filteredItems.filter((item) => isLowStock(item));
  const inventoryValue = filteredItems.reduce((sum, item) => sum + item.stockQuantity * item.purchasePrice, 0);

  const refreshHistory = async () => {
    const nextHistory = await requestJson<StockHistoryRecord[]>("/api/stock-history?limit=20");
    setHistory(nextHistory);
  };

  const columns: ColumnDef<SupplyRecord>[] = [
    {
      header: "Material Name",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-cafe-text">{row.original.materialName}</p>
          <p className="mt-1 text-xs text-cafe-accent/68">{row.original.branchName} | {row.original.supplier}</p>
        </div>
      ),
    },
    {
      header: "Current Stock",
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge tone={isLowStock(row.original) ? "rose" : "slate"}>
            {formatQuantity(row.original.stockQuantity, row.original.unit)}
          </Badge>
          <p className="text-xs text-cafe-accent/65">
            Min. {formatQuantity(row.original.lowStockThreshold, row.original.unit)}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) =>
        isLowStock(row.original) ? <Badge tone="rose">Low Stock</Badge> : <Badge tone="green">Safe</Badge>,
    },
    {
      header: "Last Update",
      cell: ({ row }) => (
        <div>
          <p>{formatDate(row.original.updatedAt)}</p>
          <p className="mt-1 text-xs text-cafe-accent/68">Restock {formatDate(row.original.lastRestockDate)}</p>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="glass" className="min-h-10 px-4 py-2 text-xs" onClick={() => setDetailItem(row.original)}>
            View Details
          </Button>
          <Button variant="secondary" className="min-h-10 px-4 py-2 text-xs" onClick={() => openRestockModal(row.original)}>
            Restock
          </Button>
          <Button variant="secondary" className="min-h-10 px-4 py-2 text-xs" onClick={() => openEditModal(row.original)}>
            Edit
          </Button>
          <Button className="min-h-10 px-4 py-2 text-xs" onClick={() => deleteItem(row.original)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      ...emptyForm,
      branchId: selectedBranchId === "all" ? defaultBranchId : selectedBranchId,
    });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item: SupplyRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setError("");
    setModalOpen(true);
  };

  const openRestockModal = (item: SupplyRecord) => {
    setRestockItem(item);
    setRestockForm(emptyRestockForm);
    setRestockError("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setError("");
  };

  const closeRestockModal = () => {
    setRestockItem(null);
    setRestockForm(emptyRestockForm);
    setRestockError("");
  };

  const saveItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload: SupplyPayload = {
        branchId: form.branchId,
        materialName: form.materialName,
        supplier: form.supplier,
        stockQuantity: form.stockQuantity,
        unit: form.unit,
        purchasePrice: form.purchasePrice,
        lastRestockDate: form.lastRestockDate,
        lowStockThreshold: form.lowStockThreshold,
      };

      const savedItem = editingItem
        ? await requestJson<SupplyRecord>(`/api/supplies/${editingItem.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        : await requestJson<SupplyRecord>("/api/supplies", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

      setItems((current) => {
        if (editingItem) {
          return current.map((item) => (item.id === savedItem.id ? savedItem : item));
        }

        return [savedItem, ...current];
      });

      await refreshHistory();
      closeModal();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Gagal menyimpan supply.");
    } finally {
      setSubmitting(false);
    }
  };

  const restockItemStock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!restockItem) {
      return;
    }

    setRestocking(true);
    setRestockError("");

    try {
      const payload: SupplyStockAdjustmentPayload = {
        quantity: restockForm.quantity,
        note: restockForm.note,
      };
      const updatedItem = await requestJson<SupplyRecord>(`/api/supplies/${restockItem.id}/restock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setItems((current) => current.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
      setDetailItem((current) => (current?.id === updatedItem.id ? updatedItem : current));
      await refreshHistory();
      closeRestockModal();
    } catch (requestError) {
      setRestockError(requestError instanceof Error ? requestError.message : "Gagal melakukan restock.");
    } finally {
      setRestocking(false);
    }
  };

  const deleteItem = async (item: SupplyRecord) => {
    const confirmed = window.confirm(`Hapus bahan "${item.materialName}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await requestJson<void>(`/api/supplies/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((entry) => entry.id !== item.id));

      if (detailItem?.id === item.id) {
        setDetailItem(null);
      }

      await refreshHistory();
    } catch (requestError) {
      window.alert(requestError instanceof Error ? requestError.message : "Gagal menghapus bahan.");
    }
  };

  const detailHistory = detailItem ? history.filter((entry) => entry.supplyId === detailItem.id).slice(0, 6) : [];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5 bg-[#fffaf5]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Supply manager</p>
              <h3 className="mt-2 text-2xl font-semibold text-cafe-text">
                Stok bahan hidup, low-stock alert, dan histori perubahan yang rapi
              </h3>
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
              <Button onClick={openCreateModal} className="w-full sm:w-auto">
                Add Supply
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Total item", value: String(filteredItems.length) },
              { label: "Low stock", value: String(lowStockItems.length) },
              { label: "Inventory value", value: formatCurrency(inventoryValue) },
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
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Critical supplies</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Bahan yang perlu diprioritaskan</h3>
          </div>
          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/75">
                Semua stok aman. Belum ada bahan yang masuk ambang minimum.
              </div>
            ) : (
              lowStockItems.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-[24px] bg-[#fbf4ec] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-cafe-text">{item.materialName}</p>
                      <p className="mt-1 text-xs text-cafe-accent/68">
                        {item.branchName} | {item.supplier}
                      </p>
                    </div>
                    <Badge tone="rose">{formatQuantity(item.stockQuantity, item.unit)}</Badge>
                  </div>
                  <p className="mt-3 text-xs text-cafe-accent/70">
                    Minimum aman {formatQuantity(item.lowStockThreshold, item.unit)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <Card className="space-y-5 bg-[#fffaf5]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Supply table</p>
          <h3 className="mt-2 text-2xl font-semibold text-cafe-text">
            Current stock, warning status, dan action panel dalam satu tampilan
          </h3>
        </div>
        <DataTable data={filteredItems} columns={columns} />
      </Card>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4 bg-[#fffaf5]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Low stock warning</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Alert yang tampil di dashboard admin</h3>
          </div>
          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/75">
                Tidak ada warning aktif saat ini.
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-cafe-text">{item.materialName}</p>
                      <p className="mt-1 text-xs text-cafe-accent/68">Updated {formatDate(item.updatedAt)}</p>
                    </div>
                    <Badge tone="rose">Low</Badge>
                  </div>
                  <p className="mt-3 text-sm text-cafe-accent/78">
                    Current stock {formatQuantity(item.stockQuantity, item.unit)} dari minimum{" "}
                    {formatQuantity(item.lowStockThreshold, item.unit)}.
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="space-y-4 bg-[#fffaf5]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Stock history</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Log perubahan stok terbaru</h3>
          </div>
          <div className="space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/75">
                Belum ada histori stok untuk branch yang dipilih.
              </div>
            ) : (
              filteredHistory.map((entry) => (
                <div key={entry.id} className="rounded-[24px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-cafe-text">{entry.materialName}</p>
                      <p className="mt-1 text-xs text-cafe-accent/68">
                        {entry.branchName} | {formatDateTime(entry.date)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={getHistoryTone(entry.changeType)}>{entry.changeType}</Badge>
                      <Badge tone={entry.quantityChanged < 0 ? "rose" : "green"}>
                        {entry.quantityChanged > 0 ? "+" : ""}
                        {formatQuantity(entry.quantityChanged, entry.unit)}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-cafe-accent/72">
                    <span>Stock now {formatQuantity(entry.resultingStock, entry.supplyUnit)}</span>
                    <span>&bull;</span>
                    <span>{entry.reference}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <Modal open={modalOpen} title={editingItem ? "Edit Supply" : "Add Supply"} onClose={closeModal} className="sm:max-w-3xl">
        <form className="space-y-5" onSubmit={saveItem}>
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
              <label className="text-sm font-medium text-cafe-text">Material Name</label>
              <Input
                value={form.materialName}
                onChange={(event) => setForm((current) => ({ ...current, materialName: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Supplier</label>
              <Input
                value={form.supplier}
                onChange={(event) => setForm((current) => ({ ...current, supplier: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Stock Quantity</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.stockQuantity}
                onChange={(event) =>
                  setForm((current) => ({ ...current, stockQuantity: Number(event.target.value || 0) }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Unit</label>
              <select
                className={selectClassName}
                value={form.unit}
                onChange={(event) => {
                  const nextUnit = event.target.value as SupplyUnit;

                  setForm((current) => ({
                    ...current,
                    unit: nextUnit,
                    lowStockThreshold: getDefaultLowStockThreshold(nextUnit),
                  }));
                }}
              >
                {supplyUnitOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Purchase Price</label>
              <CurrencyInput
                value={form.purchasePrice}
                onChange={(value) => setForm((current) => ({ ...current, purchasePrice: value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Last Restock Date</label>
              <Input
                type="date"
                value={form.lastRestockDate}
                onChange={(event) => setForm((current) => ({ ...current, lastRestockDate: event.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-cafe-text">Low Stock Threshold</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.lowStockThreshold}
                onChange={(event) =>
                  setForm((current) => ({ ...current, lowStockThreshold: Number(event.target.value || 0) }))
                }
              />
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : editingItem ? "Update Supply" : "Simpan Supply"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(restockItem)} title={`Restock ${restockItem?.materialName ?? ""}`} onClose={closeRestockModal}>
        <form className="space-y-5" onSubmit={restockItemStock}>
          <div className="rounded-[24px] bg-[#fbf4ec] p-4 text-sm text-cafe-accent/78">
            Tambahkan stok baru ke bahan ini. Riwayat restock otomatis akan masuk ke stock history.
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Quantity</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={restockForm.quantity}
                onChange={(event) =>
                  setRestockForm((current) => ({ ...current, quantity: Number(event.target.value || 0) }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Note</label>
              <Input
                value={restockForm.note}
                onChange={(event) => setRestockForm((current) => ({ ...current, note: event.target.value }))}
                placeholder="Contoh: Restock pagi dari supplier utama"
              />
            </div>
          </div>
          {restockError ? <p className="text-sm text-rose-600">{restockError}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={closeRestockModal}>
              Batal
            </Button>
            <Button type="submit" disabled={restocking}>
              {restocking ? "Menyimpan..." : "Simpan Restock"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(detailItem)} title={detailItem?.materialName ?? "Detail Supply"} onClose={() => setDetailItem(null)}>
        {detailItem ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Branch</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{detailItem.branchName}</p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Current Stock</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">
                  {formatQuantity(detailItem.stockQuantity, detailItem.unit)}
                </p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Harga beli</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{formatCurrency(detailItem.purchasePrice)}</p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Supplier</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{detailItem.supplier}</p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Threshold</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">
                  {formatQuantity(detailItem.lowStockThreshold, detailItem.unit)}
                </p>
              </Card>
            </div>
            <div className="rounded-[24px] bg-[#fbf4ec] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-cafe-text">Recent activity</p>
                {isLowStock(detailItem) ? <Badge tone="rose">Low Stock</Badge> : <Badge tone="green">Safe</Badge>}
              </div>
              <div className="mt-4 space-y-3">
                {detailHistory.length === 0 ? (
                  <p className="text-sm text-cafe-accent/75">Belum ada histori untuk bahan ini.</p>
                ) : (
                  detailHistory.map((entry) => (
                    <div key={entry.id} className="rounded-[20px] bg-white/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <Badge tone={getHistoryTone(entry.changeType)}>{entry.changeType}</Badge>
                        <p className="text-xs text-cafe-accent/68">{formatDateTime(entry.date)}</p>
                      </div>
                      <p className="mt-3 text-sm text-cafe-text">
                        {entry.quantityChanged > 0 ? "+" : ""}
                        {formatQuantity(entry.quantityChanged, entry.unit)} | stock sekarang{" "}
                        {formatQuantity(entry.resultingStock, entry.supplyUnit)}
                      </p>
                      <p className="mt-2 text-xs text-cafe-accent/72">{entry.reference}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
