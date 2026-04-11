"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import { ImageDropzone } from "@/components/management/image-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DataTable } from "@/components/ui/table";
import { requestJson, uploadImage } from "@/lib/client-api";
import {
  assetCategoryOptions,
  assetConditionOptions,
  type AssetCategory,
  type AssetCondition,
  type AssetPayload,
  type AssetRecord,
} from "@/lib/models";
import { formatCurrency, formatDate } from "@/lib/utils";

type AssetManagementProps = {
  initialItems: AssetRecord[];
};

type AssetFormState = {
  assetName: string;
  category: AssetCategory;
  purchaseDate: string;
  purchasePrice: number;
  condition: AssetCondition;
  photo: string;
};

const selectClassName =
  "min-h-12 w-full rounded-[22px] border border-[#eadfce] bg-[#fffaf5] px-4 py-3 text-sm text-cafe-text outline-none shadow-inner focus:border-cafe-primary/70 focus:ring-2 focus:ring-cafe-primary/20";

const emptyForm: AssetFormState = {
  assetName: "",
  category: "Equipment",
  purchaseDate: "",
  purchasePrice: 0,
  condition: "Good",
  photo: "",
};

function toFormState(item: AssetRecord): AssetFormState {
  return {
    assetName: item.assetName,
    category: item.category,
    purchaseDate: item.purchaseDate,
    purchasePrice: item.purchasePrice,
    condition: item.condition,
    photo: item.photo,
  };
}

