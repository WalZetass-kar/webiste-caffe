import { NextResponse } from "next/server";
import { getMenuItems, getSupplyItems, getEmployeeItems, getAssetItems, getOrders, getRatings, getStockHistory } from "@/lib/server/data-store";
import { getAuditLogs } from "@/lib/server/audit-log-store";
import {
  exportMenusToCSV,
  exportSuppliesToCSV,
  exportEmployeesToCSV,
  exportAssetsToCSV,
  exportOrdersToCSV,
  exportRatingsToCSV,
  exportStockHistoryToCSV,
  exportAuditLogsToCSV,
  generateExportFilename,
} from "@/lib/server/export-service";
import { createAuditLog } from "@/lib/server/audit-log-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get("entity");
    const format = searchParams.get("format") || "csv";
    
    // Audit user info (should come from auth session in production)
    const userId = searchParams.get("userId") || "system";
    const userName = searchParams.get("userName") || "System";
    const userRole = searchParams.get("userRole") || "owner";

    if (!entity) {
      return NextResponse.json({ error: "Parameter 'entity' wajib diisi" }, { status: 400 });
    }

    if (format !== "csv") {
      return NextResponse.json({ error: "Hanya format CSV yang didukung saat ini" }, { status: 400 });
    }

    let csvContent: string;
    let filename: string;

    switch (entity) {
      case "menus": {
        const menus = await getMenuItems();
        csvContent = exportMenusToCSV(menus);
        filename = generateExportFilename("menus", "csv");
        break;
      }

      case "supplies": {
        const supplies = await getSupplyItems();
        csvContent = exportSuppliesToCSV(supplies);
        filename = generateExportFilename("supplies", "csv");
        break;
      }

      case "employees": {
        const employees = await getEmployeeItems();
        csvContent = exportEmployeesToCSV(employees);
        filename = generateExportFilename("employees", "csv");
        break;
      }

      case "assets": {
        const assets = await getAssetItems();
        csvContent = exportAssetsToCSV(assets);
        filename = generateExportFilename("assets", "csv");
        break;
      }

      case "orders": {
        const orders = await getOrders();
        csvContent = exportOrdersToCSV(orders);
        filename = generateExportFilename("orders", "csv");
        break;
      }

      case "ratings": {
        const ratings = await getRatings();
        csvContent = exportRatingsToCSV(ratings);
        filename = generateExportFilename("ratings", "csv");
        break;
      }

      case "stock-history": {
        const history = await getStockHistory();
        csvContent = exportStockHistoryToCSV(history);
        filename = generateExportFilename("stock-history", "csv");
        break;
      }

      case "audit-logs": {
        const logs = await getAuditLogs();
        csvContent = exportAuditLogsToCSV(logs);
        filename = generateExportFilename("audit-logs", "csv");
        break;
      }

      default:
        return NextResponse.json({ error: `Entity '${entity}' tidak dikenali` }, { status: 400 });
    }

    // Log the export action
    await createAuditLog({
      userId,
      userName,
      userRole,
      action: "export",
      entity: entity as any,
      entityName: `Export ${entity} to CSV`,
    });

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengekspor data.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
