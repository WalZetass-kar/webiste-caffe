import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const invoiceItems = [
  { name: "Es Kopi Susu Aren", qty: 2, price: 28000 },
  { name: "Croissant Butter", qty: 1, price: 24000 },
];

export function Invoice() {
  const total = invoiceItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <Card className="space-y-5 bg-[#fffaf5]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Invoice</p>
          <h3 className="mt-1 text-lg font-semibold text-cafe-text">INV-CAFE-042</h3>
        </div>
        <p className="rounded-full bg-[#f4eadf] px-3 py-1 text-sm text-cafe-accent">Meja 07</p>
      </div>
      <div className="rounded-[26px] border border-[#efe1d1] bg-[#fbf4ec] p-4">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-cafe-accent/65">
          <span>Pesanan</span>
          <span>Dine In</span>
        </div>
        <div className="space-y-3">
        {invoiceItems.map((item) => (
          <div key={item.name} className="flex justify-between text-sm text-cafe-text">
            <span>
              {item.qty}x {item.name}
            </span>
            <span>{formatCurrency(item.qty * item.price)}</span>
          </div>
        ))}
        </div>
      </div>
      <div className="border-t border-[#efe1d1] pt-4">
        <div className="mb-2 flex justify-between text-sm text-cafe-accent/70">
          <span>Service</span>
          <span>{formatCurrency(6000)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-cafe-text">
          <span>Total</span>
          <span>{formatCurrency(total + 6000)}</span>
        </div>
      </div>
    </Card>
  );
}
