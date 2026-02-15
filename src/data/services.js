export const services = [
  {
    slug: 'kitchen-remodeling',
    title: 'Kitchen Remodeling',
    shortDesc: 'Full kitchen design and renovation.',
    description: 'From cabinet refacing to full gut remodels, we handle layout, plumbing, electrical, and finishes so your kitchen matches your vision.',
    icon: '🍳',
  },
  {
    slug: 'bathroom-remodeling',
    title: 'Bathroom Remodeling',
    shortDesc: 'Bathroom design and installation.',
    description: 'Tile work, vanities, showers, tubs, and plumbing. We deliver durable, beautiful bathrooms on schedule.',
    icon: '🚿',
  },
  {
    slug: 'room-additions',
    title: 'Room Additions',
    shortDesc: 'Design and build new space.',
    description: 'Sunrooms, master suites, and general room additions. We manage foundations, framing, roofing, and finishes for seamless integration.',
    icon: '🏠',
  },
  {
    slug: 'deck-and-patios',
    title: 'Decks & Patios',
    shortDesc: 'Outdoor living spaces.',
    description: 'Pressure-treated and composite decks, stone and paver patios, pergolas, and outdoor kitchens.',
    icon: '🪵',
  },
  {
    slug: 'siding-and-roofing',
    title: 'Siding & Roofing',
    shortDesc: 'Exterior protection and curb appeal.',
    description: 'Vinyl, fiber cement, and wood siding. Shingle and metal roofing. Repairs and full replacements.',
    icon: '🏡',
  },
  {
    slug: 'general-contracting',
    title: 'General Contracting',
    shortDesc: 'Full-project coordination.',
    description: 'We coordinate permits, subcontractors, and timelines so your renovation stays on budget and on schedule.',
    icon: '📋',
  },
]

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug) ?? null
}
