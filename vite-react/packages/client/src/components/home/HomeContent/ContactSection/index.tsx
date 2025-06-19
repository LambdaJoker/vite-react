import { FC, memo } from 'react';
import { contacts } from './contactData.tsx';
import { Link } from 'react-router-dom';

const ContactSection: FC = () => {
  return (
    <section className="contact-section">
      <h2>联系我</h2>
      <div className="contact-grid">
        {contacts.map((contact) => (
          <div className="contact-card" key={contact.title}>
            <div className="contact-icon">{contact.icon}</div>
            <h3>{contact.title}</h3>
            <p>{contact.content}</p>
            <a href={contact.link} className="contact-link" target={contact.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
              {contact.linkText}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(ContactSection); 