export function AssetManagement({ initialItems }: AssetManagementProps) {
  const [items, setItems] = useState(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<AssetRecord | null>(null);
  const [editingItem, setEditingItem] = useState<AssetRecord | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [form, setForm] = useState<AssetFormState>(emptyForm);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const columns: ColumnDef<AssetRecord>[] = [
    {
      header: "Asset",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-cafe-text">{row.original.assetName}</p>
          <p className="mt-1 text-xs text-cafe-accent/68">{row.original.category}</p>
        </div>
      ),
    },
    {
      header: "Purchase Date",
      cell: ({ row }) => formatDate(row.original.purchaseDate),
    },
    {
      header: "Price",
      cell: ({ row }) => formatCurrency(row.original.purchasePrice),
    },
    {
      header: "Condition",
      cell: ({ row }) => (
        <Badge tone={row.original.condition === "Good" ? "green" : row.original.condition === "Maintenance" ? "cream" : "rose"}>
          {row.original.condition}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="glass" className="min-h-10 px-4 py-2 text-xs" onClick={() => setDetailItem(row.original)}>
            View Details
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
    setPhotoFile(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item: AssetRecord) => {
    setEditingItem(item);
    setPhotoFile(null);
    setForm(toFormState(item));
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setPhotoFile(null);
    setError("");
  };

  const saveItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const photo = photoFile ? await uploadImage(photoFile, "assets") : form.photo;
      const payload: AssetPayload = {
        assetName: form.assetName,
        category: form.category,
        purchaseDate: form.purchaseDate,
        purchasePrice: form.purchasePrice,
        condition: form.condition,
        photo,
      };

      const savedItem = editingItem
        ? await requestJson<AssetRecord>(`/api/assets/${editingItem.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        : await requestJson<AssetRecord>("/api/assets", {
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
      closeModal();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Gagal menyimpan aset.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (item: AssetRecord) => {
    const confirmed = window.confirm(`Hapus aset "${item.assetName}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await requestJson<void>(`/api/assets/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      if (detailItem?.id === item.id) {
        setDetailItem(null);
      }
    } catch (requestError) {
      window.alert(requestError instanceof Error ? requestError.message : "Gagal menghapus aset.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5 bg-[#fffaf5]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Asset manager</p>
              <h3 className="mt-2 text-2xl font-semibold text-cafe-text">Inventaris cafe dengan foto, kondisi, dan histori beli</h3>
            </div>
            <Button onClick={openCreateModal} className="w-full sm:w-auto">
              Add Asset
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant={viewMode === "cards" ? "primary" : "secondary"} onClick={() => setViewMode("cards")}>
              Card View
            </Button>
            <Button variant={viewMode === "table" ? "primary" : "secondary"} onClick={() => setViewMode("table")}>
              Table View
            </Button>
          </div>
        </Card>

        <Card className="space-y-4 bg-[#fffaf5]">
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Asset status</p>
          {[
            { label: "Good", value: items.filter((item) => item.condition === "Good").length, tone: "green" as const },
            { label: "Maintenance", value: items.filter((item) => item.condition === "Maintenance").length, tone: "cream" as const },
            { label: "Broken", value: items.filter((item) => item.condition === "Broken").length, tone: "rose" as const },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-[24px] bg-[#fbf4ec] p-4">
              <p className="font-semibold text-cafe-text">{item.label}</p>
              <Badge tone={item.tone}>{item.value}</Badge>
            </div>
          ))}
        </Card>
      </section>

      {viewMode === "cards" ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[32px] border border-white/75 bg-white/85 shadow-soft"
            >
              <div className="relative h-60">
                <Image src={item.photo} alt={item.assetName} fill className="object-cover" />
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">{item.category}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-cafe-text">{item.assetName}</h3>
                  </div>
                  <Badge tone={item.condition === "Good" ? "green" : item.condition === "Maintenance" ? "cream" : "rose"}>
                    {item.condition}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-cafe-accent/78">
                  <p>{formatDate(item.purchaseDate)}</p>
                  <p>{formatCurrency(item.purchasePrice)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="glass" className="min-h-10 px-4 py-2 text-xs" onClick={() => setDetailItem(item)}>
                    View Details
                  </Button>
                  <Button variant="secondary" className="min-h-10 px-4 py-2 text-xs" onClick={() => openEditModal(item)}>
                    Edit
                  </Button>
                  <Button className="min-h-10 px-4 py-2 text-xs" onClick={() => deleteItem(item)}>
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <Card className="space-y-5 bg-[#fffaf5]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Asset table</p>
            <h3 className="mt-2 text-2xl font-semibold text-cafe-text">Table view untuk audit inventaris</h3>
          </div>
          <DataTable data={items} columns={columns} />
        </Card>
      )}

      <Modal open={modalOpen} title={editingItem ? "Edit Asset" : "Add Asset"} onClose={closeModal} className="sm:max-w-3xl">
        <form className="space-y-5" onSubmit={saveItem}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Asset Name</label>
              <Input
                value={form.assetName}
                onChange={(event) => setForm((current) => ({ ...current, assetName: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Category</label>
              <select
                className={selectClassName}
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value as AssetCategory }))
                }
              >
                {assetCategoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Purchase Date</label>
              <Input
                type="date"
                value={form.purchaseDate}
                onChange={(event) => setForm((current) => ({ ...current, purchaseDate: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Purchase Price</label>
              <CurrencyInput
                value={form.purchasePrice}
                onChange={(value) => setForm((current) => ({ ...current, purchasePrice: value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-cafe-text">Condition</label>
              <select
                className={selectClassName}
                value={form.condition}
                onChange={(event) =>
                  setForm((current) => ({ ...current, condition: event.target.value as AssetCondition }))
                }
              >
                {assetConditionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <ImageDropzone
                label="Asset Photo Upload"
                description="Foto aset disimpan ke storage lokal aplikasi dan tampil sebelum penyimpanan."
                initialImage={form.photo}
                onChange={setPhotoFile}
              />
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : editingItem ? "Update Asset" : "Simpan Asset"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(detailItem)} title={detailItem?.assetName ?? "Detail Asset"} onClose={() => setDetailItem(null)}>
        {detailItem ? (
          <div className="space-y-5">
            <div className="relative h-72 overflow-hidden rounded-[28px]">
              <Image src={detailItem.photo} alt={detailItem.assetName} fill className="object-cover" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Kategori</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{detailItem.category}</p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Kondisi</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{detailItem.condition}</p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Tanggal beli</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{formatDate(detailItem.purchaseDate)}</p>
              </Card>
              <Card className="bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Harga beli</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{formatCurrency(detailItem.purchasePrice)}</p>
              </Card>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
