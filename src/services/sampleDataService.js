// Sample data service for generating demo items
class SampleDataService {
  constructor() {
    this.sampleItems = [
      {
        title: "Vintage Leather Armchair",
        description: "Beautiful brown leather armchair in excellent condition. Perfect for reading corner or living room. Shows minimal wear and very comfortable.",
        category: "furniture",
        location: "Downtown Seattle, WA",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
        contact: {
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          phone: "(206) 555-0123",
          preferredMethod: "email"
        },
        coordinates: { lat: 47.6062, lng: -122.3321 },
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "iPhone 12 Pro - Unlocked",
        description: "iPhone 12 Pro in space gray, 128GB. Screen protector applied since day one. Includes original box, charger, and case.",
        category: "electronics",
        location: "Capitol Hill, Seattle",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
        contact: {
          name: "Mike Chen",
          email: "mike.chen.tech@gmail.com",
          phone: "(206) 555-0456",
          preferredMethod: "both"
        },
        coordinates: { lat: 47.6205, lng: -122.3212 },
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Women's Winter Coat - Size M",
        description: "Warm winter coat in navy blue, size medium. Barely worn, perfect for Seattle winters. Down-filled with waterproof exterior.",
        category: "clothing",
        location: "Fremont, Seattle",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop",
        contact: {
          name: "Emma Rodriguez",
          email: "emma.r.seattle@outlook.com",
          phone: "(206) 555-0789",
          preferredMethod: "email"
        },
        coordinates: { lat: 47.6513, lng: -122.3501 },
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Coffee Table Books Collection",
        description: "Collection of 15 beautiful coffee table books on photography, art, and travel. Great for decorating or reading.",
        category: "household",
        location: "Ballard, Seattle",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
        contact: {
          name: "David Kim",
          email: "d.kim.books@yahoo.com",
          phone: "(206) 555-0321",
          preferredMethod: "phone"
        },
        coordinates: { lat: 47.6684, lng: -122.3834 },
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Gaming Mechanical Keyboard",
        description: "RGB mechanical keyboard with Cherry MX Blue switches. Perfect for gaming or typing. Includes wrist rest and USB cable.",
        category: "electronics",
        location: "University District, Seattle",
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
        contact: {
          name: "Alex Thompson",
          email: "alex.gaming@protonmail.com",
          phone: "(206) 555-0654",
          preferredMethod: "email"
        },
        coordinates: { lat: 47.6587, lng: -122.3138 },
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Dining Table Set (4 chairs)",
        description: "Solid wood dining table with 4 matching chairs. Some minor scratches but very sturdy. Perfect for small apartment.",
        category: "furniture",
        location: "Queen Anne, Seattle",
        image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop",
        contact: {
          name: "Lisa Park",
          email: "lisa.park.home@gmail.com",
          phone: "(206) 555-0987",
          preferredMethod: "both"
        },
        coordinates: { lat: 47.6236, lng: -122.3564 },
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Men's Business Suits - Size 42R",
        description: "Three professional business suits in navy, charcoal, and black. Dry cleaned and ready to wear. Perfect for job interviews.",
        category: "clothing",
        location: "Belltown, Seattle",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop",
        contact: {
          name: "Robert Wilson",
          email: "r.wilson.professional@outlook.com",
          phone: "(206) 555-0147",
          preferredMethod: "email"
        },
        coordinates: { lat: 47.6131, lng: -122.3414 },
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Kitchen Appliance Bundle",
        description: "Blender, toaster, and coffee maker. All in working condition. Moving and can't take them. Great starter set for new apartment.",
        category: "household",
        location: "Wallingford, Seattle",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        contact: {
          name: "Jennifer Lee",
          email: "jen.lee.kitchen@gmail.com",
          phone: "(206) 555-0258",
          preferredMethod: "phone"
        },
        coordinates: { lat: 47.6615, lng: -122.3341 },
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Bicycle Repair Tools",
        description: "Complete set of bicycle repair tools including tire levers, chain tool, and multi-tool. Perfect for bike maintenance.",
        category: "other",
        location: "Georgetown, Seattle",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        contact: {
          name: "Carlos Martinez",
          email: "carlos.bike.repair@yahoo.com",
          phone: "(206) 555-0369",
          preferredMethod: "both"
        },
        coordinates: { lat: 47.5412, lng: -122.3234 },
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Children's Books Collection",
        description: "Over 30 children's books for ages 3-8. Includes classics like Dr. Seuss and modern favorites. Great condition.",
        category: "household",
        location: "Magnolia, Seattle",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        contact: {
          name: "Amanda Foster",
          email: "amanda.books.kids@gmail.com",
          phone: "(206) 555-0741",
          preferredMethod: "email"
        },
        coordinates: { lat: 47.6417, lng: -122.4014 },
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  // Generate sample items with unique IDs
  generateSampleItems() {
    return this.sampleItems.map((item, index) => ({
      ...item,
      id: Date.now() + index,
      status: 'available',
      views: Math.floor(Math.random() * 50) + 1,
      interested: Math.floor(Math.random() * 10),
      shared: true
    }));
  }

  // Get random subset of items
  getRandomItems(count = 10) {
    const shuffled = [...this.sampleItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((item, index) => ({
      ...item,
      id: Date.now() + index,
      status: 'available',
      views: Math.floor(Math.random() * 50) + 1,
      interested: Math.floor(Math.random() * 10),
      shared: true
    }));
  }

  // Seed sample data to localStorage
  seedSampleData() {
    const existingItems = localStorage.getItem('ecoswap-items');
    const currentItems = existingItems ? JSON.parse(existingItems) : [];
    
    // Only add sample data if there are no existing items
    if (currentItems.length === 0) {
      const sampleItems = this.generateSampleItems();
      localStorage.setItem('ecoswap-items', JSON.stringify(sampleItems));
      console.log('Sample data seeded:', sampleItems.length, 'items added');
      return sampleItems;
    }
    
    console.log('Sample data not seeded - existing items found');
    return currentItems;
  }

  // Clear all data and reseed
  reseedSampleData() {
    const sampleItems = this.generateSampleItems();
    localStorage.setItem('ecoswap-items', JSON.stringify(sampleItems));
    console.log('Sample data reseeded:', sampleItems.length, 'items added');
    return sampleItems;
  }
}

export default new SampleDataService();
