import { getAllDesigns } from '@/lib/mdx';
import { DesignCard } from '@/components/common/DesignCard';

export default function DesignsPage() {
  const designs = getAllDesigns();

  return (
    <div className="min-h-screen bg-abyss-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-montserrat font-bold text-abyss-100 mb-4">
            Designs
          </h1>
          <p className="text-xl text-abyss-200 max-w-2xl mx-auto">
            Design systems, visual identities, and interface work across projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {designs.map((design) => (
            <DesignCard key={design.slug} design={design} />
          ))}
        </div>
      </div>
    </div>
  );
}
