import React, { useState } from 'react';
import GoogleCloudSocialMediaGenerator from './components/GoogleCloudSocialMediaGenerator';

function App() {
  // Sample product data for the demo
  const [productData] = useState({
    id: 'p001',
    title: 'Handcrafted Terracotta Pottery',
    description: 'Traditional hand-painted terracotta pot made with ancient techniques passed down through generations. Each piece is uniquely crafted and features intricate Rajasthani patterns.',
    category: 'pottery',
    price: 1200,
    artisanName: 'Sunita Devi',
    location: 'Jaipur, Rajasthan'
  });
  
  return (
    <div className="app">
      <GoogleCloudSocialMediaGenerator productData={productData} />
    </div>
  );
}

export default App;
