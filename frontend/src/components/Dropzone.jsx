import { useRef, useState } from 'react';

export default function Dropzone({ multiple = true, onFiles, children }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList || []).filter((f) =>
      f.name.toLowerCase().endsWith('.pdf')
    );
    if (arr.length) onFiles(arr);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
        dragging
          ? 'border-brand-500 bg-brand-50'
          : 'border-slate-300 bg-white hover:border-brand-500 hover:bg-slate-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {children}
    </div>
  );
}
