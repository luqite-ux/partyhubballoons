export type ProductFallback = {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  applications: string[];
  customization: string[];
};

export const products: ProductFallback[] = [
  {
    slug: "agate-star-foil-balloon",
    name: "Agate Star Foil Balloon",
    category: "Shape Foil Balloons",
    description: "An 18-inch star-shaped foil balloon with a flowing agate-style color pattern for birthdays, party installations, retail assortments, and event decoration.",
    image: "/media/products/agate-star-foil-balloon.png",
    applications: ["Birthday parties", "Event installations", "Retail party collections"],
    customization: ["Color assortment", "Printed artwork", "Retail packaging"],
  },
  {
    slug: "happy-anniversary-letter-balloons",
    name: "Happy Anniversary Letter Balloons",
    category: "Letter Balloons",
    description: "A coordinated foil letter set designed to create a bright anniversary message for celebrations, venue styling, gift displays, and party retail programs.",
    image: "/media/products/happy-anniversary-letter-balloons.png",
    applications: ["Anniversary celebrations", "Venue decoration", "Photo backdrops"],
    customization: ["Letter combinations", "Color selection", "Packaging format"],
  },
  {
    slug: "birthday-girl-foil-balloon",
    name: "Birthday Girl Foil Balloon",
    category: "Character Foil Balloons",
    description: "A large character-style birthday balloon with a colorful cake motif, developed for children's celebrations, themed displays, and party-supply assortments.",
    image: "/media/products/birthday-girl-foil-balloon.png",
    applications: ["Children's birthdays", "Theme parties", "Gift displays"],
    customization: ["Artwork development", "Color adjustment", "Branded packaging"],
  },
  {
    slug: "feliz-dia-round-foil-balloon",
    name: "Feliz Día Round Foil Balloon",
    category: "Printed Foil Balloons",
    description: "An 18-inch round foil balloon offered in light and dark designs with Spanish celebration lettering for regional retail programs and festive gifting.",
    image: "/media/products/feliz-dia-round-foil-balloon.png",
    applications: ["Celebration gifting", "Spanish-language retail", "Party decoration"],
    customization: ["Language artwork", "Color theme", "Retail packaging"],
  },
  {
    slug: "gold-number-foil-balloons",
    name: "Gold Number Foil Balloons",
    category: "Number Balloons",
    description: "A coordinated 0-9 number balloon range in a bright gold finish for birthdays, anniversaries, milestone events, display walls, and retail party collections.",
    image: "/media/products/gold-number-foil-balloons.png",
    applications: ["Milestone birthdays", "Anniversaries", "Event displays"],
    customization: ["Color finish", "Number assortment", "Packing quantity"],
  },
];
