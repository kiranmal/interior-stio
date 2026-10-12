import { contact } from '../data/content.js';

export default function WhatsAppButton() {
  const message = encodeURIComponent('Hello Ivy Interio, I want to discuss my interior project.');

  return (
    <a
      className="wa"
      href={`https://wa.me/91${contact.whatsapp}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Ivy Interio on WhatsApp"
    >
      <span>◔</span>
    </a>
  );
}
