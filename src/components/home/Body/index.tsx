import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

// 服务项的类型
interface Service {
  title: string;
  description: string;
  icon: string;
}

const Body: React.FC = () => {
  const services: Service[] = [
    {
      title: 'Web Development',
      description: 'Build fast, responsive, and scalable websites.',
      icon: '🖥️',
    },
    {
      title: 'SEO Optimization',
      description: 'Boost your website’s ranking and visibility.',
      icon: '📈',
    },
    {
      title: 'Digital Marketing',
      description: 'Reach a wider audience with digital marketing strategies.',
      icon: '📣',
    },
  ];

  return (
    <div className="container-body">
      <div>
        {/* Hero Section */}
        <div className="hero">
          <h1>Welcome to Our Website!</h1>
          <p>Your journey to discover amazing content starts here.</p>
          <Link to="/portfolio" className="btn">Explore Portfolio</Link>
        </div>

        {/* Services Section */}
        <div className="services">
          <h2>Our Services</h2>
          <div className="service-cards">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <span className="service-icon">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials">
          <h2>What Our Clients Say</h2>
          <div className="testimonial">
            <p>"Amazing service, will definitely work with them again!"</p>
            <h4>- Client Name</h4>
          </div>
          <div className="testimonial">
            <p>"Professional and reliable, highly recommended!"</p>
            <h4>- Client Name</h4>
          </div>
        </div>


        <div className="about">
          <h2>About Us</h2>
          <p>We are a passionate team dedicated to providing the best web solutions.</p>
          <Link to="/about" className="btn">Learn More</Link>
        </div>

        <div className="cta">
          <h2>Get in Touch with Us Today</h2>
          <p>We're ready to help you with your project. Contact us now!</p>
          <Link to="/contact" className="btn">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default Body;
