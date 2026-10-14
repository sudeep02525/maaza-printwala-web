// Real Catalogue Filter Groups and Matchers
export const FILTER_GROUPS = [
  {
    id: 'availability',
    name: 'Availability',
    defaultOpen: true,
    options: [
      { id: 'in-stock', label: 'In Stock' },
      { id: 'featured', label: 'Best Sellers' },
    ],
  },
  {
    id: 'price',
    name: 'Price',
    defaultOpen: true,
    options: [
      { id: 'under-250', label: 'Under ₹250' },
      { id: '250-500', label: '₹250 - ₹500' },
      { id: '500-1000', label: '₹500 - ₹1,000' },
      { id: 'above-1000', label: 'Above ₹1,000' },
    ],
  },
  {
    id: 'finish',
    name: 'Finish & Lamination',
    defaultOpen: true,
    options: [
      { id: 'matte', label: 'Matte Finish' },
      { id: 'glossy', label: 'Glossy Finish' },
      { id: 'spot-uv', label: 'Spot UV Accent' },
      { id: 'foil', label: 'Foil / Metallic' },
      { id: 'velvet', label: 'Velvet Touch' },
    ],
  },
  {
    id: 'material',
    name: 'Material & Stock',
    defaultOpen: true,
    options: [
      { id: 'cardstock', label: 'Premium Cardstock' },
      { id: 'cotton', label: '100% Combed Cotton' },
      { id: 'flex', label: 'Heavy Duty Flex Vinyl' },
      { id: 'bond', label: 'Executive Bond Paper' },
      { id: 'kraft', label: 'Kraft & Corrugated' },
      { id: 'pvc', label: 'Rigid PVC / Translucent' },
      { id: 'ceramic', label: 'Grade-A Ceramic' },
    ],
  },
  {
    id: 'size',
    name: 'Size & Shape',
    defaultOpen: false,
    options: [
      { id: 'standard-card', label: 'Standard (89 × 51 mm)' },
      { id: 'classic-card', label: 'Classic (90 × 54 mm)' },
      { id: 'rounded', label: 'Rounded Corners' },
      { id: 'square', label: 'Square' },
      { id: 'a4-a5', label: 'A4 / A5 Standard' },
      { id: 'apparel-sizes', label: 'Apparel (S-XXL)' },
    ],
  },
];

// Helper: Extract or build a normalized attribute map from a product
export function getProductAttributeMap(p) {
  if (p?.attributeMap && typeof p.attributeMap === 'object' && Object.keys(p.attributeMap).length > 0) {
    return p.attributeMap;
  }
  const map = {};
  if (Array.isArray(p?.attributes)) {
    for (const attr of p.attributes) {
      const key = attr.key || attr.name;
      if (key) {
        map[key] = (attr.options || []).map((o) => (typeof o === 'string' ? o : o.label || o.value || ''));
      }
    }
  }
  return map;
}

// Helper: Check whether a product satisfies a single filter option
export function checkProductFilterMatch(p, groupId, optionId) {
  if (!p) return false;
  const attrMap = getProductAttributeMap(p);

  if (groupId === 'availability') {
    if (optionId === 'in-stock') return p.status === 'ACTIVE' || p.isActive !== false;
    if (optionId === 'featured') return Boolean(p.isFeatured || p.featured);
  }

  if (groupId === 'price') {
    const price = Number(p.basePrice) || 0;
    if (optionId === 'under-250') return price < 250;
    if (optionId === '250-500') return price >= 250 && price <= 500;
    if (optionId === '500-1000') return price >= 500 && price <= 1000;
    if (optionId === 'above-1000') return price > 1000;
  }

  if (groupId === 'finish') {
    const finishValues = [
      ...(attrMap.finish || []),
      p.name || '',
      p.shortDescription || '',
    ].join(' ').toLowerCase();

    if (optionId === 'matte') return finishValues.includes('matte');
    if (optionId === 'glossy') return finishValues.includes('gloss') || finishValues.includes('mirror');
    if (optionId === 'spot-uv') return finishValues.includes('spot') || finishValues.includes('uv');
    if (optionId === 'foil') return finishValues.includes('foil') || finishValues.includes('metallic') || finishValues.includes('gold') || finishValues.includes('pearl') || finishValues.includes('shimmer') || finishValues.includes('diamond');
    if (optionId === 'velvet') return finishValues.includes('velvet') || finishValues.includes('soft');
  }

  if (groupId === 'material') {
    const materialValues = [
      ...(attrMap.material || []),
      ...(attrMap.paper || []),
      ...(attrMap.paperType || []),
      ...(attrMap.filmType || []),
      p.name || '',
      p.shortDescription || '',
    ].join(' ').toLowerCase();

    if (optionId === 'cardstock') return materialValues.includes('cardstock') || materialValues.includes('card') || materialValues.includes('gsm');
    if (optionId === 'cotton') return materialValues.includes('cotton') || materialValues.includes('shirt') || materialValues.includes('polo');
    if (optionId === 'flex') return materialValues.includes('flex') || materialValues.includes('banner') || materialValues.includes('standee');
    if (optionId === 'bond') return materialValues.includes('bond') || materialValues.includes('royal') || materialValues.includes('letterhead');
    if (optionId === 'kraft') return materialValues.includes('kraft') || materialValues.includes('corrugated') || materialValues.includes('box');
    if (optionId === 'pvc') return materialValues.includes('pvc') || materialValues.includes('transparent') || materialValues.includes('non-tearable');
    if (optionId === 'ceramic') return materialValues.includes('ceramic') || materialValues.includes('mug') || materialValues.includes('kit');
  }

  if (groupId === 'size') {
    const sizeValues = [
      ...(attrMap.size || []),
      p.name || '',
      p.shortDescription || '',
    ].join(' ').toLowerCase();

    if (optionId === 'standard-card') return sizeValues.includes('89') || sizeValues.includes('standard');
    if (optionId === 'classic-card') return sizeValues.includes('90') || sizeValues.includes('classic');
    if (optionId === 'rounded') return sizeValues.includes('rounded');
    if (optionId === 'square') return sizeValues.includes('square');
    if (optionId === 'a4-a5') return sizeValues.includes('a4') || sizeValues.includes('a5');
    if (optionId === 'apparel-sizes') return sizeValues.includes('small') || sizeValues.includes('medium') || sizeValues.includes('large') || sizeValues.includes('xl');
  }

  return false;
}

// Helper: Get human-readable label for active filter pill
export function getFilterLabel(groupId, optionId) {
  const g = FILTER_GROUPS.find((groupObj) => groupObj.id === groupId);
  if (!g) return optionId;
  const opt = g.options.find((o) => o.id === optionId);
  return opt ? opt.label : optionId;
}
