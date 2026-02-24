'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { renderBadges } from '@/lib/ui-utils';

interface Design {
  slug: string;
  name: string;
  description: string;
  role: string;
  designStack: string[];
  colorPalette: { name: string; hex: string }[];
  url: string;
}

interface DesignCardProps {
  design: Design;
}

const ColorSwatches = ({ palette }: { palette: { name: string; hex: string }[] }) => (
  <div className="flex gap-1.5 mb-4">
    {palette.map((color) => (
      <div
        key={color.name}
        className="w-6 h-6 rounded-full border border-abyss-400/30"
        style={{ backgroundColor: color.hex }}
        title={`${color.name}: ${color.hex}`}
      />
    ))}
  </div>
);

export function DesignCard({ design }: DesignCardProps) {
  return (
    <Card hover="glow" variant="highlight" className="h-full">
      <CardHeader>
        <CardTitle>
          <Link href={design.url} className="abyss-link">
            {design.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-bitcoin-400">{design.role}</p>
      </CardHeader>
      <CardContent>
        <p className="text-abyss-100 mb-4">{design.description}</p>

        <ColorSwatches palette={design.colorPalette} />

        {design.designStack.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-abyss-200 mb-2">Design Stack:</h4>
            <div className="flex flex-wrap gap-2">
              {renderBadges(design.designStack, 'default', 5)}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="default" size="sm" href={design.url}>
          View Case Study
        </Button>
      </CardFooter>
    </Card>
  );
}
