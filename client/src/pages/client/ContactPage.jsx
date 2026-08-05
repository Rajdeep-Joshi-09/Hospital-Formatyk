import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const pageRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div ref={pageRef}>
      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="max-w-3xl reveal active">
          <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold text-[#251817] mb-4">Contact Us</h1>
          <p className="font-['Inter'] text-[18px] text-[#59413f] leading-relaxed">
            We're here to help. Whether you have a question, need assistance, or want to book an appointment, our team is ready to assist you.
          </p>
        </div>
      </header>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Details */}
        <div className="lg:col-span-5 space-y-6 reveal" style={{ transitionDelay: '100ms' }}>
          {[
            {
              icon: 'location_on',
              label: 'Hospital Address',
              value: '1200 Mayfair Crescent, London, W1K 7LU',
              sub: null,
            },
            {
              icon: 'call',
              label: 'Phone & Hotline',
              value: '+44 20 7946 0123',
              sub: 'General Inquiries & Bookings',
            },
            {
              icon: 'mail',
              label: 'Email Address',
              value: 'care@luxcare.com',
              sub: 'Response within 24 hours',
            },
            {
              icon: 'schedule',
              label: 'Working Hours',
              value: 'Mon – Sat: 8:00 AM – 8:00 PM',
              sub: 'Emergency: 24/7',
            },
          ].map((item) => (
            <div key={item.label} className="glass-card p-6 rounded-[24px] flex items-start gap-6 transition-all hover:border-[#ac2b2e]/20">
              <div className="bg-[#ffdad7] text-[#ac2b2e] p-4 rounded-xl">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <div>
                <h3 className="font-['Inter'] text-[14px] font-semibold text-[#ac2b2e] uppercase mb-1 tracking-widest">{item.label}</h3>
                <p className="font-['Playfair_Display'] text-[20px] md:text-[24px] font-semibold text-[#251817]">{item.value}</p>
                {item.sub && <p className="font-['Inter'] text-[16px] text-[#59413f]">{item.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 reveal" style={{ transitionDelay: '200ms' }}>
          <div className="glass-card p-8 md:p-12 rounded-[32px]">
            <h2 className="font-['Playfair_Display'] text-[32px] font-semibold mb-2">Send Us a Message</h2>
            <p className="font-['Inter'] text-[16px] text-[#59413f] mb-8">Fill out the form below and we'll respond within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e0bfbc] bg-white focus:border-[#ac2b2e] focus:ring-2 focus:ring-[#ac2b2e]/10 transition-all font-['Inter'] text-[16px]"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e0bfbc] bg-white focus:border-[#ac2b2e] focus:ring-2 focus:ring-[#ac2b2e]/10 transition-all font-['Inter'] text-[16px]"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e0bfbc] bg-white focus:border-[#ac2b2e] focus:ring-2 focus:ring-[#ac2b2e]/10 transition-all font-['Inter'] text-[16px]"
                    placeholder="+44 20 7946 0123"
                  />
                </div>
                <div>
                  <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e0bfbc] bg-white focus:border-[#ac2b2e] focus:ring-2 focus:ring-[#ac2b2e]/10 transition-all font-['Inter'] text-[16px]"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="appointment">Book Appointment</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0bfbc] bg-white focus:border-[#ac2b2e] focus:ring-2 focus:ring-[#ac2b2e]/10 transition-all font-['Inter'] text-[16px] resize-none"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto bg-[#D74A49] text-white px-12 py-4 rounded-xl font-['Inter'] text-[14px] font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto reveal">
          <div className="rounded-[32px] overflow-hidden shadow-lg h-[300px] md:h-[400px] bg-[#ffe9e7] flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-[#ac2b2e] mb-4" style={{ fontSize: '48px' }}>map</span>
              <p className="font-['Playfair_Display'] text-[24px] font-semibold text-[#251817]">1200 Mayfair Crescent, London</p>
              <p className="font-['Inter'] text-[14px] text-[#59413f]">W1K 7LU, United Kingdom</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
