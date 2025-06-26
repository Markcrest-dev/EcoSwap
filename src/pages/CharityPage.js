import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CharityList from '../components/charity/CharityList';
import DonationHistory from '../components/charity/DonationHistory';
import CharityStats from '../components/charity/CharityStats';
import CharityService from '../services/charityService';

function CharityPage({ items }) {
  const { user } = useAuth();
  const [charities, setCharities] = useState([]);
  const [donations, setDonations] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('charities');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCharityData();
  }, [user]);

  const loadCharityData = async () => {
    setIsLoading(true);
    try {
      const charityService = new CharityService();
      const charitiesData = await charityService.getAllCharities();
      const donationsData = await charityService.getAllDonations();
      const userDonationsData = await charityService.getUserDonations(user.email);
      
      setCharities(charitiesData);
      setDonations(donationsData);
      setUserDonations(userDonationsData);
    } catch (error) {
      console.error('Error loading charity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonation = async (charityId, amount, itemId = null) => {
    try {
      const charityService = new CharityService();
      const donation = await charityService.createDonation({
        charityId,
        amount,
        itemId,
        donorId: user.email,
        donorName: `${user.firstName} ${user.lastName}`,
        date: new Date().toISOString()
      });

      setDonations(prev => [donation, ...prev]);
      setUserDonations(prev => [donation, ...prev]);
      
      alert(`Thank you for your $${amount} donation! Your contribution makes a difference.`);
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Failed to process donation. Please try again.');
    }
  };

  const handleCharityFollow = async (charityId) => {
    try {
      const charityService = new CharityService();
      await charityService.followCharity(charityId, user.email);
      
      setCharities(prev => prev.map(charity => 
        charity.id === charityId 
          ? { ...charity, followers: [...(charity.followers || []), user.email] }
          : charity
      ));
      
      alert('You are now following this charity!');
    } catch (error) {
      console.error('Error following charity:', error);
      alert('Failed to follow charity. Please try again.');
    }
  };

  const handleCharityUnfollow = async (charityId) => {
    try {
      const charityService = new CharityService();
      await charityService.unfollowCharity(charityId, user.email);
      
      setCharities(prev => prev.map(charity => 
        charity.id === charityId 
          ? { ...charity, followers: (charity.followers || []).filter(f => f !== user.email) }
          : charity
      ));
      
      alert('You have unfollowed this charity.');
    } catch (error) {
      console.error('Error unfollowing charity:', error);
      alert('Failed to unfollow charity. Please try again.');
    }
  };

  // Calculate user donation stats
  const getUserDonationStats = () => {
    const totalDonated = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
    const donationCount = userDonations.length;
    const charitiesSupported = new Set(userDonations.map(d => d.charityId)).size;
    const lastDonation = userDonations.length > 0 ? userDonations[0].date : null;
    
    return {
      totalDonated,
      donationCount,
      charitiesSupported,
      lastDonation
    };
  };

  const stats = getUserDonationStats();

  // Calculate platform donation stats
  const getPlatformStats = () => {
    const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const totalDonations = donations.length;
    const activeCharities = charities.filter(c => c.status === 'active').length;
    const avgDonation = totalDonations > 0 ? (totalRaised / totalDonations).toFixed(2) : 0;
    
    return {
      totalRaised,
      totalDonations,
      activeCharities,
      avgDonation
    };
  };

  const platformStats = getPlatformStats();

  const tabs = [
    { id: 'charities', label: 'Browse Charities', icon: '🏛️' },
    { id: 'donations', label: 'My Donations', icon: '💝' },
    { id: 'impact', label: 'Impact Stats', icon: '📊' }
  ];

  if (isLoading) {
    return (
      <div className="charity-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading charity information...</h2>
          <p>Please wait while we fetch charity data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="charity-page">
      <div className="charity-header">
        <div className="charity-title">
          <h1>Charity & Donations</h1>
          <p>Support causes you care about while sharing items</p>
        </div>
        <div className="charity-summary">
          <div className="summary-stat">
            <span className="stat-value">${stats.totalDonated}</span>
            <span className="stat-label">You've Donated</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{stats.charitiesSupported}</span>
            <span className="stat-label">Charities Supported</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">${platformStats.totalRaised}</span>
            <span className="stat-label">Platform Total</span>
          </div>
        </div>
      </div>

      <div className="charity-content">
        <div className="charity-sidebar">
          <CharityStats 
            userStats={stats}
            platformStats={platformStats}
            charities={charities}
            donations={donations}
          />
          
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button 
              className="action-btn donate-btn"
              onClick={() => {
                const amount = prompt('Enter donation amount ($):');
                if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                  // Find a featured charity for quick donation
                  const featuredCharity = charities.find(c => c.featured) || charities[0];
                  if (featuredCharity) {
                    handleDonation(featuredCharity.id, parseFloat(amount));
                  }
                }
              }}
            >
              💝 Quick Donate
            </button>
            <button 
              className="action-btn share-btn"
              onClick={() => window.location.href = '/share'}
            >
              📤 Share for Charity
            </button>
            <button 
              className="action-btn impact-btn"
              onClick={() => setActiveTab('impact')}
            >
              📊 View Impact
            </button>
          </div>
        </div>

        <div className="charity-main">
          <div className="charity-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`charity-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-count">
                  ({tab.id === 'charities' 
                    ? charities.length
                    : tab.id === 'donations'
                    ? userDonations.length
                    : platformStats.activeCharities
                  })
                </span>
              </button>
            ))}
          </div>

          {activeTab === 'charities' && (
            <CharityList
              charities={charities}
              currentUser={user}
              onDonate={handleDonation}
              onFollow={handleCharityFollow}
              onUnfollow={handleCharityUnfollow}
            />
          )}

          {activeTab === 'donations' && (
            <DonationHistory
              donations={userDonations}
              charities={charities}
              items={items}
            />
          )}

          {activeTab === 'impact' && (
            <CharityStats 
              userStats={stats}
              platformStats={platformStats}
              charities={charities}
              donations={donations}
              detailed={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CharityPage;
