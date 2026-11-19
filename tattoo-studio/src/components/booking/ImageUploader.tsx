"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { UPLOAD_LIMITS } from "@/config/booking";
import { formatBytes } from "@/lib/booking/files";
import { prepareImage } from "@/lib/booking/compress";
import { CloseIcon, PlusIcon } from "@/components/ui/Icons";

export interface UploadedImage {
  id: string;
  name: string;
  status: "processing" | "ready";
  blob?: Blob;
  url?: string;
}

const ACCEPTED = new Set<string>(UPLOAD_LIMITS.acceptedTypes);
const EXT_RE = /\.(jpe?g|png|webp)$/i;

export function ImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (update: (current: UploadedImage[]) => UploadedImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const urls = useRef(new Set<string>());

  // Zwolnij podglądy przy opuszczeniu kreatora.
  useEffect(() => {
    const created = urls.current;
    return () => created.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function addFiles(list: FileList | File[]) {
    const files = Array.from(list);
    const problems: string[] = [];
    const slots = UPLOAD_LIMITS.maxFiles - images.length;
    const accepted: File[] = [];

    for (const file of files) {
      if (!ACCEPTED.has(file.type) && !EXT_RE.test(file.name)) {
        problems.push(`${file.name}: only JPG, JPEG, PNG and WEBP images are accepted.`);
      } else if (file.size > UPLOAD_LIMITS.maxSourceBytes) {
        problems.push(`${file.name}: the file is larger than ${formatBytes(UPLOAD_LIMITS.maxSourceBytes)}.`);
      } else if (accepted.length >= slots) {
        problems.push(`${file.name}: you can add up to ${UPLOAD_LIMITS.maxFiles} images.`);
      } else {
        accepted.push(file);
      }
    }
    setMessages(problems);

    for (const file of accepted) {
      const id = crypto.randomUUID();
      onChange((current) => [...current, { id, name: file.name, status: "processing" }]);
      prepareImage(file).then(
        (blob) => {
          const url = URL.createObjectURL(blob);
          urls.current.add(url);
          onChange((current) => current.map((img) => (img.id === id ? { ...img, status: "ready", blob, url } : img)));
        },
        () => {
          onChange((current) => current.filter((img) => img.id !== id));
          setMessages((m) => [...m, `${file.name}: this image couldn't be read. Try saving it as JPG or PNG.`]);
        },
      );
    }
  }

  function remove(image: UploadedImage) {
    onChange((current) => current.filter((img) => img.id !== image.id));
    // Zwalniamy podgląd dopiero po usunięciu miniatury z ekranu.
    if (image.url) {
      const url = image.url;
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
        urls.current.delete(url);
      }, 1000);
    }
    setMessages([`${image.name} removed.`]);
  }

  const full = images.length >= UPLOAD_LIMITS.maxFiles;

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!full) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={full ? (event) => event.preventDefault() : onDrop}
        className={`relative flex flex-col items-center justify-center gap-4 rounded-[2px] border border-dashed px-6 py-12 text-center transition-colors duration-200 ${
          dragging ? "border-sumi bg-kinari/60" : "border-sumi/35 bg-washi/60"
        } ${full ? "opacity-60" : ""}`}
      >
        <span className="font-mincho text-4xl text-sumi/40" aria-hidden="true">
          写
        </span>
        <p className="font-mincho text-lg">{full ? "Image limit reached" : "Drag images here"}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={full}
          className="btn btn-ink min-h-12"
          aria-describedby="upload-rules"
        >
          <PlusIcon className="h-4 w-4" />
          Choose images
        </button>
        <p id="upload-rules" className="max-w-[26rem] font-gothic text-xs leading-relaxed text-nezumi">
          JPG, JPEG, PNG or WEBP. Up to {UPLOAD_LIMITS.maxFiles} images, {formatBytes(UPLOAD_LIMITS.maxSourceBytes)} each. Images are
          resized and stripped of location data before sending.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={UPLOAD_LIMITS.acceptAttribute}
          className="hidden"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      <div aria-live="polite" className="mt-3 space-y-1">
        {messages.map((message, i) => (
          <p key={i} className="font-gothic text-sm text-nezumi">
            {message}
          </p>
        ))}
      </div>

      {images.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Attached images">
          {images.map((image, index) => (
            <li key={image.id} className="relative">
              <div className="relative aspect-square overflow-hidden bg-washi-2">
                {image.url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- lokalny podgląd (blob:), bez optymalizacji
                  <img src={image.url} alt={`Reference image ${index + 1}: ${image.name}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-gothic text-xs text-nezumi" role="status">
                    Preparing…
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="truncate font-gothic text-xs text-nezumi" title={image.name}>
                  {image.name}
                  {image.blob && <span className="ml-1 tabular-nums">({formatBytes(image.blob.size)})</span>}
                </p>
                <button
                  type="button"
                  onClick={() => remove(image)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-sumi/20 hover:border-sumi"
                  aria-label={`Remove ${image.name}`}
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
