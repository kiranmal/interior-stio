import { contact } from '../data/content.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h3>Ivy Interio</h3>
            <p style={{ marginTop: 10, maxWidth: 380 }}>
              Inspired by Living. Thoughtful interior design and execution for
              homes, offices and commercial spaces.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#calculator">Cost Calculator</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={`tel:+91${contact.phone}`}>+91 {contact.phone}</a></li>
              <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
              <li>{contact.address[0]}</li>
              <li>{contact.address[1]}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ivy Interio. All rights reserved.</span>
          <span>{contact.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
