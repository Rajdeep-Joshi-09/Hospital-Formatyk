import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const doctors = [
  {
    slug: 'dr-arthur-sterling',
    name: 'Dr. Arthur Sterling',
    specialty: 'Internal Medicine',
    desc: 'Specializing in longevity science and complex diagnostic evaluations for executive health.',
    exp: '25+ Years Exp',
    rating: '5.0',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR81ZOGtXgMF1OTJa49LzxZ9Omjv8ZFWhiZDUbysLEBMeWJlsgvElAurZ6AFXV_qhefVYTt5k-H73gvbTL00Yu1A-kNY4Bzw5cT6YTbihbNCJLy1i9n8E4XsPt8LrZna_LQzZ-lh1ocW_646cl832BiB06Yk7fvBVgGqzNhXRcBvEIFh6ybJYeTYX0HCba-N9WcRmjl8zcxj7C66IISWKGTGZkAh30I31rxlFaxCeE5XeI8JHkdEXkNA',
  },
  {
    slug: 'dr-elena-vance',
    name: 'Dr. Elena Vance',
    specialty: 'Neurosurgery',
    desc: 'A pioneer in minimally invasive cranial procedures and neuro-regenerative therapies.',
    exp: '18+ Years Exp',
    rating: '5.0',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFImE0TqudKxB7W5z0a2Ks8jFjrx2kPzh-43tuJNyAjTEjJAM5KgX1sNAiDpLzQzrTNOlXrWNBTY9s3t081bF8IxDkYBopQQgh2l1-0j27FJ57L6MfXnYihYG8SJF2BrYbSry3Pve0nrIkxxd2UmxS7Cvcu7f1VS5tvj2tSF7k6GlpZtXy5_IkhSmQPANSG9r460ZlfoMUebvOyJuAya1_-h3aMxnXQ-sAM1MSwBQvPRAX9UpqbQuJyg',
  },
  {
    slug: 'dr-sarah-chen',
    name: 'Dr. Sarah Chen',
    specialty: 'Pediatrics',
    desc: 'Focused on holistic child development and integrated wellness for the next generation.',
    exp: '12+ Years Exp',
    rating: '5.0',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl1z4En7sJZEvKSFc_vEUFqjacQgF7RTzFZIGZaWWTLw9QIc8CccOcUWmh3p96Q2eeGk-Jy4buR3MKG562OF7HbACaYJ8vh5FFs5-jH-AmqKmTbVXucapVgd3A9F43mCCSoPosSMfnniB3nMm93lSsl94QnigSlV25UNX4C1BF8IGCoFHMnq4ey-2nLoMS3SVD4R9vCVNR3wN0ZJoNl89E0nSMJM4VwZBJR9m73LEK0vcOuXUekTtiGQ',
  },
  {
    slug: 'dr-julian-rossi',
    name: 'Dr. Julian Rossi',
    specialty: 'Cardiology',
    desc: 'Expert in preventive cardiology and precision heart health utilizing advanced AI imaging.',
    exp: '15+ Years Exp',
    rating: '4.9',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_dw-_OlrKH2_1NhnXrYMF5-zlM-XJJzcub4qCFynw_RJW2TekLyf37U07W3leaULNwpukFhxw0X1irCOyA6wF-dOSO9EWKbc-geiWm2mhy1ShcfmGkh92qr8w_Ru-TjeDzcCfIg2VXvnkej9OgR1Oo7gSeIoOrsOYD6blk9_wa4oifyMqUuq2BPPB2L5XSbEzxJp_TYR_f_xVc7HGbCFlir2v6ihwrTWoiLVisnMqmHKPDfAoOnvYew',
  },
];

const ExpertsPage = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef}>
      {/* Hero Section */}
      <section className="relative pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto text-center reveal active">
          <span className="inline-block bg-[#ac2b2e]/10 text-[#ac2b2e] px-4 py-2 rounded-full font-['Inter'] text-[14px] font-semibold mb-4">WORLD-CLASS CARE</span>
          <h1 className="font-['Playfair_Display'] text-[32px] md:text-[64px] font-bold mb-4 text-[#251817]">Meet Our Medical Experts</h1>
          <p className="font-['Inter'] text-[18px] text-[#59413f] max-w-2xl mx-auto opacity-80">
            A curated assembly of world-renowned specialists dedicated to the art and science of personalized luxury healthcare.
          </p>
        </div>
      </section>

      {/* Doctors Grid Section */}
      <section className="py-8 px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc, i) => (
              <div
                key={doc.slug}
                className="reveal group bg-white rounded-[24px] border border-[#E7E7E7] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.06)]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative h-[300px] sm:h-[400px] overflow-hidden">
                  <img alt={doc.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]" src={doc.img} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-yellow-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-['Inter'] text-[14px] font-semibold text-[#251817]">{doc.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-[#ac2b2e]/90 backdrop-blur-md text-white text-[12px] px-3 py-1 rounded-full font-['Inter'] font-semibold uppercase tracking-wider">{doc.exp}</span>
                  </div>
                </div>
                <div className="p-8">
                  <span className="text-[#ac2b2e] font-['Inter'] text-[11px] font-semibold uppercase tracking-widest mb-1 block">{doc.specialty}</span>
                  <h3 className="font-['Playfair_Display'] text-[24px] font-semibold text-[#251817] mb-2">{doc.name}</h3>
                  <p className="font-['Inter'] text-[16px] text-[#59413f] line-clamp-2 mb-4 opacity-70">{doc.desc}</p>
                  <Link
                    to={`/experts/${doc.slug}`}
                    className="block w-full bg-[#D74A49] text-white py-3 rounded-xl font-['Inter'] text-[14px] font-semibold text-center transition-all hover:bg-[#ac2b2e] active:scale-95"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[40px] overflow-hidden bg-[#3c2d2c] p-8 md:p-20 text-center reveal">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ac2b2e]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00685c]/10 rounded-full blur-[100px]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold text-white mb-6">Looking for the Right Specialist?</h2>
              <p className="font-['Inter'] text-[18px] text-white/70 mb-8">
                Our concierge team is available 24/7 to help match you with the perfect medical expert for your unique health requirements.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <Link to="/book-appointment" className="w-full md:w-auto bg-[#D74A49] text-white px-12 py-5 rounded-full font-['Inter'] text-[14px] font-semibold text-lg hover:shadow-[0_10px_30px_rgba(215,74,73,0.3)] transition-all hover:-translate-y-1">
                  Book Appointment
                </Link>
                <Link to="/contact" className="w-full md:w-auto bg-transparent border border-white/20 text-white px-12 py-5 rounded-full font-['Inter'] text-[14px] font-semibold text-lg hover:bg-white/10 transition-all">
                  Speak to Concierge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertsPage;
