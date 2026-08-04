export const categoryData = {
  'business-printing': {
    name: 'Visiting Cards',
    slug: 'business-printing',
    banner: '/images/banner_business_cards.png',
    description: 'Professional visiting cards to make a lasting impression.',
    seoContent: `
      <h2>Premium Visiting Cards</h2>
      <p>Elevate your corporate identity with our comprehensive range of business cards.</p>
    `,
    faqs: [
      { question: "What is the standard size for a visiting card?", answer: "The standard visiting card size in India is 89mm x 51mm, though we offer custom sizes and die-cut shapes." }
    ],
    subcategories: [
      { name: 'Standard Cards', group: 'Cards', slug: 'standard-cards', image: '/images/subcategories/visiting_cards.png', count: 12 },
      { name: 'Premium Cards', group: 'Cards', slug: 'premium-cards', image: '/images/subcategories/visiting_cards.png', count: 5 }
    ]
  },
  'stationery': {
    name: 'Stationery',
    slug: 'stationery',
    banner: '/images/banner_business_cards.png',
    description: 'Custom stationery items for your office and personal needs.',
    seoContent: `
      <h2>Office & Personal Stationery</h2>
      <p>From letterheads and envelopes to custom notebooks, we provide high-quality stationery.</p>
    `,
    faqs: [
      { question: "Can I customize the letterheads with my company logo?", answer: "Yes, you can upload your design or use our templates to add your logo and details." }
    ],
    subcategories: [
      { name: 'Letterheads', group: 'Office', slug: 'letterheads', image: '/images/subcategories/letterheads.png', count: 10 },
      { name: 'Envelopes', group: 'Office', slug: 'envelopes', image: '/images/subcategories/envelopes.png', count: 8 },
      { name: 'Notebooks', group: 'Personal', slug: 'notebooks', image: '/images/subcategories/notepads.png', count: 15 }
    ]
  },
  'flyers-brochures': {
    name: 'Flyers & Brochures',
    slug: 'flyers-brochures',
    banner: '/images/banner_business_cards.png',
    description: 'Promotional materials to help your business stand out.',
    seoContent: `
      <h2>Professional Flyers & Brochures</h2>
      <p>Market your business effectively with our custom printed flyers and brochures in various folds and finishes.</p>
    `,
    faqs: [
      { question: "What paper weights do you offer for brochures?", answer: "We offer various paper weights ranging from standard 130gsm to premium 300gsm cardstock." }
    ],
    subcategories: [
      { name: 'Flyers', group: 'Marketing', slug: 'flyers', image: '/images/subcategories/flyers.png', count: 8 },
      { name: 'Bi-Fold Brochures', group: 'Marketing', slug: 'bi-fold-brochures', image: '/images/subcategories/brochures.png', count: 15 },
      { name: 'Tri-Fold Brochures', group: 'Marketing', slug: 'tri-fold-brochures', image: '/images/subcategories/brochures.png', count: 10 }
    ]
  },
  'packaging': {
    name: 'Packaging',
    slug: 'packaging',
    banner: '/images/banner_packaging.png',
    description: 'Custom packaging solutions to protect your products and promote your brand.',
    seoContent: `
      <h2>Custom Branded Packaging</h2>
      <p>Your product's packaging is the first physical interaction a customer has with your brand. Make it count with our premium custom packaging solutions.</p>
    `,
    faqs: [
      { question: "What is the minimum order quantity (MOQ) for custom printed boxes?", answer: "Our standard MOQ for custom shipping boxes is 50 units." }
    ],
    subcategories: [
      { name: 'Paper Bags', group: 'Bags', slug: 'paper-bags', image: 'https://images.unsplash.com/photo-1550171633-9f8fc3227d8f?auto=format&fit=crop&w=400&q=80', count: 14 },
      { name: 'Gift Boxes', group: 'Boxes', slug: 'gift-boxes', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80', count: 8 },
      { name: 'Shipping Boxes', group: 'Boxes', slug: 'shipping-boxes', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=400&q=80', count: 11 }
    ]
  },
  'labels-stickers': {
    name: 'Labels & Stickers',
    slug: 'labels-stickers',
    banner: '/images/banner_business_cards.png',
    description: 'Custom labels and stickers for all your packaging and branding needs.',
    seoContent: `
      <h2>Custom Labels & Stickers</h2>
      <p>Enhance your product packaging and brand visibility with our high-quality custom labels and stickers.</p>
    `,
    faqs: [
      { question: "Are the stickers waterproof?", answer: "Yes, we offer waterproof vinyl stickers that are perfect for outdoor use or products exposed to moisture." }
    ],
    subcategories: [
      { name: 'Die-Cut Stickers', group: 'Stickers', slug: 'die-cut-stickers', image: 'https://images.unsplash.com/photo-1605371924599-2d0365da26f5?auto=format&fit=crop&w=400&q=80', count: 12 },
      { name: 'Product Labels', group: 'Labels', slug: 'product-labels', image: 'https://images.unsplash.com/photo-1582214309485-667746401062?auto=format&fit=crop&w=400&q=80', count: 15 }
    ]
  },
  'signage-banners': {
    name: 'Signage & Banners',
    slug: 'signage-banners',
    banner: '/images/outdoor_banner.png',
    description: 'High-impact indoor and outdoor signage, banners, and boards to capture attention.',
    seoContent: `
      <h2>Large Format Signage & Displays</h2>
      <p>Stand out at trade shows, storefronts, and events with our high-impact large format signage.</p>
    `,
    faqs: [
      { question: "What is the difference between flex and vinyl printing?", answer: "Flex is a flexible, durable material typically used for outdoor banners. Vinyl is an adhesive-backed material." }
    ],
    subcategories: [
      { name: 'Flex Banners', group: 'Outdoor', slug: 'flex-banners', image: 'https://images.unsplash.com/photo-1563242636-67a637d77b63?auto=format&fit=crop&w=400&q=80', count: 10 },
      { name: 'Roll Up Standees', group: 'Displays', slug: 'roll-up-standees', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80', count: 5 }
    ]
  },
  'custom-apparel': {
    name: 'Custom Apparel',
    slug: 'custom-apparel',
    banner: '/images/banner_tshirts.png',
    description: 'High-quality custom printed and embroidered clothing for teams, events, and branding.',
    seoContent: `
      <h2>Custom Branded Apparel</h2>
      <p>Unify your team and boost brand visibility with our custom apparel like t-shirts, polo shirts, and hoodies.</p>
    `,
    faqs: [
      { question: "Is embroidery better than printing for polo shirts?", answer: "For professional corporate wear like polo shirts, embroidery is highly recommended as it offers a premium look." }
    ],
    subcategories: [
      { name: 'T-Shirts', group: 'Casual Wear', slug: 't-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80', count: 45 },
      { name: 'Polo T-Shirts', group: 'Corporate Wear', slug: 'polo-t-shirts', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&q=80', count: 28 },
      { name: 'Hoodies', group: 'Winter Wear', slug: 'hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80', count: 15 }
    ]
  },
  'corporate-gifts': {
    name: 'Corporate Gifts',
    slug: 'corporate-gifts',
    banner: '/images/banner_corporate_gifts.png',
    description: 'Premium corporate gifting options to appreciate employees, welcome new hires, and impress clients.',
    seoContent: `
      <h2>Premium Corporate Gifting</h2>
      <p>Build stronger business relationships with our curated selection of premium corporate gifts.</p>
    `,
    faqs: [
      { question: "Can I customize individual items within a gift set with different names?", answer: "Yes, we offer variable data printing and engraving, allowing you to personalize items with individual names." }
    ],
    subcategories: [
      { name: 'Pens', group: 'Stationery', slug: 'pens', image: 'https://images.unsplash.com/photo-1583485088034-697b5a69f200?auto=format&fit=crop&w=400&q=80', count: 32 },
      { name: 'Diaries', group: 'Stationery', slug: 'diaries', image: 'https://images.unsplash.com/photo-1531346878377-a541fa4bc88a?auto=format&fit=crop&w=400&q=80', count: 18 },
      { name: 'Gift Sets', group: 'Kits', slug: 'gift-sets', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80', count: 12 }
    ]
  },
  'drinkware': {
    name: 'Drinkware',
    slug: 'drinkware',
    banner: '/images/banner_mugs.png',
    description: 'Personalized mugs, bottles, and sippers for everyday use and promotional gifting.',
    seoContent: `
      <h2>Personalized Custom Drinkware</h2>
      <p>Our selection includes classic ceramic coffee mugs, insulated travel tumblers, sleek stainless steel water bottles, and sporty sippers.</p>
    `,
    faqs: [
      { question: "Are your ceramic mugs microwave and dishwasher safe?", answer: "Yes, our standard printed ceramic mugs are both microwave and dishwasher safe." }
    ],
    subcategories: [
      { name: 'Coffee Mugs', group: 'Ceramic', slug: 'coffee-mugs', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=400&q=80', count: 35 },
      { name: 'Bottles', group: 'Metal', slug: 'bottles', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80', count: 24 }
    ]
  },
  'photo-prints': {
    name: 'Photo Prints',
    slug: 'photo-prints',
    banner: '/images/banner_business_cards.png',
    description: 'Turn your cherished memories into beautiful, personalized photo prints.',
    seoContent: `
      <h2>Personalized Photo Prints</h2>
      <p>Transform your favorite photographs into timeless keepsakes. Print your memories on high-quality canvas, photo frames, and albums.</p>
    `,
    faqs: [
      { question: "What resolution should my photos be for canvas printing?", answer: "We recommend photos with a resolution of at least 300 DPI." }
    ],
    subcategories: [
      { name: 'Photo Frames', group: 'Decor', slug: 'photo-frames', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80', count: 25 },
      { name: 'Canvas Prints', group: 'Wall Art', slug: 'canvas-prints', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80', count: 18 }
    ]
  },
  'invitations': {
    name: 'Invitations',
    slug: 'invitations',
    banner: '/images/banner_business_cards.png',
    description: 'Custom invitations for weddings, parties, and corporate events.',
    seoContent: `
      <h2>Custom Invitations</h2>
      <p>Invite your guests in style with our premium custom invitations. We offer a wide range of paper stocks and finishes.</p>
    `,
    faqs: [
      { question: "Do you provide matching envelopes with the invitations?", answer: "Yes, all our premium invitations come with standard matching envelopes." }
    ],
    subcategories: [
      { name: 'Wedding Invitations', group: 'Personal', slug: 'wedding-invitations', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80', count: 40 },
      { name: 'Party Invitations', group: 'Personal', slug: 'party-invitations', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80', count: 25 },
      { name: 'Corporate Invites', group: 'Corporate', slug: 'corporate-invites', image: 'https://images.unsplash.com/photo-1531346878377-a541fa4bc88a?auto=format&fit=crop&w=400&q=80', count: 15 }
    ]
  }
};
