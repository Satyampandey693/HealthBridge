import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaComments,
  FaCalendarCheck,
  FaFlask,
  FaUserMd,
  FaShieldAlt,
  FaClock,
  FaVideo,
  FaStar,
} from "react-icons/fa";
import api from "../api/client.js";
import { useAuth } from "../store/auth.jsx";
import { PatientHome } from "./dashboard/PatientHome.jsx";
import { DoctorHome } from "./dashboard/DoctorHome.jsx";
import "./Home.css";

const services = [
  {
    icon: <FaComments />,
    title: "Talk to Doctors on Chat",
    desc: "Real-time, secure consultations with certified doctors — anytime, anywhere.",
  },
  {
    icon: <FaVideo />,
    title: "Video Consultations",
    desc: "Face-to-face video appointments with specialists from the comfort of home.",
  },
  {
    icon: <FaCalendarCheck />,
    title: "Book Appointments",
    desc: "Pick a slot that suits you and book a specialist in just a few clicks.",
  },
  {
    icon: <FaFlask />,
    title: "Lab Tests & Reports",
    desc: "Reserve lab slots and get your reports delivered straight to your account.",
  },
];

const features = [
  { icon: <FaClock />, title: "24/7 Availability", desc: "We're here for you whenever you need us — day or night." },
  { icon: <FaUserMd />, title: "Trusted Professionals", desc: "Every doctor and specialist on HealthBridge is verified." },
  { icon: <FaShieldAlt />, title: "Private & Secure", desc: "Your health data and conversations stay encrypted and confidential." },
];

export const Home = () => {
  const { role } = useAuth();
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    if (role) return; // dashboards fetch their own data
    api
      .get("/api/stats")
      .then(({ data }) => {
        setStats(data);
        if (data.testimonials?.length) {
          setTestimonials(
            data.testimonials.map((t) => ({
              name: t.name,
              text: t.comment,
              role: `on Dr. ${t.doctorName} · ${t.specialization}`,
            }))
          );
        }
      })
      .catch(() => {}); // landing page still renders without stats
  }, [role]);

  // Logged-in users get their role-specific dashboard, not the marketing page.
  if (role === "patient") return <PatientHome />;
  if (role === "doctor") return <DoctorHome />;

  const statItems = [
    { value: stats ? String(stats.doctors) : "—", label: "Verified Doctors" },
    { value: stats ? String(stats.specializations) : "—", label: "Specializations" },
    { value: stats ? String(stats.consultations) : "—", label: "Consultations" },
    { value: stats?.avgRating ? `${stats.avgRating}★` : "New", label: "Avg. Rating" },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="hb-container home-hero__inner">
          <div className="home-hero__content">
            <span className="home-hero__badge">🩺 Your health, simplified</span>
            <h1>
              Quality healthcare,<br />
              <span className="home-hero__highlight">anytime, anywhere.</span>
            </h1>
            <p>
              Connect with top doctors, book appointments, consult over chat or video,
              and manage your health records — all in one place.
            </p>
            <div className="home-hero__cta">
              <Link to="/signup" className="hb-btn hb-btn-primary">Get Started Free</Link>
              <Link to="/doctors" className="hb-btn hb-btn-outline">Find a Doctor</Link>
            </div>
          </div>
        </div>
        <div className="hb-container">
          <div className="home-stats">
            {statItems.map((s) => (
              <div key={s.label} className="home-stats__item">
                <span className="home-stats__value">{s.value}</span>
                <span className="home-stats__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="home-section">
        <div className="hb-container">
          <div className="home-section__head">
            <span className="hb-eyebrow">What we offer</span>
            <h2>Everything you need for better care</h2>
          </div>
          <div className="home-grid home-grid--4">
            {services.map((s) => (
              <div key={s.title} className="hb-card home-feature">
                <div className="home-feature__icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Why choose us */}
      <section className="home-section home-section--alt">
        <div className="hb-container">
          <div className="home-section__head">
            <span className="hb-eyebrow">Why HealthBridge</span>
            <h2>Care you can trust</h2>
          </div>
          <div className="home-grid home-grid--3">
            {features.map((f) => (
              <div key={f.title} className="hb-card home-feature">
                <div className="home-feature__icon home-feature__icon--accent">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — only shown when real patient reviews exist */}
      {testimonials.length > 0 && (
      <section className="home-section">
        <div className="hb-container">
          <div className="home-section__head">
            <span className="hb-eyebrow">Loved by patients</span>
            <h2>What our patients say</h2>
          </div>
          <div className="home-grid home-grid--2">
            {testimonials.map((t) => (
              <div key={t.name} className="hb-card home-testimonial">
                <div className="home-testimonial__stars">
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p>“{t.text}”</p>
                <div className="home-testimonial__author">
                  <div className="home-testimonial__avatar">{t.name.charAt(0)}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Final CTA */}
      <section className="home-cta">
        <div className="hb-container home-cta__inner">
          <h2>Ready to take charge of your health?</h2>
          <p>Join thousands who trust HealthBridge for accessible, professional care.</p>
          <Link to="/signup" className="hb-btn hb-btn-primary">Create your free account</Link>
        </div>
      </section>
    </div>
  );
};
