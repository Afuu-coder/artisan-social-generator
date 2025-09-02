import React from 'react';

const PostPreview = ({ platform, imageUrl, content, productData }) => {
  const renderInstagramPreview = () => {
    return (
      <div className="instagram-preview">
        <div className="preview-header">
          <div className="user-info">
            <div className="avatar"></div>
            <div>
              <div className="username">{productData.artisanName.replace(/\s+/g, '').toLowerCase()}</div>
              <div className="location">{productData.location}</div>
            </div>
          </div>
          <div className="more-icon">⋯</div>
        </div>
        
        <div className="preview-image">
          <img src={imageUrl} alt={productData.title} />
        </div>
        
        <div className="preview-actions">
          <span>❤️</span>
          <span>💬</span>
          <span>📤</span>
          <span className="bookmark">🔖</span>
        </div>
        
        <div className="preview-content">
          <div className="likes">127 likes</div>
          <div className="caption">
            <strong>{productData.artisanName.replace(/\s+/g, '').toLowerCase()}</strong> {content.caption}
          </div>
          <div className="hashtags">
            {content.hashtags.slice(0, 5).map((tag, index) => (
              <span key={index} className="hashtag-small">{tag}</span>
            ))}
            {content.hashtags.length > 5 && <span className="hashtag-small">...</span>}
          </div>
        </div>
      </div>
    );
  };
  
  const renderFacebookPreview = () => {
    return (
      <div className="facebook-preview">
        <div className="preview-header">
          <div className="user-info">
            <div className="avatar"></div>
            <div>
              <div className="username">{productData.artisanName}</div>
              <div className="time">2 hours ago</div>
            </div>
          </div>
          <div className="more-icon">⋯</div>
        </div>
        
        <div className="preview-content">
          <div className="caption">{content.caption}</div>
        </div>
        
        <div className="preview-image">
          <img src={imageUrl} alt={productData.title} />
        </div>
        
        <div className="preview-stats">
          <span>❤️ 89</span>
          <span>💬 12 comments</span>
          <span>🔄 5 shares</span>
        </div>
        
        <div className="preview-actions">
          <button>👍 Like</button>
          <button>💬 Comment</button>
          <button>🔄 Share</button>
        </div>
      </div>
    );
  };
  
  const renderLinkedInPreview = () => {
    return (
      <div className="linkedin-preview">
        <div className="preview-header">
          <div className="user-info">
            <div className="avatar"></div>
            <div>
              <div className="username">{productData.artisanName}</div>
              <div className="headline">Artisan at {productData.location}</div>
              <div className="time">2h</div>
            </div>
          </div>
          <div className="more-icon">⋯</div>
        </div>
        
        <div className="preview-content">
          <div className="caption">{content.caption}</div>
        </div>
        
        <div className="preview-image">
          <img src={imageUrl} alt={productData.title} />
        </div>
        
        <div className="preview-stats">
          <span>👍 45</span>
          <span>💬 8 comments</span>
        </div>
        
        <div className="preview-actions">
          <button>👍 Like</button>
          <button>💬 Comment</button>
          <button>🔄 Share</button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="post-preview">
      {platform === 'instagram' && renderInstagramPreview()}
      {platform === 'facebook' && renderFacebookPreview()}
      {platform === 'linkedin' && renderLinkedInPreview()}
      {(platform !== 'instagram' && platform !== 'facebook' && platform !== 'linkedin') && renderInstagramPreview()}
    </div>
  );
};

export default PostPreview;