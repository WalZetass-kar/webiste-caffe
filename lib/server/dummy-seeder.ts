import "server-only";

import { appendRealtimeEvent } from "@/lib/server/realtime-events-store";
import { getBranchItems } from "@/lib/server/branch-store";
import { createEmployeeItem, createMenuItem, createOrder } from "@/lib/server/data-store";
import type { EmployeePayload, MenuPayload, OrderPayload } from "@/lib/models";

const dummyMenuTemplates: Omit<MenuPayload, "name">[] = [
  {
    category: "Coffee",
    price: 32000,
    description: "Latte madu dengan profil rasa floral untuk testing data operasional.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80",
    stock: 25,
    status: "Promo",
    story: "Seasonal coffee blend untuk simulasi batch data admin.",
    rating: 4.8,
    prepTime: "6 min",
    pairing: "Butter croissant",
    ingredients: ["Coffee Beans", "Fresh Milk", "Honey"],
    recipe: [],
    featured: false,
  },
  {
    category: "Food",
    price: 38000,
    description: "Sandwich hangat dengan roast chicken dan sayur segar untuk demo menu.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
    stock: 18,
    status: "Aktif",
    story: "Comfort food yang aman dipakai untuk dummy order.",
    rating: 4.7,
    prepTime: "9 min",
    pairing: "Iced americano",
    ingredients: ["Chicken", "Bread", "Lettuce"],
    recipe: [],
    featured: false,
  },
  {
    category: "Dessert",
    price: 28000,
    description: "Cheesecake vanila ringan untuk melengkapi data dummy frontend dan dashboard.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1400&q=80",
    stock: 15,
    status: "Spesial",
    story: "Dessert batch simulasi untuk uji laporan dan order history.",
    rating: 4.9,
    prepTime: "4 min",
    pairing: "House latte",
    ingredients: ["Cream Cheese", "Butter", "Sugar"],
    recipe: [],
    featured: false,
  },
];

export async function syncDummyData() {
  const branches = await getBranchItems();
  const batchLabel = new Date()
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replaceAll(".", "")
    .replaceAll("T", "")
    .replaceAll("Z", "")
    .slice(0, 12);

  const createdMenus = [];

  for (const [index, template] of dummyMenuTemplates.entries()) {
    const menu = await createMenuItem({
      ...template,
      name: `${["Honey Latte", "Club Sandwich", "Vanilla Cheesecake"][index]} ${batchLabel}`,
    });

    createdMenus.push(menu);
  }

  const employeeTemplates: EmployeePayload[] = branches.slice(0, 2).map((branch, index) => ({
    branchId: branch.id,
    employeeName: `${index === 0 ? "Andi" : "Salsa"} Dummy ${batchLabel.slice(-4)}`,
    position: index === 0 ? "Cashier" : "Barista",
    phoneNumber: `08123${batchLabel.slice(-6 + index)}`.slice(0, 11),
    email: `dummy-${branch.id}-${batchLabel.slice(-4)}@cafeflow.id`,
    photo:
      index === 0
        ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  }));

  const createdEmployees = [];

  for (const payload of employeeTemplates) {
    createdEmployees.push(await createEmployeeItem(payload));
  }

  const createdOrders = [];

  for (const [index, branch] of branches.slice(0, Math.min(branches.length, createdMenus.length)).entries()) {
    const orderPayload: OrderPayload = {
      branchId: branch.id,
      customerName: `Customer Dummy ${index + 1}`,
      tableNumber: `Test-${index + 1}`,
      paymentMethod: index % 2 === 0 ? "Cash" : "QRIS",
      notes: `Seed batch ${batchLabel}`,
      items: [
        {
          menuId: createdMenus[index].id,
          quantity: 1,
        },
      ],
    };

    createdOrders.push(await createOrder(orderPayload));
  }

  await appendRealtimeEvent({
    type: "system",
    tone: "success",
    title: "Dummy data berhasil disinkronkan",
    message: `${createdMenus.length} menu, ${createdEmployees.length} staff, dan ${createdOrders.length} order baru ditambahkan.`,
    href: "/dashboard",
  });

  return {
    menus: createdMenus.length,
    employees: createdEmployees.length,
    orders: createdOrders.length,
    batchLabel,
  };
}
