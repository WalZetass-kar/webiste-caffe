"use client";

import { useDeferredValue, useState } from "react";
import Image from "next/image";
import { ImageDropzone } from "@/components/management/image-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { requestJson, uploadImage } from "@/lib/client-api";
import {
  menuCategoryOptions,
  menuStatusOptions,
  type MenuCategory,
  type MenuPayload,
  type MenuRecord,
  type RecommendedMenuRecord,
  type MenuStatus,
  type SupplyRecord,
  type UsageUnit,
} from "@/lib/models";
import { formatCurrency, formatQuantity, getUsageUnitsForSupplyUnit } from "@/lib/utils";

type MenuManagementProps = {
  initialItems: MenuRecord[];
  supplies: SupplyRecord[];
  recommendedItems: RecommendedMenuRecord[];
  specialMenus: Array<{
    title: string;
    schedule: string;
    discount: string;
  }>;
};

type RecipeFormItem = {
  id: string;
  supplyId: string;
  quantity: number;
  usageUnit: UsageUnit;
};

type MenuFormState = {
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  image: string;
  stock: number;
  status: MenuStatus;
  story: string;
  prepTime: string;
  pairing: string;
  featured: boolean;
  recipe: RecipeFormItem[];
};

const selectClassName =
  "min-h-12 w-full rounded-[22px] border border-[#eadfce] bg-[#fffaf5] px-4 py-3 text-sm text-cafe-text outline-none shadow-inner focus:border-cafe-primary/70 focus:ring-2 focus:ring-cafe-primary/20";

const emptyForm: MenuFormState = {
  name: "",
  category: "Coffee",
  price: 0,
  description: "",
  image: "",
  stock: 0,
  status: "Aktif",
  story: "",
  prepTime: "5 min",
  pairing: "",
  featured: false,
  recipe: [],
};

function createRecipeRow(supply?: SupplyRecord): RecipeFormItem {
  const usageUnit: UsageUnit = supply ? getUsageUnitsForSupplyUnit(supply.unit)[0] : "g";

  return {
    id: crypto.randomUUID(),
    supplyId: supply?.id ?? "",
    quantity: 0,
    usageUnit,
  };
}

function toFormState(item: MenuRecord): MenuFormState {
  return {
    name: item.name,
    category: item.category,
    price: item.price,
    description: item.description,
    image: item.image,
    stock: item.stock,
    status: item.status,
    story: item.story,
    prepTime: item.prepTime,
    pairing: item.pairing,
    featured: item.featured,
    recipe: item.recipe.map((entry) => ({
      id: entry.id,
      supplyId: entry.supplyId,
      quantity: entry.quantity,
      usageUnit: entry.usageUnit,
    })),
  };
}

