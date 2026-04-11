import { CafeSettingsManagement } from "@/components/management/cafe-settings-management";
import { PaymentSettingsManagement } from "@/components/management/payment-settings-management";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/sections/page-header";
import { FileUpload } from "@/components/ui/file-upload";
import { RecaptchaField } from "@/components/ui/recaptcha-field";
import { getPaymentSettings } from "@/lib/server/payment-settings-store";
import { getCafeSettings } from "@/lib/server/settings-store";

export const dynamic = "force-dynamic";

export default async function IdentitasPage() {
  const [paymentSettings, cafeSettings] = await Promise.all([getPaymentSettings(), getCafeSettings()]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Identitas Cafe"
          title="Dokumen legal, profil usaha, dan pengaturan pembayaran"
          description="Siapkan dokumen administratif cafe sekaligus atur QRIS, rekening transfer, dan instruksi pembayaran yang akan tampil ke pelanggan saat checkout."
        />
        <div className="grid gap-6 xl:grid-cols-2">
          <FileUpload label="Upload Dokumen NIB" accept=".pdf,.jpg,.png" />
          <FileUpload label="Upload Dokumen NPWP" accept=".pdf,.jpg,.png" />
        </div>
        <CafeSettingsManagement initialSettings={cafeSettings} />
        <PaymentSettingsManagement initialSettings={paymentSettings} />
        <RecaptchaField />
      </div>
    </AppShell>
  );
}
