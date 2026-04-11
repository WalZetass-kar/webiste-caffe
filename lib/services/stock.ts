import type { MenuRecord, SupplyRecord, UsageUnit } from "@/lib/models";
import { convertUsageToSupplyUnit } from "@/lib/utils";

export type RequestedOrderItem = {
  menuId: string;
  quantity: number;
};

export type StockDeduction = {
  supply: SupplyRecord;
  quantityInSupplyUnit: number;
  quantityInUsageUnit: number;
  usageUnit: UsageUnit;
};

export function resolveSupplyForBranch(
  supplies: SupplyRecord[],
  branchId: string,
  recipeEntry: MenuRecord["recipe"][number],
) {
  return (
    supplies.find((item) => item.branchId === branchId && item.id === recipeEntry.supplyId) ??
    supplies.find(
      (item) =>
        item.branchId === branchId &&
        item.materialName.toLowerCase() === recipeEntry.ingredientName.toLowerCase(),
    ) ??
    null
  );
}

export function calculateStockDeductions(
  items: RequestedOrderItem[],
  menus: MenuRecord[],
  supplies: SupplyRecord[],
  branchId: string,
) {
  const deductions = new Map<string, StockDeduction>();
  const resolvedItems = items.map((entry) => {
    const menu = menus.find((item) => item.id === entry.menuId);

    if (!menu) {
      throw new Error("Ada menu dalam pesanan yang tidak ditemukan.");
    }

    for (const recipeEntry of menu.recipe) {
      const supply = resolveSupplyForBranch(supplies, branchId, recipeEntry);

      if (!supply) {
        throw new Error(`Bahan "${recipeEntry.ingredientName}" belum tersedia untuk cabang ini.`);
      }

      const quantityInUsageUnit = recipeEntry.quantity * entry.quantity;
      const quantityInSupplyUnit = convertUsageToSupplyUnit(quantityInUsageUnit, recipeEntry.usageUnit, supply.unit);
      const existing = deductions.get(supply.id);

      deductions.set(supply.id, {
        supply,
        quantityInSupplyUnit: Number(((existing?.quantityInSupplyUnit ?? 0) + quantityInSupplyUnit).toFixed(3)),
        quantityInUsageUnit: Number(((existing?.quantityInUsageUnit ?? 0) + quantityInUsageUnit).toFixed(3)),
        usageUnit: recipeEntry.usageUnit,
      });
    }

    return {
      menu,
      quantity: entry.quantity,
    };
  });

  deductions.forEach((deduction) => {
    if (deduction.supply.stockQuantity < deduction.quantityInSupplyUnit) {
      throw new Error(`Stok ${deduction.supply.materialName} tidak cukup untuk pesanan ini.`);
    }
  });

  return {
    deductions,
    resolvedItems,
  };
}

export function applyStockDeductions(
  supplies: SupplyRecord[],
  deductions: Map<string, StockDeduction>,
  now: string,
) {
  return supplies.map((supply) => {
    const deduction = deductions.get(supply.id);

    if (!deduction) {
      return supply;
    }

    return {
      ...supply,
      stockQuantity: Number((supply.stockQuantity - deduction.quantityInSupplyUnit).toFixed(3)),
      updatedAt: now,
    };
  });
}

export function getAutomaticReorderItems(supplies: SupplyRecord[], threshold = 5) {
  return supplies.filter((item) => item.stockQuantity <= Math.max(item.lowStockThreshold, threshold));
}
