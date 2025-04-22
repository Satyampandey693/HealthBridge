import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Custom CSS for styling

export const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to HealthBridge</h1>
          <p>Your Health, Our Priority. Connect with top Doctors and get professional care anytime, anywhere.</p>
          <Link to="/signup" className="cta-button">Explore Services</Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-container">
          <div className="service-card">
            <h3>Talk to Doctors on Chat</h3>
            <p>Get real-time consultations with certified doctors through secure chat.</p>
          </div>
          <div className="service-card">
            <h3>Book Appointments</h3>
            <p>Easily book appointments with specialists at your convenience.</p>
          </div>
          <div className="service-card">
            <h3>Take Slots for Lab Tests</h3>
            <p>Reserve time slots for lab tests and get results delivered to your account.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-container">
          <div className="feature-item">
            <h3>24/7 Availability</h3>
            <p>We are here for you, whenever you need us.</p>
          </div>
          <div className="feature-item">
            <h3>Trusted Professionals</h3>
            <p>All doctors and specialists are verified and trusted.</p>
          </div>
          <div className="feature-item">
            <h3>Easy Access</h3>
            <p>Get access to healthcare from the comfort of your home.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Patients Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>"The telemedicine service saved me so much time! The doctor was friendly and professional." - Sarah</p>
          </div>
          <div className="testimonial-card">
            <p>"I loved the ease of booking my lab tests online. I got my results quickly!" - John</p>
          </div>
        </div>
      </section>
    </div>
  );
};