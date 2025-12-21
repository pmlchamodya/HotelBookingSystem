import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Fetching services...');
        const response = await axios.get('http://localhost:5000/api/facilities');
        console.log('Services data:', response.data);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        color: '#333'
      }}>
        Our Services & Facilities
      </h1>
      
      {services.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p>No services available at the moment.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {services.map(service => (
            <div key={service._id} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                marginTop: 0, 
                color: '#007bff',
                borderBottom: '2px solid #f0f0f0',
                paddingBottom: '10px'
              }}>
                {service.name}
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>
                {service.description}
              </p>
              {service.features && service.features.length > 0 && (
                <div>
                  <h4 style={{ color: '#555', fontSize: '16px' }}>Features:</h4>
                  <ul style={{ paddingLeft: '20px', color: '#666' }}>
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ 
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid #f0f0f0',
                color: '#888',
                fontSize: '14px'
              }}>
                ⏰ {service.timings}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;