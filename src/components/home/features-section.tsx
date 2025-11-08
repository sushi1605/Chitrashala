// components/home/features-section.tsx
import React from 'react';
import { Grid } from 'lucide-react';
import type { FeatureItem } from '~/types';

interface FeaturesSectionProps {
  features: FeatureItem[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <div className="bg-muted py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Bring your favorite ideas to life
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-card p-6 shadow-lg transition-all hover:scale-105"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
