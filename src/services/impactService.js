class ImpactService {
  constructor() {
    this.impactKey = 'ecoswap-impact-data';
    this.goalsKey = 'ecoswap-impact-goals';
    
    // Environmental impact factors per category (kg CO2, kg waste, liters water, kWh energy)
    this.impactFactors = {
      clothing: {
        co2PerItem: 8.5,
        wastePerItem: 0.8,
        waterPerItem: 2700,
        energyPerItem: 15
      },
      electronics: {
        co2PerItem: 45.2,
        wastePerItem: 2.5,
        waterPerItem: 1200,
        energyPerItem: 85
      },
      furniture: {
        co2PerItem: 25.8,
        wastePerItem: 15.0,
        waterPerItem: 800,
        energyPerItem: 120
      },
      household: {
        co2PerItem: 12.3,
        wastePerItem: 1.2,
        waterPerItem: 450,
        energyPerItem: 25
      },
      other: {
        co2PerItem: 6.7,
        wastePerItem: 0.9,
        waterPerItem: 300,
        energyPerItem: 18
      }
    };
    
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.impactKey)) {
      localStorage.setItem(this.impactKey, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.goalsKey)) {
      localStorage.setItem(this.goalsKey, JSON.stringify({}));
    }
  }

  async calculateUserImpact(userItems) {
    const impact = {
      itemsShared: userItems.length,
      co2Saved: 0,
      wasteReduced: 0,
      waterSaved: 0,
      energySaved: 0,
      byCategory: {}
    };

    userItems.forEach(item => {
      const category = item.category || 'other';
      const factors = this.impactFactors[category] || this.impactFactors.other;
      
      impact.co2Saved += factors.co2PerItem;
      impact.wasteReduced += factors.wastePerItem;
      impact.waterSaved += factors.waterPerItem;
      impact.energySaved += factors.energyPerItem;
      
      if (!impact.byCategory[category]) {
        impact.byCategory[category] = {
          itemCount: 0,
          co2Saved: 0,
          wasteReduced: 0,
          waterSaved: 0,
          energySaved: 0
        };
      }
      
      impact.byCategory[category].itemCount += 1;
      impact.byCategory[category].co2Saved += factors.co2PerItem;
      impact.byCategory[category].wasteReduced += factors.wastePerItem;
      impact.byCategory[category].waterSaved += factors.waterPerItem;
      impact.byCategory[category].energySaved += factors.energyPerItem;
    });

    // Round values to 1 decimal place
    impact.co2Saved = Math.round(impact.co2Saved * 10) / 10;
    impact.wasteReduced = Math.round(impact.wasteReduced * 10) / 10;
    impact.waterSaved = Math.round(impact.waterSaved);
    impact.energySaved = Math.round(impact.energySaved * 10) / 10;

    // Round category values
    Object.keys(impact.byCategory).forEach(category => {
      const cat = impact.byCategory[category];
      cat.co2Saved = Math.round(cat.co2Saved * 10) / 10;
      cat.wasteReduced = Math.round(cat.wasteReduced * 10) / 10;
      cat.waterSaved = Math.round(cat.waterSaved);
      cat.energySaved = Math.round(cat.energySaved * 10) / 10;
    });

    return impact;
  }

  async calculatePlatformImpact(allItems) {
    const impact = {
      totalItems: allItems.length,
      totalCO2Saved: 0,
      totalWasteReduced: 0,
      totalWaterSaved: 0,
      totalEnergySaved: 0,
      activeUsers: 0,
      topCategory: '',
      growthRate: 0,
      byCategory: {}
    };

    // Calculate totals
    allItems.forEach(item => {
      const category = item.category || 'other';
      const factors = this.impactFactors[category] || this.impactFactors.other;
      
      impact.totalCO2Saved += factors.co2PerItem;
      impact.totalWasteReduced += factors.wastePerItem;
      impact.totalWaterSaved += factors.waterPerItem;
      impact.totalEnergySaved += factors.energyPerItem;
      
      if (!impact.byCategory[category]) {
        impact.byCategory[category] = {
          itemCount: 0,
          co2Saved: 0,
          wasteReduced: 0
        };
      }
      
      impact.byCategory[category].itemCount += 1;
      impact.byCategory[category].co2Saved += factors.co2PerItem;
      impact.byCategory[category].wasteReduced += factors.wastePerItem;
    });

    // Calculate active users
    const uniqueUsers = new Set(allItems.map(item => item.contact?.email).filter(Boolean));
    impact.activeUsers = uniqueUsers.size;

    // Find top category
    let maxItems = 0;
    Object.entries(impact.byCategory).forEach(([category, data]) => {
      if (data.itemCount > maxItems) {
        maxItems = data.itemCount;
        impact.topCategory = category;
      }
    });

    // Calculate growth rate (simulate based on recent items)
    const now = new Date();
    const thisMonth = allItems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }).length;
    
    const lastMonth = allItems.filter(item => {
      const itemDate = new Date(item.date);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return itemDate.getMonth() === lastMonthDate.getMonth() && itemDate.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    if (lastMonth > 0) {
      impact.growthRate = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
    }

    // Round values
    impact.totalCO2Saved = Math.round(impact.totalCO2Saved * 10) / 10;
    impact.totalWasteReduced = Math.round(impact.totalWasteReduced * 10) / 10;
    impact.totalWaterSaved = Math.round(impact.totalWaterSaved);
    impact.totalEnergySaved = Math.round(impact.totalEnergySaved * 10) / 10;

    return impact;
  }

  async getDetailedImpactData(allItems, userEmail) {
    const userItems = allItems.filter(item => item.contact?.email === userEmail);
    
    // Generate timeline data for the last 6 months
    const userTimeline = this.generateTimelineData(userItems);
    const platformTimeline = this.generateTimelineData(allItems);
    
    // Calculate user impact by category
    const userByCategory = {};
    userItems.forEach(item => {
      const category = item.category || 'other';
      const factors = this.impactFactors[category] || this.impactFactors.other;
      
      if (!userByCategory[category]) {
        userByCategory[category] = {
          itemCount: 0,
          co2Saved: 0,
          wasteReduced: 0,
          waterSaved: 0,
          energySaved: 0
        };
      }
      
      userByCategory[category].itemCount += 1;
      userByCategory[category].co2Saved += factors.co2PerItem;
      userByCategory[category].wasteReduced += factors.wastePerItem;
      userByCategory[category].waterSaved += factors.waterPerItem;
      userByCategory[category].energySaved += factors.energyPerItem;
    });

    // Round category values
    Object.keys(userByCategory).forEach(category => {
      const cat = userByCategory[category];
      cat.co2Saved = Math.round(cat.co2Saved * 10) / 10;
      cat.wasteReduced = Math.round(cat.wasteReduced * 10) / 10;
      cat.waterSaved = Math.round(cat.waterSaved);
      cat.energySaved = Math.round(cat.energySaved * 10) / 10;
    });

    // Generate top contributors
    const topContributors = this.generateTopContributors(allItems);

    return {
      userTimeline,
      platformTimeline,
      userByCategory,
      topContributors
    };
  }

  generateTimelineData(items) {
    const timeline = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthItems = items.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= monthStart && itemDate <= monthEnd;
      });

      let co2Saved = 0;
      let wasteReduced = 0;
      
      monthItems.forEach(item => {
        const category = item.category || 'other';
        const factors = this.impactFactors[category] || this.impactFactors.other;
        co2Saved += factors.co2PerItem;
        wasteReduced += factors.wastePerItem;
      });

      timeline.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        itemCount: monthItems.length,
        co2Saved: Math.round(co2Saved * 10) / 10,
        wasteReduced: Math.round(wasteReduced * 10) / 10
      });
    }
    
    return timeline;
  }

  generateTopContributors(allItems) {
    const contributors = {};
    
    allItems.forEach(item => {
      const email = item.contact?.email;
      const name = item.contact?.name || 'Anonymous';
      
      if (!email) return;
      
      if (!contributors[email]) {
        contributors[email] = {
          name,
          itemsShared: 0,
          co2Saved: 0,
          wasteReduced: 0
        };
      }
      
      const category = item.category || 'other';
      const factors = this.impactFactors[category] || this.impactFactors.other;
      
      contributors[email].itemsShared += 1;
      contributors[email].co2Saved += factors.co2PerItem;
      contributors[email].wasteReduced += factors.wastePerItem;
    });

    // Convert to array and sort by CO2 saved
    const sortedContributors = Object.values(contributors)
      .map(contributor => ({
        ...contributor,
        co2Saved: Math.round(contributor.co2Saved * 10) / 10,
        wasteReduced: Math.round(contributor.wasteReduced * 10) / 10
      }))
      .sort((a, b) => b.co2Saved - a.co2Saved)
      .slice(0, 10); // Top 10 contributors

    return sortedContributors;
  }

  async getUserGoals(userEmail) {
    const goals = JSON.parse(localStorage.getItem(this.goalsKey) || '{}');
    return goals[userEmail] || {
      monthlyItems: 5,
      monthlyCO2: 50,
      yearlyItems: 60,
      yearlyCO2: 600
    };
  }

  async setUserGoals(userEmail, goals) {
    const allGoals = JSON.parse(localStorage.getItem(this.goalsKey) || '{}');
    allGoals[userEmail] = goals;
    localStorage.setItem(this.goalsKey, JSON.stringify(allGoals));
    return goals;
  }

  async getGoalProgress(userEmail, userItems) {
    const goals = await this.getUserGoals(userEmail);
    const now = new Date();
    
    // Monthly progress
    const thisMonthItems = userItems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    });
    
    const monthlyImpact = await this.calculateUserImpact(thisMonthItems);
    
    // Yearly progress
    const thisYearItems = userItems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === now.getFullYear();
    });
    
    const yearlyImpact = await this.calculateUserImpact(thisYearItems);
    
    return {
      monthly: {
        items: {
          current: thisMonthItems.length,
          goal: goals.monthlyItems,
          percentage: Math.min((thisMonthItems.length / goals.monthlyItems) * 100, 100)
        },
        co2: {
          current: monthlyImpact.co2Saved,
          goal: goals.monthlyCO2,
          percentage: Math.min((monthlyImpact.co2Saved / goals.monthlyCO2) * 100, 100)
        }
      },
      yearly: {
        items: {
          current: thisYearItems.length,
          goal: goals.yearlyItems,
          percentage: Math.min((thisYearItems.length / goals.yearlyItems) * 100, 100)
        },
        co2: {
          current: yearlyImpact.co2Saved,
          goal: goals.yearlyCO2,
          percentage: Math.min((yearlyImpact.co2Saved / goals.yearlyCO2) * 100, 100)
        }
      }
    };
  }

  getImpactEquivalents(co2Saved) {
    // Convert CO2 savings to relatable equivalents
    const equivalents = {
      treesPlanted: Math.round(co2Saved / 21.8), // Average tree absorbs 21.8 kg CO2/year
      carMiles: Math.round(co2Saved / 0.404), // Average car emits 404g CO2/mile
      phoneCharges: Math.round(co2Saved / 0.0084), // Phone charge = 8.4g CO2
      lightBulbHours: Math.round(co2Saved / 0.0006) // LED bulb = 0.6g CO2/hour
    };
    
    return equivalents;
  }

  async getImpactCertificate(userEmail, userItems) {
    const userImpact = await this.calculateUserImpact(userItems);
    const equivalents = this.getImpactEquivalents(userImpact.co2Saved);
    
    return {
      userEmail,
      itemsShared: userImpact.itemsShared,
      co2Saved: userImpact.co2Saved,
      wasteReduced: userImpact.wasteReduced,
      waterSaved: userImpact.waterSaved,
      energySaved: userImpact.energySaved,
      equivalents,
      generatedAt: new Date().toISOString(),
      certificateId: `ECOSWAP-${Date.now()}`
    };
  }
}

export default ImpactService;
