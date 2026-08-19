import Image from "next/image";
import type { ArticleBlock } from "@/lib/types";
import { getImage, IMAGE_BLUR } from "@/data/images";

/**
 * Renders the structured article body.
 *
 * Headings are h2 so screen-reader users can navigate an article — the flat
 * paragraph model gave them no landmarks at all inside the body.
 */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <article className="space-y-7">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                id={`s-${i}`}
                className="scroll-mt-32 pt-4 text-heading-lg text-white"
              >
                {block.text}
              </h2>
            );

          case "paragraph":
            return (
              <p key={i} className="text-body-lg text-steel-300">
                {block.text}
              </p>
            );

          case "list":
            return block.ordered ? (
              <ol key={i} className="list-decimal space-y-2.5 pl-6 text-body-lg text-steel-300 marker:text-steel-400">
                {block.items.map((item) => (
                  <li key={item} className="pl-2">{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="space-y-2.5 text-body-lg text-steel-300">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3.5">
                    <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-accent-bright" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "table":
            return (
              <div
                key={i}
                // Keyboard-reachable so a scrolling table is operable without
                // a pointer.
                tabIndex={0}
                role="group"
                aria-label={block.caption}
                className="-mx-6 overflow-x-auto px-6 focus-visible:outline-2 md:mx-0 md:px-0"
              >
                <table className="w-full min-w-[520px] border-collapse text-body-sm">
                  <caption className="pb-3 text-left text-caption text-steel-300">
                    {block.caption}
                  </caption>
                  <thead>
                    <tr>
                      {block.head.map((h) => (
                        <th key={h} scope="col" className="border-b border-white/12 px-3 py-2.5 text-left tech-label-xs text-steel-300">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r} className={r % 2 === 0 ? "bg-white/3" : undefined}>
                        {row.map((cell, c) => (
                          <td key={c} className="px-3 py-2.5 text-steel-200">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "callout":
            return (
              <aside
                key={i}
                className={`border-l-2 py-1 pl-6 text-body-md ${
                  block.tone === "caution"
                    ? "border-amber-400/70 text-steel-200"
                    : "border-accent-bright text-steel-200"
                }`}
              >
                {block.text}
              </aside>
            );

          case "figure": {
            const image = getImage(block.imageKey);
            return (
              <figure key={i} className="space-y-3">
                <div className="photo-scrim relative aspect-16/9 overflow-hidden bg-surface-card">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR}
                  />
                </div>
                <figcaption className="text-caption text-steel-300">
                  {block.caption || image.caption}
                </figcaption>
              </figure>
            );
          }

          default:
            return null;
        }
      })}
    </article>
  );
}
