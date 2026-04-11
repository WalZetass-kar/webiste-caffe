import { Card } from "@/components/ui/card";

export function RecaptchaField() {
  return (
    <Card className="flex items-center justify-between gap-4 bg-[#fffaf5] p-4">
      <div>
        <p className="text-sm font-semibold text-cafe-text">ReCAPTCHA Placeholder</p>
        <p className="text-xs text-cafe-accent/72">
          Slot integrasi front-end untuk provider captcha saat backend siap.
        </p>
      </div>
      <div className="rounded-2xl border border-[#eadfce] bg-[#fbf4ec] px-4 py-3 text-xs text-cafe-accent/72">
        I&apos;m not a robot
      </div>
    </Card>
  );
}
