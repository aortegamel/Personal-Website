import { getAllDesigns, getDesignBySlug } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const ComponentShowcase = dynamic(() => import('@/components/sonar/ComponentShowcase'), {
  ssr: false,
});

export default function DesignPage({ params }: { params: { slug: string } }) {
  const design = getDesignBySlug(params.slug);

  if (!design) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-deepSea-abyss">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-96 -right-96 w-[768px] h-[768px] bg-bitcoin-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-96 -left-96 w-[768px] h-[768px] bg-abyss-500/5 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <article className="space-y-12">
          {/* Header */}
          <header className="text-center space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold abyss-gradient-text mb-4">
              {design.name}
            </h1>
            <p className="text-lg text-bitcoin-400">{design.role}</p>

            <div className="flex flex-wrap gap-2 justify-center">
              {design.designStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="bitcoin"
                  className="text-sm font-semibold px-4 py-1.5 hover:scale-110 transition-transform"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              {design.github && (
                <Button href={design.github} external variant="bitcoin" size="lg" className="group">
                  <FaGithub className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  View on GitHub
                </Button>
              )}
              {design.projectUrl && (
                <Button href={design.projectUrl} external variant="outline" size="lg" className="group">
                  <FaExternalLinkAlt className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  Live Project
                </Button>
              )}
            </div>
          </header>

          {/* Color Palette */}
          <section className="bg-deepSea-deep/50 backdrop-blur-sm rounded-xl p-8 border border-abyss-400/20 shadow-2xl">
            <h2 className="text-2xl font-montserrat font-bold text-abyss-100 mb-6">Color Palette</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {design.colorPalette.map((color) => (
                <div key={color.name} className="text-center">
                  <div
                    className="w-full aspect-square rounded-lg border border-abyss-400/20 mb-2"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-sm font-medium text-abyss-100">{color.name}</p>
                  <p className="text-xs text-abyss-300 font-mono">{color.hex}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Design Elements & Highlights */}
          <div className="bg-deepSea-deep/50 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-abyss-400/20 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-montserrat font-bold text-abyss-100 mb-4">Design Elements</h2>
                <ul className="space-y-2 text-abyss-300">
                  {design.designElements.map((element) => (
                    <li key={element} className="flex items-start">
                      <span className="text-bitcoin-400 mr-2">--</span>
                      <span>{element}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-montserrat font-bold text-abyss-100 mb-4">Highlights</h2>
                <ul className="space-y-2 text-abyss-300">
                  {design.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start">
                      <span className="text-bitcoin-400 mr-2">--</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Component Showcase (Sonar only) */}
          {design.slug === 'sonar' && <ComponentShowcase />}

          {/* Markdown Content */}
          <div className="bg-deepSea-deep/50 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-abyss-400/20 shadow-2xl animate-fade-in">
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-abyss-100 text-xl leading-relaxed">
                {design.description}
              </p>
              <div
                className="mt-8 text-abyss-200 leading-relaxed [&_h2]:text-2xl [&_h2]:font-montserrat [&_h2]:font-bold [&_h2]:text-abyss-100 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-montserrat [&_h3]:font-bold [&_h3]:text-abyss-100 [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_strong]:text-abyss-100 [&_code]:text-bitcoin-400 [&_code]:bg-deepSea-abyss/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded"
                dangerouslySetInnerHTML={{
                  __html: design.content
                    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/`([^`]+)`/g, '<code>$1</code>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/^(?!<[hp])(.+)$/gm, '<p>$1</p>')
                }}
              />
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Button href="/designs" variant="ghost" size="lg">
              ← Back to All Designs
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const designs = getAllDesigns();
  return designs.map(design => ({ slug: design.slug }));
}