export function MenuManagement({ initialItems, supplies, recommendedItems, specialMenus }: MenuManagementProps) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | MenuCategory>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<MenuRecord | null>(null);
  const [editingItem, setEditingItem] = useState<MenuRecord | null>(null);
  const [form, setForm] = useState<MenuFormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const deferredSearch = useDeferredValue(search);

  const filteredItems = items.filter((item) => {
    const query = deferredSearch.trim().toLowerCase();
    const matchesCategory = activeCategory === "All" ? true : item.category === activeCategory;
    const matchesQuery =
      query.length === 0 ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  const mappedIngredientCount = items.reduce((sum, item) => sum + item.recipe.length, 0);
  const uniqueIngredients = new Set(items.flatMap((item) => item.recipe.map((entry) => entry.supplyId))).size;

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setImageFile(null);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item: MenuRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setImageFile(null);
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setImageFile(null);
    setError("");
  };

  const addRecipeRow = () => {
    const fallbackSupply = supplies[0];

    setForm((current) => ({
      ...current,
      recipe: [...current.recipe, createRecipeRow(fallbackSupply)],
    }));
  };

  const updateRecipeRow = (id: string, patch: Partial<RecipeFormItem>) => {
    setForm((current) => ({
      ...current,
      recipe: current.recipe.map((entry) => {
        if (entry.id !== id) {
          return entry;
        }

        const nextSupplyId = patch.supplyId ?? entry.supplyId;
        const nextSupply = supplies.find((item) => item.id === nextSupplyId);
        const allowedUnits: UsageUnit[] = nextSupply ? getUsageUnitsForSupplyUnit(nextSupply.unit) : ["g"];
        const usageUnit: UsageUnit =
          patch.usageUnit && allowedUnits.includes(patch.usageUnit) ? patch.usageUnit : allowedUnits[0];

        return {
          ...entry,
          ...patch,
          usageUnit,
        };
      }),
    }));
  };

  const removeRecipeRow = (id: string) => {
    setForm((current) => ({
      ...current,
      recipe: current.recipe.filter((entry) => entry.id !== id),
    }));
  };

  const saveItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (form.recipe.length === 0) {
        throw new Error("Tambahkan minimal satu bahan untuk resep menu ini.");
      }

      const duplicateSupplies = new Set<string>();

      form.recipe.forEach((entry) => {
        if (duplicateSupplies.has(entry.supplyId)) {
          throw new Error("Setiap bahan hanya boleh dipakai sekali dalam satu resep.");
        }

        duplicateSupplies.add(entry.supplyId);
      });

      const image = imageFile ? await uploadImage(imageFile, "menus") : form.image;
      const recipe = form.recipe.map((entry) => {
        const supply = supplies.find((item) => item.id === entry.supplyId);

        if (!supply) {
          throw new Error("Ada bahan resep yang belum dipilih.");
        }

        if (entry.quantity <= 0) {
          throw new Error(`Jumlah pemakaian ${supply.materialName} harus lebih dari 0.`);
        }

        return {
          supplyId: supply.id,
          ingredientName: supply.materialName,
          quantity: entry.quantity,
          usageUnit: entry.usageUnit,
        };
      });

      const payload: MenuPayload = {
        name: form.name,
        category: form.category,
        price: form.price,
        description: form.description,
        image,
        stock: form.stock,
        status: form.status,
        story: form.story.trim() || form.description,
        prepTime: form.prepTime.trim() || "5 min",
        pairing: form.pairing.trim() || "Rekomendasi pairing belum ditambahkan.",
        ingredients: recipe.map((entry) => entry.ingredientName),
        recipe,
        featured: form.featured,
        rating: editingItem?.rating ?? 4.8,
      };

      const savedItem = editingItem
        ? await requestJson<MenuRecord>(`/api/menu-items/${editingItem.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        : await requestJson<MenuRecord>("/api/menu-items", {
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
      setError(requestError instanceof Error ? requestError.message : "Gagal menyimpan menu.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (item: MenuRecord) => {
    const confirmed = window.confirm(`Hapus menu "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await requestJson<void>(`/api/menu-items/${item.id}`, {
        method: "DELETE",
      });
      setItems((current) => current.filter((entry) => entry.id !== item.id));

      if (detailItem?.id === item.id) {
        setDetailItem(null);
      }
    } catch (requestError) {
      window.alert(requestError instanceof Error ? requestError.message : "Gagal menghapus menu.");
    }
  };

  return (
    <div className="space-y-6">
      <section id="daftar-menu" className="scroll-mt-28 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-5 bg-[#fffaf5]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Daftar Menu</p>
              <h3 className="mt-2 text-2xl font-semibold text-cafe-text">
                Cari, filter, dan kelola daftar menu cafe dari satu tempat
              </h3>
            </div>
            <Button onClick={openCreateModal} className="w-full md:w-auto">
              Add Menu
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari menu, kategori, atau bahan"
            />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(["All", ...menuCategoryOptions] as const).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeCategory === category
                      ? "bg-cafe-accent text-white"
                      : "bg-[#fbf4ec] text-cafe-accent hover:bg-[#f2e4d3]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Total menu", value: String(items.length) },
              { label: "Bahan terhubung", value: String(uniqueIngredients) },
              { label: "Recipe lines", value: String(mappedIngredientCount) },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-cafe-text">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card id="diskon" className="scroll-mt-28 space-y-4 bg-[#fffaf5]">
          <div id="spesial" className="scroll-mt-28">
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Diskon & menu spesial</p>
          </div>
          {specialMenus.map((item) => (
            <div key={item.title} className="rounded-[24px] bg-[#fbf4ec] p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-cafe-text">{item.title}</p>
                <Badge tone="green">{item.discount}</Badge>
              </div>
              <p className="mt-2 text-sm text-cafe-accent/75">{item.schedule}</p>
            </div>
          ))}
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-[32px] border border-white/75 bg-white/85 shadow-soft"
          >
            <div className="relative h-60">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cafe-accent/60">{item.category}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-cafe-text">{item.name}</h3>
                </div>
                <Badge tone={item.status === "Promo" ? "cream" : item.status === "Spesial" ? "green" : "blue"}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm leading-7 text-cafe-accent/78">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.recipe.slice(0, 3).map((ingredient) => (
                  <Badge key={ingredient.id} tone="slate">
                    {ingredient.ingredientName}
                  </Badge>
                ))}
                {item.recipe.length > 3 ? <Badge tone="cream">+{item.recipe.length - 3} more</Badge> : null}
              </div>
              <div className="flex items-center justify-between text-sm text-cafe-accent/75">
                <span>Mapped ingredients {item.recipe.length}</span>
                <span>{item.prepTime}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-cafe-accent">{formatCurrency(item.price)}</p>
                <div className="flex gap-2">
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
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {recommendedItems.map((item, index) => (
          <Card key={item.id} className="overflow-hidden bg-[#fffaf5] p-0">
            <div className="relative h-44">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#112126]/70 via-transparent to-transparent" />
              <div className="absolute left-4 top-4">
                <Badge tone="cream">Top {index + 1}</Badge>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cafe-accent/58">Best seller insight</p>
                  <h3 className="mt-2 text-xl font-semibold text-cafe-text">{item.name}</h3>
                </div>
                <Badge tone="green">{item.orderCount} order</Badge>
              </div>
              <p className="text-sm leading-7 text-cafe-accent/76">{item.description}</p>
            </div>
          </Card>
        ))}
      </section>

      <Modal open={modalOpen} title={editingItem ? "Edit Menu" : "Add Menu"} onClose={closeModal} className="sm:max-w-5xl">
        <form className="space-y-5" onSubmit={saveItem}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Menu Name</label>
              <Input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Contoh: Vanilla Cream Latte"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Category</label>
              <select
                className={selectClassName}
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value as MenuCategory }))
                }
              >
                {menuCategoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Price</label>
              <CurrencyInput value={form.price} onChange={(value) => setForm((current) => ({ ...current, price: value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Catalog Stock</label>
              <Input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => setForm((current) => ({ ...current, stock: Number(event.target.value || 0) }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-cafe-text">Description</label>
              <Textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Deskripsi singkat menu"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-cafe-text">Story / Detail</label>
              <Textarea
                value={form.story}
                onChange={(event) => setForm((current) => ({ ...current, story: event.target.value }))}
                placeholder="Ceritakan detail rasa atau highlight menu"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Status</label>
              <select
                className={selectClassName}
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value as MenuStatus }))
                }
              >
                {menuStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cafe-text">Prep Time</label>
              <Input
                value={form.prepTime}
                onChange={(event) => setForm((current) => ({ ...current, prepTime: event.target.value }))}
                placeholder="Contoh: 7 min"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-cafe-text">Pairing</label>
              <Input
                value={form.pairing}
                onChange={(event) => setForm((current) => ({ ...current, pairing: event.target.value }))}
                placeholder="Rekomendasi pasangan menu"
              />
            </div>

            <div className="space-y-4 rounded-[26px] bg-[#fbf4ec] p-4 md:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-cafe-text">Menu Ingredients</p>
                  <p className="mt-1 text-sm text-cafe-accent/75">
                    Hubungkan menu dengan supply agar stok otomatis berkurang ketika pesanan dibuat.
                  </p>
                </div>
                <Button type="button" variant="secondary" onClick={addRecipeRow}>
                  Add Ingredient
                </Button>
              </div>

              {form.recipe.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-[#dbc8b3] bg-white/60 px-4 py-5 text-sm text-cafe-accent/75">
                  Belum ada ingredient. Tambahkan minimal satu bahan untuk mengaktifkan stock deduction.
                </div>
              ) : null}

              <div className="space-y-3">
                {form.recipe.map((entry, index) => {
                  const selectedSupply = supplies.find((item) => item.id === entry.supplyId);
                  const allowedUnits: UsageUnit[] = selectedSupply
                    ? getUsageUnitsForSupplyUnit(selectedSupply.unit)
                    : ["g"];

                  return (
                    <div key={entry.id} className="rounded-[24px] border border-white/75 bg-white/85 p-4">
                      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.5fr_0.45fr_auto]">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">
                            Ingredient 0{index + 1}
                          </label>
                          <select
                            className={selectClassName}
                            value={entry.supplyId}
                            onChange={(event) => updateRecipeRow(entry.id, { supplyId: event.target.value })}
                          >
                            {supplies.map((supply) => (
                              <option key={supply.id} value={supply.id}>
                                {supply.materialName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Quantity</label>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={entry.quantity}
                            onChange={(event) =>
                              updateRecipeRow(entry.id, {
                                quantity: Number(event.target.value || 0),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Unit</label>
                          <select
                            className={selectClassName}
                            value={entry.usageUnit}
                            onChange={(event) =>
                              updateRecipeRow(entry.id, {
                                usageUnit: event.target.value as UsageUnit,
                              })
                            }
                          >
                            {allowedUnits.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            className="w-full lg:w-auto"
                            onClick={() => removeRecipeRow(entry.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      {selectedSupply ? (
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-cafe-accent/70">
                          <Badge tone="slate">
                            Stock {formatQuantity(selectedSupply.stockQuantity, selectedSupply.unit)}
                          </Badge>
                          <Badge tone="cream">Supplier {selectedSupply.supplier}</Badge>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-[22px] bg-[#fbf4ec] px-4 py-3 text-sm text-cafe-text md:col-span-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
              />
              Tampilkan sebagai featured menu di storefront
            </label>

            <div className="md:col-span-2">
              <ImageDropzone
                label="Menu Image Upload"
                description="Preview tampil sebelum data disimpan. Gambar baru akan masuk ke storage lokal aplikasi."
                initialImage={form.image}
                onChange={setImageFile}
              />
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : editingItem ? "Update Menu" : "Simpan Menu"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(detailItem)} title={detailItem?.name ?? "Detail Menu"} onClose={() => setDetailItem(null)}>
        {detailItem ? (
          <div className="space-y-5">
            <div className="relative h-72 overflow-hidden rounded-[28px]">
              <Image src={detailItem.image} alt={detailItem.name} fill className="object-cover" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Harga</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{formatCurrency(detailItem.price)}</p>
              </div>
              <div className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Kategori</p>
                <p className="mt-2 text-lg font-semibold text-cafe-text">{detailItem.category}</p>
              </div>
            </div>
            <div className="space-y-3 rounded-[24px] bg-[#fbf4ec] p-4">
              <p className="text-sm font-semibold text-cafe-text">Deskripsi</p>
              <p className="text-sm leading-7 text-cafe-accent/78">{detailItem.story}</p>
            </div>
            <div className="space-y-3 rounded-[24px] bg-[#fbf4ec] p-4">
              <p className="text-sm font-semibold text-cafe-text">Ingredient mapping</p>
              <div className="space-y-3">
                {detailItem.recipe.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between rounded-[20px] bg-white/80 px-4 py-3">
                    <div>
                      <p className="font-medium text-cafe-text">{ingredient.ingredientName}</p>
                      <p className="mt-1 text-xs text-cafe-accent/68">Supply ID: {ingredient.supplyId}</p>
                    </div>
                    <Badge tone="slate">{formatQuantity(ingredient.quantity, ingredient.usageUnit)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
