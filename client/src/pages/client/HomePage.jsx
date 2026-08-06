import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const HomePage = () => {
  const pageRef = useRef(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/public/reviews');
        setReviews(response.data.result || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            const countEl = entry.target.querySelector('[data-count]');
            if (countEl && !countEl.dataset.animated) {
              countEl.dataset.animated = 'true';
              animateValue(countEl, 0, parseInt(countEl.getAttribute('data-count')), 2000);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = pageRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const suffix = obj.textContent.includes('+') ? '+' : '';
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = Math.floor(progress * (end - start) + start);
      obj.textContent = val.toLocaleString() + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };

  return (
    <div ref={pageRef}>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="reveal active">
            <div className="inline-flex items-center gap-2 bg-[#fce2e0] px-4 py-2 rounded-full mb-1">
              <span className="material-symbols-outlined text-[#ac2b2e] text-[16px]">verified_user</span>
              <span className="font-['Inter'] text-[14px] font-semibold text-[#251817]">Trusted by 10,000+ Patients</span>
            </div>
            <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold leading-tight tracking-[-0.02em] mt-4">
              Precision Care, <br />
              <span className="text-[#ac2b2e]">Personal Connection.</span>
            </h1>
            <p className="font-['Inter'] text-[18px] text-[#59413f] max-w-[36rem] mb-4 mt-4 leading-relaxed">
              Experience world-class medical expertise paired with compassionate care in an environment designed for your healing and comfort.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/book-appointment"
                className="bg-[#D74A49] text-white px-8 py-4 rounded-xl font-['Inter'] text-[14px] font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Book Appointment
              </Link>
              <Link
                to="/specialities"
                className="border border-[#111111] text-[#111111] px-8 py-4 rounded-xl font-['Inter'] text-[14px] font-semibold hover:bg-[#e5e2e1] transition-all"
              >
                Explore Services
              </Link>
            </div>
          </div>
          <div className="relative reveal active" style={{ transitionDelay: '200ms' }}>
            <div className="rounded-[24px] overflow-hidden shadow-2xl border-4 border-white">
              <img
                alt="LuxCare Environment"
                className="w-full h-auto object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQeoPFSGkjGnoQpTVSUY0uNToYiq3NDfSDPhcwfngxAbtnAbPpYvZ4-Y-MhnL_uhtLfAKhYqBXjp7-7qXOlLMI0tP2ScIqe_MYNp6rgicZ0floqWSv4YpUIgdKOaOkDi30J5OYIkR4_fV5-mkK2p0HOlZsz9WJKD9sq8aisX8REKb3sbc3fFqHi6DuoJ2TPdZvQpoXk6v1_0OSARu5HNkP0H4WnbQXE6roFu32HzHAk5g7R2r0_BUc8A"
              />
            </div>
            {/* Floating Wellness Card */}
            <div className="absolute -bottom-8 -left-8 glass-nav bg-white/40 p-6 rounded-[24px] border border-white/60 shadow-xl max-w-[240px] hidden sm:block">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#ac2b2e] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">volunteer_activism</span>
                </div>
                <p className="font-['Inter'] text-[14px] font-semibold text-[#251817]">Patient Care</p>
              </div>
              <p className="font-['Inter'] text-[12px] text-[#59413f]">24/7 dedicated support for all medical departments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-[#fff0ef]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
            {[
              { count: '20000', label: 'Patients Treated', display: '20,000+' },
              { count: '150', label: 'Doctors', display: '150+' },
              { count: '35', label: 'Specialities', display: '35+' },
              { count: '25', label: 'Years Experience', display: '25+' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="reveal bg-white p-8 rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#e0bfbc] text-center"
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                <p className="font-['Playfair_Display'] text-[32px] font-semibold text-[#ac2b2e] mb-1" data-count={stat.count}>
                  {stat.display}
                </p>
                <p className="font-['Inter'] text-[14px] font-semibold text-[#59413f]">{stat.label}</p>
              </div>
            ))}
            <div className="reveal bg-white p-8 rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#e0bfbc] text-center" style={{ transitionDelay: '500ms' }}>
              <span className="material-symbols-outlined text-[#ac2b2e] mb-1" style={{ fontSize: '32px' }}>verified</span>
              <p className="font-['Inter'] text-[14px] font-semibold text-[#59413f]">ISO Certified Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Process Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <h2 className="font-['Playfair_Display'] text-[32px] font-semibold mb-4">Book an Appointment in 4 Easy Steps</h2>
            <p className="text-[#59413f] max-w-2xl mx-auto font-['Inter']">Seamlessly manage your healthcare journey with our streamlined booking process designed for your convenience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'person_search', num: '01', title: 'Find Your Doctor', desc: 'Browse through our directory of world-class specialists across all departments.', offset: false },
              { icon: 'calendar_month', num: '02', title: 'Choose Date & Time', desc: 'Select a slot that fits your schedule from our real-time availability calendar.', offset: true },
              { icon: 'task_alt', num: '03', title: 'Confirm Appointment', desc: "Review details and finalize your booking. You'll receive instant SMS confirmation.", offset: false },
              { icon: 'local_hospital', num: '04', title: 'Visit Hospital', desc: 'Arrive at your scheduled time and experience seamless medical check-in.', offset: true },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`reveal bg-white p-8 rounded-[24px] shadow-sm border border-[#e0bfbc] relative group hover:shadow-xl transition-all ${step.offset ? 'lg:mt-12' : ''}`}
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-[#fce2e0] flex items-center justify-center mb-6 group-hover:bg-[#ac2b2e] transition-colors">
                  <span className="material-symbols-outlined text-[#ac2b2e] group-hover:text-white" style={{ fontSize: '32px' }}>{step.icon}</span>
                </div>
                <span className="absolute top-8 right-8 text-[48px] font-bold text-[#ac2b2e]/10 font-['Playfair_Display']">{step.num}</span>
                <h3 className="font-['Playfair_Display'] text-[24px] font-semibold mb-2">{step.title}</h3>
                <p className="font-['Inter'] text-[12px] text-[#59413f]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#ffe9e7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: 'groups', title: 'Experienced Specialists', desc: 'Our team includes globally recognized doctors and researchers.' },
                { icon: 'precision_manufacturing', title: 'Advanced Technology', desc: 'Equipped with the latest robotic surgery and diagnostic tools.' },
                { icon: 'support_agent', title: '24/7 Patient Support', desc: 'Dedicated concierge service for every stage of your recovery.' },
                { icon: 'healing', title: 'Personalized Treatment', desc: 'Tailored medical plans built around your specific health needs.' },
              ].map((item, i) => (
                <div key={item.title} className="reveal bg-white p-8 rounded-[24px] shadow-sm" style={{ transitionDelay: `${(i + 1) * 100}ms` }}>
                  <span className="material-symbols-outlined text-[#ac2b2e] mb-4" style={{ fontSize: '32px' }}>{item.icon}</span>
                  <h4 className="font-['Playfair_Display'] text-[24px] font-semibold mb-2">{item.title}</h4>
                  <p className="font-['Inter'] text-[12px] text-[#59413f]">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2 reveal">
              <h2 className="font-['Playfair_Display'] text-[32px] font-semibold mb-6">A New Standard in Modern Medical Care</h2>
              <p className="font-['Inter'] text-[18px] text-[#59413f] mb-8">
                At LuxCare, we combine cutting-edge technology with a human-centric approach. Our facility is designed to reduce stress and promote faster recovery through integrated wellness practices.
              </p>
              <div className="rounded-[24px] overflow-hidden shadow-2xl">
                <div
                  className="bg-cover bg-center w-full h-[300px] md:h-[400px]"
                  style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCgu27QTyEYg6FIscpj8bgxkiGKRtIgVuJYAaQCA3VgKGHbk4M-bTX3V-ih9d5b1_w1uCZ-S3zy8joRaYdmsHWG4hlseNrqfRHEAbSbwwiiBsON6gEf0rOq2W3hjXXEqFsAtEFtxsOlo9oBvmL2-8-vMs6jBjIt3KywjByGahTPy5vPLIfcrhUn4jgKnxMVs8xGjyAS-MS2aVK6zMVUUmwYJSpAMJ2R6jw6RK3eUrEC3vD8jsgBBH3qbw')",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <h2 className="font-['Playfair_Display'] text-[32px] font-semibold">Voices of Recovery</h2>
          </div>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.slice(0, 3).map((review, idx) => (
                <div key={review.id} className="reveal" style={{ transitionDelay: `${(idx + 1) * 100}ms` }}>
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#e0bfbc] text-center h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[#ac2b2e]" style={{ fontVariationSettings: i < review.ratings ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        ))}
                      </div>
                      <p className="font-['Playfair_Display'] text-[18px] font-semibold italic mb-6 text-[#59413f]">
                        "{review.reviewDescription}"
                      </p>
                    </div>
                    <div>
                      <p className="font-['Inter'] text-[14px] font-semibold text-[#ac2b2e]">{review.patient?.name}</p>
                      <p className="font-['Inter'] text-[12px] text-[#5f5e5e]">Patient of Dr. {review.doctor?.name.split(' ')[1] || review.doctor?.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[#59413f] font-['Inter']">No reviews found.</div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto rounded-[40px] overflow-hidden relative min-h-[400px] flex items-center justify-center text-center reveal">
          <div className="absolute inset-0 z-0">
            <div
              className="bg-cover bg-center w-full h-full"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqla9YTlsEG5Ftg7Ewg5mFwz0roY5qsXbNAn2Ea8BrouwxFreijb4h0rU7ut67HnyTi-JriK2iNmT-qnSnTq7_VkuQ3nODMmhmeFJSGaoUoFsT-H1pZ7CgqZkR2WD4eAECyNlaLKAjcHQQsaCJGl9Mt7d9Nu-z4n_DNUDhlvfx7uk4VPk91UatrzPRFZlZhzHa2ABt6m8EbczNXDcvPHeUOawn2N1ilrIrERZV3_D_PH_PxNVPRaVUQA')",
              }}
            />
            <div className="absolute inset-0 bg-[#ac2b2e]/80 mix-blend-multiply" />
          </div>
          <div className="relative z-10 px-6 py-12 max-w-2xl">
            <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold text-white mb-6">Your Health Deserves the Best Care</h2>
            <p className="text-white/90 font-['Inter'] text-[18px] mb-8">Join the thousands who have chosen LuxCare for their health and wellness needs. Book your consultation today.</p>
            <Link
              to="/book-appointment"
              className="inline-block bg-white text-[#ac2b2e] px-12 py-4 rounded-xl font-['Inter'] text-[14px] font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
