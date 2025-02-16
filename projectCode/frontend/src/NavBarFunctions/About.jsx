import React, { useState } from 'react';
import './About.css';

const faqData = [
  {
    id: "item-1",
    question: "How do I register as a student, researcher, or admin?",
    answer: "You can register by clicking 'Sign Up' on the homepage and selecting your role."
  },
  {
    id: "item-2",
    question: "Can I modify or cancel my equipment reservations?",
    answer: "Yes. Log in to your dashboard, view your bookings, and use the 'Modify' or 'Cancel' options."
  },
  {
    id: "item-3",
    question: "How are bookings approved?",
    answer: "Bookings made by students or researchers are reviewed by admins. Approval status updates are visible on your dashboard."
  },
  {
    id: "item-4",
    question: "How can I search for available equipment?",
    answer: "Use the search bar on the 'Equipment' page. You can filter by category, availability, or name."
  },
  {
    id: "item-5",
    question: "Can multiple users book the same equipment?",
    answer: "No. The system prevents double bookings by ensuring that time slots are unique in the database."
  }
];

// Accordion Component
const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-section">
      {faqData.map((item, index) => (
        <div key={item.id} className="faq-item">
          <div
            className={`faq-question ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            {item.question}
            <span className="dropdown-icon">{activeIndex === index ? '▲' : '▼'}</span>
          </div>
          {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
        </div>
      ))}
    </div>
  );
};

// Main About Page Component
export default function About(){
  return (
    <div className="about-page">
      <div className="faq-container">
        <h1 className="faq-title">Frequently Asked Questions (FAQ)</h1>
        <Accordion />
      </div>
    </div>
  );
};
