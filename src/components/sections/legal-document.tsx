import type { LegalDocument as LegalDocumentType } from "@/types/content";

// Pending values stay visible so that nobody can miss them before launch.
function withPlaceholders(text: string) {
  return text.split(/(\[Pendiente:[^\]]*\])/g).map((part, index) =>
    part.startsWith("[Pendiente:") ? <mark key={index}>{part}</mark> : part,
  );
}

export function LegalDocument({ document }: { document: LegalDocumentType }) {
  return (
    <article className="container-site pt-40 pb-24 sm:pt-48">
      <div className="prose-legal mx-auto max-w-3xl">
        <h1 className="mb-6 text-[length:var(--text-title)]">{document.title}</h1>
        <p className="text-lg">{withPlaceholders(document.intro)}</p>
        {document.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{withPlaceholders(paragraph)}</p>)}
            {section.items ? (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{withPlaceholders(item)}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
