import React, { useState } from 'react';

const ContentScheduler = ({ content, platform, onSchedule }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [platforms, setPlatforms] = useState({
    [platform]: true,
    instagram: platform === 'instagram',
    facebook: platform === 'facebook',
    linkedin: platform === 'linkedin',
    twitter: platform === 'twitter'
  });
  const [scheduledPosts, setScheduledPosts] = useState([]);
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate optimal posting times based on platform and audience
  const getOptimalTimes = () => {
    const times = {
      instagram: ['9:00 AM', '12:00 PM', '6:00 PM', '9:00 PM'],
      facebook: ['8:00 AM', '1:00 PM', '4:00 PM', '8:00 PM'],
      linkedin: ['8:00 AM', '10:00 AM', '12:00 PM', '5:00 PM'],
      twitter: ['7:00 AM', '11:00 AM', '2:00 PM', '6:00 PM']
    };
    
    return times[platform] || times.instagram;
  };
  
  const handlePlatformToggle = (selectedPlatform) => {
    setPlatforms({
      ...platforms,
      [selectedPlatform]: !platforms[selectedPlatform]
    });
  };
  
  const handleSchedule = (e) => {
    e.preventDefault();
    
    if (!date || !time) {
      alert('Please select both date and time');
      return;
    }
    
    // Create scheduled post object
    const newPost = {
      id: Date.now(),
      date,
      time,
      platforms: Object.keys(platforms).filter(p => platforms[p]),
      content
    };
    
    // Add to scheduled posts
    setScheduledPosts([...scheduledPosts, newPost]);
    
    // Reset form
    setDate('');
    setTime('');
    
    // Trigger callback
    onSchedule(`Post scheduled for ${date} at ${time}`);
  };
  
  const handleCancelSchedule = (id) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
    onSchedule('Scheduled post cancelled');
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const optimalTimes = getOptimalTimes();
  
  return (
    <div className="content-scheduler">
      <div className="scheduler-form">
        <h4>Schedule Your Post</h4>
        <form onSubmit={handleSchedule}>
          <div className="form-group">
            <label htmlFor="schedule-date">Date</label>
            <input 
              type="date" 
              id="schedule-date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="schedule-time">Time</label>
            <div className="time-suggestions">
              <input 
                type="time" 
                id="schedule-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              <div className="optimal-times">
                <p>Suggested times:</p>
                <div className="time-buttons">
                  {optimalTimes.map((optimalTime, index) => (
                    <button
                      key={index}
                      type="button"
                      className="time-suggestion"
                      onClick={() => {
                        // Convert 12-hour format to 24-hour format for input
                        const timeStr = optimalTime.match(/(\d+):(\d+) (\w+)/);
                        if (timeStr) {
                          let hours = parseInt(timeStr[1]);
                          const minutes = timeStr[2];
                          const period = timeStr[3];
                          
                          if (period === 'PM' && hours < 12) hours += 12;
                          if (period === 'AM' && hours === 12) hours = 0;
                          
                          setTime(`${hours.toString().padStart(2, '0')}:${minutes}`);
                        }
                      }}
                    >
                      {optimalTime}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Platforms</label>
            <div className="platform-checkboxes">
              <input 
                type="checkbox" 
                id="platform-instagram" 
                checked={platforms.instagram}
                onChange={() => handlePlatformToggle('instagram')}
              />
              <label htmlFor="platform-instagram">
                <span className="platform-icon">📷</span>
                Instagram
              </label>
              
              <input 
                type="checkbox" 
                id="platform-facebook" 
                checked={platforms.facebook}
                onChange={() => handlePlatformToggle('facebook')}
              />
              <label htmlFor="platform-facebook">
                <span className="platform-icon">👤</span>
                Facebook
              </label>
              
              <input 
                type="checkbox" 
                id="platform-linkedin" 
                checked={platforms.linkedin}
                onChange={() => handlePlatformToggle('linkedin')}
              />
              <label htmlFor="platform-linkedin">
                <span className="platform-icon">💼</span>
                LinkedIn
              </label>
              
              <input 
                type="checkbox" 
                id="platform-twitter" 
                checked={platforms.twitter}
                onChange={() => handlePlatformToggle('twitter')}
              />
              <label htmlFor="platform-twitter">
                <span className="platform-icon">🐦</span>
                Twitter
              </label>
            </div>
          </div>
          
          <button type="submit" className="schedule-button">
            <span className="button-icon">📅</span>
            Schedule Post
          </button>
        </form>
      </div>
      
      <div className="scheduled-posts">
        <h4>Scheduled Posts</h4>
        {scheduledPosts.length === 0 ? (
          <div className="no-posts">
            No posts scheduled yet
          </div>
        ) : (
          <div className="posts-list">
            {scheduledPosts.map(post => (
              <div key={post.id} className="scheduled-post">
                <div className="post-info">
                  <span className="post-date">{formatDate(post.date)}</span>
                  <span className="post-time">{post.time}</span>
                  <span className="post-platforms">
                    {post.platforms.map(p => (
                      p === 'instagram' ? '📷 ' : 
                      p === 'facebook' ? '👤 ' : 
                      p === 'linkedin' ? '💼 ' : 
                      p === 'twitter' ? '🐦 ' : ''
                    )).join('')}
                  </span>
                </div>
                <div className="post-actions">
                  <span className="post-status">Scheduled</span>
                  <button 
                    className="cancel-button"
                    onClick={() => handleCancelSchedule(post.id)}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentScheduler;