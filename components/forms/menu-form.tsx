"use client";
"use no memo";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CalendarInput } from "@/components/ui/calendar-input";
import { Card } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { QuillEditor } from "@/components/ui/quill-editor";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const menuSchema = z.object({
  name: z.string().min(3, "Nama menu minimal 3 karakter"),
  category: z.string().min(2, "Kategori wajib diisi"),
  stock: z.number().min(0),
  price: z.number().min(1000),
  status: z.enum(["aktif", "promo", "spesial"]),
  notes: z.string().min(10, "Catatan minimal 10 karakter"),
});

type MenuFormValues = z.infer<typeof menuSchema>;

export function MenuForm() {
  const [price, setPrice] = React.useState(28000);
  const [publishDate, setPublishDate] = React.useState<Date[]>([]);
  const [description, setDescription] = React.useState("<p>Deskripsi menu spesial...</p>");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: "Es Kopi Susu Pandan",
      category: "Signature",
      stock: 24,
      price,
      status: "aktif",
      notes: "Gunakan biji house blend dengan garnish pandan foam.",
    },
  });

  React.useEffect(() => {
    setValue("price", price);
  }, [price, setValue]);

  return (
    <Card className="space-y-6 bg-[#fffaf5]">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Form Menu</p>
        <h2 className="mt-2 text-2xl font-semibold text-cafe-text">Tambah Menu Baru</h2>
      </div>
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={handleSubmit((values) => {
          // Template frontend only, submit handled locally.
          console.log({ ...values, publishDate, description });
        })}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-cafe-text">Nama Menu</label>
          <Input {...register("name")} />
          {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-cafe-text">Kategori</label>
          <Input {...register("category")} />
          {errors.category && <p className="text-xs text-rose-600">{errors.category.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-cafe-text">Harga</label>
          <CurrencyInput value={price} onChange={setPrice} />
          {errors.price && <p className="text-xs text-rose-600">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-cafe-text">Stok</label>
          <Input
            type="number"
            {...register("stock", {
              valueAsNumber: true,
            })}
          />
          {errors.stock && <p className="text-xs text-rose-600">{errors.stock.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-cafe-text">Status Menu</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name={field.name}
                value={field.value}
                onChange={(value) => field.onChange(value as MenuFormValues["status"])}
                options={[
                  { label: "Aktif", value: "aktif" },
                  { label: "Promo", value: "promo" },
                  { label: "Spesial", value: "spesial" },
                ]}
              />
            )}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-cafe-text">Jadwal Tayang</label>
          <CalendarInput value={publishDate} onChange={setPublishDate} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-cafe-text">Catatan Produksi</label>
          <Textarea {...register("notes")} />
          {errors.notes && <p className="text-xs text-rose-600">{errors.notes.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-cafe-text">Deskripsi Editor</label>
          <QuillEditor value={description} onChange={setDescription} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" className="w-full sm:w-auto">
            Simpan Draft Menu
          </Button>
        </div>
      </form>
    </Card>
  );
}
