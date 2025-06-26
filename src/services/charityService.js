class CharityService {
  constructor() {
    this.charitiesKey = 'ecoswap-charities';
    this.donationsKey = 'ecoswap-donations';
    this.followersKey = 'ecoswap-charity-followers';
    
    // Initialize storage if needed
    this.initializeStorage();
    
    // Generate sample charities for demo
    this.generateSampleData();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.charitiesKey)) {
      localStorage.setItem(this.charitiesKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.donationsKey)) {
      localStorage.setItem(this.donationsKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.followersKey)) {
      localStorage.setItem(this.followersKey, JSON.stringify({}));
    }
  }

  generateSampleData() {
    const charities = this.getStoredCharities();
    if (charities.length === 0) {
      // Create sample charities for demo
      const sampleCharities = [
        {
          id: 'charity-1',
          name: 'Green Earth Foundation',
          description: 'Dedicated to environmental conservation and sustainable living practices worldwide.',
          category: 'environment',
          website: 'https://greenearthfoundation.org',
          logo: '🌍',
          featured: true,
          status: 'active',
          totalRaised: 15420.50,
          donorCount: 234,
          projects: [
            'Tree Planting Initiative',
            'Ocean Cleanup Program',
            'Renewable Energy Projects'
          ],
          impact: {
            treesPlanted: 5420,
            wasteReduced: '12.5 tons',
            co2Saved: '8.3 tons'
          },
          rating: 4.8,
          transparency: 95,
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'charity-2',
          name: 'Community Food Bank',
          description: 'Fighting hunger in local communities by providing food assistance to families in need.',
          category: 'hunger',
          website: 'https://communityfoodbank.org',
          logo: '🍞',
          featured: true,
          status: 'active',
          totalRaised: 28750.25,
          donorCount: 456,
          projects: [
            'Mobile Food Pantry',
            'School Lunch Program',
            'Senior Meal Delivery'
          ],
          impact: {
            mealsProvided: 15420,
            familiesHelped: 892,
            volunteersEngaged: 156
          },
          rating: 4.9,
          transparency: 98,
          createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'charity-3',
          name: 'Education for All',
          description: 'Providing educational resources and opportunities to underserved communities globally.',
          category: 'education',
          website: 'https://educationforall.org',
          logo: '📚',
          featured: false,
          status: 'active',
          totalRaised: 12340.75,
          donorCount: 189,
          projects: [
            'Digital Learning Centers',
            'Teacher Training Program',
            'Scholarship Fund'
          ],
          impact: {
            studentsHelped: 2340,
            schoolsBuilt: 12,
            teachersTrained: 89
          },
          rating: 4.7,
          transparency: 92,
          createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'charity-4',
          name: 'Animal Rescue Network',
          description: 'Rescuing, rehabilitating, and rehoming animals in need across the region.',
          category: 'animals',
          website: 'https://animalrescuenetwork.org',
          logo: '🐾',
          featured: false,
          status: 'active',
          totalRaised: 9876.30,
          donorCount: 167,
          projects: [
            'Emergency Animal Rescue',
            'Spay/Neuter Program',
            'Pet Adoption Services'
          ],
          impact: {
            animalsRescued: 1234,
            adoptionsCompleted: 567,
            medicalTreatments: 890
          },
          rating: 4.6,
          transparency: 89,
          createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const sampleDonations = [
        {
          id: 'donation-1',
          charityId: 'charity-1',
          charityName: 'Green Earth Foundation',
          amount: 25.00,
          donorId: 'demo@ecoswap.com',
          donorName: 'Demo User',
          itemId: 'item-1',
          itemTitle: 'Vintage Leather Armchair',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'item-share',
          message: 'Donated in connection with sharing my vintage armchair'
        },
        {
          id: 'donation-2',
          charityId: 'charity-2',
          charityName: 'Community Food Bank',
          amount: 15.00,
          donorId: 'demo@ecoswap.com',
          donorName: 'Demo User',
          itemId: null,
          itemTitle: null,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'direct',
          message: 'Direct donation to support local food assistance'
        }
      ];

      localStorage.setItem(this.charitiesKey, JSON.stringify(sampleCharities));
      localStorage.setItem(this.donationsKey, JSON.stringify(sampleDonations));
    }
  }

  getStoredCharities() {
    return JSON.parse(localStorage.getItem(this.charitiesKey) || '[]');
  }

  getStoredDonations() {
    return JSON.parse(localStorage.getItem(this.donationsKey) || '[]');
  }

  getStoredFollowers() {
    return JSON.parse(localStorage.getItem(this.followersKey) || '{}');
  }

  async getAllCharities() {
    const charities = this.getStoredCharities();
    return charities.sort((a, b) => {
      // Sort by featured first, then by total raised
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.totalRaised - a.totalRaised;
    });
  }

  async getAllDonations() {
    const donations = this.getStoredDonations();
    return donations.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getUserDonations(userEmail) {
    const donations = this.getStoredDonations();
    return donations
      .filter(donation => donation.donorId === userEmail)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getCharityDonations(charityId) {
    const donations = this.getStoredDonations();
    return donations
      .filter(donation => donation.charityId === charityId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async createDonation(donationData) {
    const donations = this.getStoredDonations();
    const charities = this.getStoredCharities();
    
    const newDonation = {
      id: `donation-${Date.now()}`,
      ...donationData,
      date: new Date().toISOString()
    };

    // Add charity name to donation
    const charity = charities.find(c => c.id === donationData.charityId);
    if (charity) {
      newDonation.charityName = charity.name;
      
      // Update charity totals
      charity.totalRaised += donationData.amount;
      charity.donorCount += 1;
      
      localStorage.setItem(this.charitiesKey, JSON.stringify(charities));
    }

    donations.unshift(newDonation);
    localStorage.setItem(this.donationsKey, JSON.stringify(donations));

    return newDonation;
  }

  async followCharity(charityId, userEmail) {
    const followers = this.getStoredFollowers();
    
    if (!followers[charityId]) {
      followers[charityId] = [];
    }
    
    if (!followers[charityId].includes(userEmail)) {
      followers[charityId].push(userEmail);
      localStorage.setItem(this.followersKey, JSON.stringify(followers));
    }
  }

  async unfollowCharity(charityId, userEmail) {
    const followers = this.getStoredFollowers();
    
    if (followers[charityId]) {
      followers[charityId] = followers[charityId].filter(email => email !== userEmail);
      localStorage.setItem(this.followersKey, JSON.stringify(followers));
    }
  }

  async getCharityFollowers(charityId) {
    const followers = this.getStoredFollowers();
    return followers[charityId] || [];
  }

  async isFollowingCharity(charityId, userEmail) {
    const followers = await this.getCharityFollowers(charityId);
    return followers.includes(userEmail);
  }

  async searchCharities(query, filters = {}) {
    const charities = this.getStoredCharities();
    
    let filteredCharities = charities;

    // Text search
    if (query) {
      const searchLower = query.toLowerCase();
      filteredCharities = filteredCharities.filter(charity =>
        charity.name.toLowerCase().includes(searchLower) ||
        charity.description.toLowerCase().includes(searchLower) ||
        charity.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filteredCharities = filteredCharities.filter(charity => charity.category === filters.category);
    }

    // Status filter
    if (filters.status) {
      filteredCharities = filteredCharities.filter(charity => charity.status === filters.status);
    }

    // Featured filter
    if (filters.featured) {
      filteredCharities = filteredCharities.filter(charity => charity.featured);
    }

    return filteredCharities;
  }

  async getCharityStats() {
    const charities = this.getStoredCharities();
    const donations = this.getStoredDonations();
    
    const stats = {
      totalCharities: charities.length,
      activeCharities: charities.filter(c => c.status === 'active').length,
      totalRaised: donations.reduce((sum, d) => sum + d.amount, 0),
      totalDonations: donations.length,
      avgDonation: donations.length > 0 ? donations.reduce((sum, d) => sum + d.amount, 0) / donations.length : 0,
      categoryBreakdown: {},
      monthlyDonations: this.getMonthlyDonationStats(donations),
      topCharities: charities
        .sort((a, b) => b.totalRaised - a.totalRaised)
        .slice(0, 5)
    };

    // Calculate category breakdown
    charities.forEach(charity => {
      stats.categoryBreakdown[charity.category] = (stats.categoryBreakdown[charity.category] || 0) + 1;
    });

    return stats;
  }

  getMonthlyDonationStats(donations) {
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthDonations = donations.filter(donation => {
        const donationDate = new Date(donation.date);
        return donationDate >= monthStart && donationDate <= monthEnd;
      });

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthDonations.reduce((sum, d) => sum + d.amount, 0),
        count: monthDonations.length
      });
    }
    return monthlyData;
  }

  async getRecommendedCharities(userEmail, userInterests = []) {
    const charities = this.getStoredCharities();
    const userDonations = await this.getUserDonations(userEmail);
    
    // Get categories user has donated to
    const donatedCategories = [...new Set(userDonations.map(d => {
      const charity = charities.find(c => c.id === d.charityId);
      return charity ? charity.category : null;
    }).filter(Boolean))];

    // Recommend charities based on user's donation history and interests
    let recommended = charities.filter(charity => {
      // Don't recommend if user already donated recently
      const recentDonation = userDonations.find(d => 
        d.charityId === charity.id && 
        new Date(d.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      
      if (recentDonation) return false;

      // Prefer categories user has shown interest in
      if (donatedCategories.includes(charity.category)) return true;
      if (userInterests.includes(charity.category)) return true;
      
      // Include featured charities
      if (charity.featured) return true;
      
      return false;
    });

    // If no specific recommendations, return top-rated charities
    if (recommended.length === 0) {
      recommended = charities
        .filter(c => c.status === 'active')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    }

    return recommended.slice(0, 5);
  }
}

export default CharityService;
