"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { requestJson } from "@/lib/client-api";
import type { BranchPayload, BranchRecord } from "@/lib/models";

type BranchManagementProps = {
  initialItems: BranchRecord[];
};

type BranchFormState = {
  name: string;
  address: string;
  manager: string;
  phoneNumber: string;
};

const emptyForm: BranchFormState = {
  name: "",
  address: "",
  manager: "",
  phoneNumber: "",
};

function toFormState(item: BranchRecord): BranchFormState {
  return {
    name: item.name,
    address: item.address,
    manager: item.manager,
    phoneNumber: item.phoneNumber,
  };
}

export function BranchManagement({ initialItems }: BranchManagementProps) {
  const [items, setItems] = useState(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BranchRecord | null>(null);
  const [form, setForm] = useState<BranchFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item: BranchRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
    setError("");
  };

  const saveItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload: BranchPayload = {
        name: form.name,
        address: form.address,
        manager: form.manager,
        phoneNumber: form.phoneNumber,
      };

      const savedItem = editingItem
        ? await requestJson<BranchRecord>(`/api/branches/${editingItem.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await requestJson<BranchRecord>("/api/branches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
      setError(requestError instanceof Error ? requestError.message : "Gagal menyimpan cabang.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (item: BranchRecord) => {
    const confirmed = window.confirm(`Hapus cabang "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await requestJson<void>(`/api/branches/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    } catch (requestError) {
      window.alert(requestError instanceof Error ? requestError.message : "Gagal menghapus cabang.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5 bg-[#fffaf5]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Branch management</p>
              <h3 className="mt-2 text-2xl font-semibold text-cafe-text">
                Kelola lokasi cafe, alamat operasional, dan PIC setiap branch
              </h3>
            </div>
            <Button onClick={openCreateModal} className="w-full sm:w-auto">
              Add Branch
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Total branch", value: String(items.length) },
              { label: "Manager aktif", value: String(items.filter((item) => item.manager.trim().length > 0).length) },
              { label: "Cabang siap order", value: String(items.length) },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-cafe-text">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 bg-[#fffaf5]">
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Owner view</p>
          {[
            "Pantau setiap branch dengan manager dan nomor telepon yang berbeda.",
            "Gunakan branch sebagai dasar filter order, supply, employee, dan attendance.",
            "Skala operasional tetap rapi saat CafeFlow tumbuh ke beberapa kota.",
          ].map((item, index) => (
            <div key={item} className="rounded-[24px] bg-[#fbf4ec] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">0{index + 1}</p>
              <p className="mt-2 text-sm leading-7 text-cafe-text">{item}</p>
            </div>
          ))}
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="space-y-5 bg-[#fffaf5]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cafe-accent/60">Branch</p>
                <h3 className="mt-2 text-2xl font-semibold text-cafe-text">{item.name}</h3>
              </div>
              <Badge tone="green">Active</Badge>
            </div>
            <div className="space-y-3 text-sm text-cafe-accent/78">
              <p>{item.address}</p>
              <p>Manager: {item.manager}</p>
              <p>Phone: {item.phoneNumber}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" className="min-h-10 px-4 py-2 text-xs" onClick={() => openEditModal(item)}>
                Edit
              </Button>
              <Button className="min-h-10 px-4 py-2 text-xs" onClick={() => deleteItem(item)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </section>

      <Modal
        open={modalOpen}
        title={editingItem ? "Edit Branch" : "Add Branch"}
        onClose={closeModal}
        className="sm:max-w-3xl"
      >
        <form className="space-y-5" onSubmit={saveItem}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Branch Name</label>
              <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Phone Number</label>
              <Input
                value={form.phoneNumber}
                onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-cafe-text">Address</label>
              <Input
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-cafe-text">Manager</label>
              <Input
                value={form.manager}
                onChange={(event) => setForm((current) => ({ ...current, manager: event.target.value }))}
                required
              />
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : editingItem ? "Update Branch" : "Simpan Branch"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
