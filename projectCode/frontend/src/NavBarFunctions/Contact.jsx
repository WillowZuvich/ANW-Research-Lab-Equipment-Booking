import React, { useState, useEffect } from 'react';
import './Contact.css'; // Ensure the CSS styles remain consistent

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  useEffect(() => {
    // Extract the 'reason' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const reasonFromURL = urlParams.get("reason");
  
    // Set the reason in state if it exists
    if (reasonFromURL) {
      setSelectedReason(reasonFromURL);
    }
  }, []);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const formActionURL = `https://docs.google.com/forms/.../formResponse`;

    const data = new FormData();
    data.append('entry.1234567890', event.target.user_name.value);  // For Name
    data.append('entry.1234567890', event.target.user_email.value); // For Email Address
    data.append('entry.1234567890', event.target.user_phone.value); // For Phone Number
    data.append('entry.1234567890', event.target.contact_reason.value); 
    data.append('entry.1234567890', event.target.message.value);    // For Message

    fetch(formActionURL, {
      method: 'POST',
      mode: 'no-cors',  // 'no-cors' allows submission without a response from Google
      body: data
    })
      .then(() => {
        setLoading(false);
        setSuccess(true);

         // Reset the form after 5 seconds
        setTimeout(() => {
          setSuccess(false); // Hide success message
          event.target.reset(); // Reset the form fields
        }, 5000);  // Adjust this timeout value to control the delay
      })
      .catch(() => {
        setLoading(false);
        alert('The form service is temporarily unavailable.');
      });
  };

  return (
    <section id="contact">
      <div className="section__container">
        <div className="section__row">
          <div className="contact__wrapper">
            {/* Left Side - Static Info */}
            <div className="contact__half contact__left">
              <h3 className="contact__title">Contact us!</h3>
              <p className="contact__para">
                Have questions or suggestions?
                <br />
                Please fill in this form to let our team know.
                <br />
                We highly value your input.
              </p>
            </div>

            {/* Right Side - Form */}
            <div className="contact__half contact__right">
              <form onSubmit={handleSubmit} id="contact__form">
                <div className="form__item">
                  <label className="form__item--label">Name*</label>
                  <input
                    type="text"
                    className="input"
                    name="user_name"
                    required
                  />
                </div>
                <div className="form__item">
                  <label className="form__item--label">Email Address*</label>
                  <input
                    type="email"
                    className="input"
                    name="user_email"
                    required
                  />
                </div>
                <div className="form__item">
                  <label className="form__item--label">Phone Number*</label>
                  <input
                    type="text"
                    className="input"
                    name="user_phone"
                    required
                  />
                </div>
                <div className="form__item">
                  <label className="form__item--label">
                    Reason for Contacting Us*
                  </label>
                  <select className="input" name="contact_reason" required
                      value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
                    <option value="" disabled> Select an option </option>
                    <option value="Education & Mentorship"> Education & Mentorship </option>
                    <option value="Research Involvement">Research Involvement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form__item">
                  <label className="form__item--label">Message*</label>
                  <textarea
                    className="input"
                    name="message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  id="contact__submit"
                  className="form__submit"
                >
                  Submit
                </button>
              </form>

              {/* Conditionally render loading or success overlay */}
              {loading && (
                <div className="contact__overlay contact__overlay--loading contact__overlay--visible">
                  <i className="fas fa-spinner"></i>
                </div>
              )}

              {success && (
                <div className="contact__overlay contact__overlay--success contact__overlay--visible">
                  <h1>
                    Thank you for the message!
                    <br /> I hope you have a nice day!
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};