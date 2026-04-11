"use client";

import * as React from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/modal";

type ImageZoomProps = {
  src: string;
  alt: string;
};

export function ImageZoom({ src, alt }: ImageZoomProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative h-32 w-full overflow-hidden rounded-[24px] border border-[#eadfce] shadow-soft"
      >
        <Image src={src} alt={alt} fill className="object-cover transition duration-300 hover:scale-105" />
      </button>
      <Modal open={open} title="Zoom Gambar" onClose={() => setOpen(false)}>
        <div className="relative h-[24rem] overflow-hidden rounded-[24px]">
          <Image src={src} alt={alt} fill className="object-cover" />
        </div>
      </Modal>
    </>
  );
}
