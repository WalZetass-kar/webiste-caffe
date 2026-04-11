"use client";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type QuillEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function QuillEditor({ value, onChange }: QuillEditorProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#eadfce] bg-[#fffaf5]">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
}
