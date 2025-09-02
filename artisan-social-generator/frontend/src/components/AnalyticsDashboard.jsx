import React from 'react';

const AnalyticsDashboard = ({ analytics, platform }) => {
  const platformData = analytics.platforms[platform] || analytics.platforms.instagram;
  
  const renderEngagementMetric = () => {
    const engagementRate = platformData.engagementRate || 3.5;
    const change = platformData.change || 0.8;
    
    return (
      <div className="metric-card">
        <div className="metric-label">Engagement Rate</div>
        <div className="metric-value">{engagementRate}%</div>
        <div className={`metric-change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from average
        </div>
        <div className="metric-subtitle">Based on 1,000+ similar posts</div>
        <div className="metric-progress">
          <div 
            className="progress-fill" 
            style={{ width: `${engagementRate * 20}%` }}
          />
        </div>
      </div>
    );
  };
  
  const renderReachMetric = () => {
    const estimatedReach = platformData.estimatedReach || 1500;
    const followerCount = 500; // Placeholder value
    const reachPercentage = Math.round((estimatedReach / followerCount) * 100);
    
    return (
      <div className="metric-card">
        <div className="metric-label">Estimated Reach</div>
        <div className="metric-value">{estimatedReach.toLocaleString()}</div>
        <div className="metric-subtitle">
          {reachPercentage}% of your typical audience
        </div>
        <div className="metric-progress">
          <div 
            className="progress-fill" 
            style={{ width: `${reachPercentage}%` }}
          />
        </div>
      </div>
    );
  };
  
  const renderConversionMetric = () => {
    const conversionRate = platformData.conversionRate || 2.8;
    const expectedClicks = platformData.expectedClicks || 42;
    
    return (
      <div className="metric-card">
        <div className="metric-label">Click-Through Rate</div>
        <div className="metric-value">{conversionRate}%</div>
        <div className="metric-subtitle">
          ~{expectedClicks} expected clicks
        </div>
        <div className="metric-progress">
          <div 
            className="progress-fill" 
            style={{ width: `${conversionRate * 20}%` }}
          />
        </div>
      </div>
    );
  };
  
  const renderTimingMetric = () => {
    const optimalTime = platformData.optimalTime || '7:00 PM';
    const dayOfWeek = platformData.optimalDay || 'Friday';
    
    return (
      <div className="metric-card">
        <div className="metric-label">Optimal Posting Time</div>
        <div className="metric-value">{optimalTime}</div>
        <div className="metric-subtitle">
          Best day: {dayOfWeek}
        </div>
        <div className="timing-indicator">
          <div className="day-indicator">
            <span className={dayOfWeek === 'Monday' ? 'active' : ''}>M</span>
            <span className={dayOfWeek === 'Tuesday' ? 'active' : ''}>T</span>
            <span className={dayOfWeek === 'Wednesday' ? 'active' : ''}>W</span>
            <span className={dayOfWeek === 'Thursday' ? 'active' : ''}>T</span>
            <span className={dayOfWeek === 'Friday' ? 'active' : ''}>F</span>
            <span className={dayOfWeek === 'Saturday' ? 'active' : ''}>S</span>
            <span className={dayOfWeek === 'Sunday' ? 'active' : ''}>S</span>
          </div>
        </div>
      </div>
    );
  };
  
  const renderInsights = () => {
    const insights = analytics.insights || [
      "Adding personal artisan stories may increase engagement by 25%",
      "Posts with traditional crafting techniques get 3.2x more shares",
      "Your audience responds best to earthy color palettes",
      "Local cultural references improve conversion rates by 18%"
    ];
    
    return (
      <div className="insights-section">
        <h4>
          <span className="insights-icon">💡</span>
          AI-Generated Insights
        </h4>
        <ul className="insights-list">
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  return (
    <div className="analytics-dashboard">
      <div className="metrics-grid">
        {renderEngagementMetric()}
        {renderReachMetric()}
        {renderConversionMetric()}
        {renderTimingMetric()}
      </div>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h4>Engagement Forecast (Next 24 Hours)</h4>
          <div className="chart-placeholder">
            <img 
              src="/engagement-chart.svg" 
              alt="Engagement chart" 
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
        
        <div className="chart-container">
          <h4>Audience Demographics</h4>
          <div className="chart-placeholder">
            <img 
              src="/demographics-chart.svg" 
              alt="Demographics chart" 
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
      
      {renderInsights()}
    </div>
  );
};

export default AnalyticsDashboard;