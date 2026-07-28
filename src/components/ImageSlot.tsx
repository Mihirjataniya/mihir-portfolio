import Image from "next/image";

type ImageSlotProps = {
  /** Drop a file in /public and point here to replace the placeholder. */
  src?: string;
  alt: string;
  /** Shown while no image has been pasted in yet. */
  placeholder: string;
  fit?: "cover" | "contain";
  className?: string;
  priority?: boolean;
};

/**
 * Newsprint photo slot: grayscale + high contrast, exactly like a
 * scanned press photo. Falls back to a dashed "paste photo here" box.
 */
export default function ImageSlot({
  src,
  alt,
  placeholder,
  fit = "cover",
  className = "",
  priority = false,
}: ImageSlotProps) {
  if (!src) {
    return (
      <div
        className={`absolute inset-0 grid place-content-center bg-[rgba(20,18,15,0.045)] px-[12px] text-center ${className}`}
        role="img"
        aria-label={placeholder}
      >
        <span className="font-mono text-[calc(10px*var(--ts))] tracking-[0.12em] text-ink-faint uppercase">
          {placeholder}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 600px) 90vw, (max-width: 1080px) 45vw, 340px"
      priority={priority}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} [filter:grayscale(1)_contrast(1.07)] ${className}`}
    />
  );
}
