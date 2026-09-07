import type { Photo } from "./photos";

type FigureProps = {
  photo: Photo;
  caption?: string;
  /** Loads the image immediately. Use only for above the fold artwork. */
  priority?: boolean;
  /** Responsive sizes hint for the browser. */
  sizes?: string;
  /** Wrapper classes, e.g. column span or aspect ratio. */
  className?: string;
  /** Frame classes, e.g. aspect-[4/5]. */
  frameClassName?: string;
};

export function Figure({
  photo,
  caption,
  priority = false,
  sizes = "(min-width: 1024px) 32rem, 100vw",
  className,
  frameClassName,
}: FigureProps) {
  return (
    <figure className={className}>
      <div
        className={[
          "overflow-hidden rounded-lg border border-rule bg-secondary/60",
          frameClassName ?? "",
        ].join(" ")}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          className="h-full w-full object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="chapter-label mt-2.5 block leading-relaxed normal-case tracking-[0.14em]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
