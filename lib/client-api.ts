export type UploadBucket = "menus" | "employees" | "assets" | "payments" | "branding";

export async function requestJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Terjadi kesalahan pada server.");
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function uploadImage(file: File, bucket: UploadBucket) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("bucket", bucket);

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Gagal mengunggah gambar.");
  }

  const data = (await response.json()) as { path: string };

  return data.path;
}
