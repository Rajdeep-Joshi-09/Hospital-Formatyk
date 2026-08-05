import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const ExpertsPage = () => {
  const pageRef = useRef(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/public/doctors');
        setDoctors(response.data.result || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = pageRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

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
      <section className="py-8 px-6 mb-20 min-h-[400px]">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <span className="material-symbols-outlined animate-spin text-[#ac2b2e] text-4xl">autorenew</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doc, i) => (
                <div
                  key={doc.id}
                  className="reveal group bg-white rounded-[24px] border border-[#E7E7E7] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.06)]"
                  style={{ transitionDelay: `${(i % 4) * 100}ms` }}
                >
                  <div className="relative h-[300px] sm:h-[400px] overflow-hidden bg-gray-100">
                    {doc.image ? (
                      <img alt={doc.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]" src={doc.image} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#ac2b2e]/20 transition-transform duration-700 group-hover:scale-[1.08]">
                        <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>medical_services</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-yellow-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-['Inter'] text-[14px] font-semibold text-[#251817]">5.0</span>
                    </div>
                    {doc.yearOfExp && (
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-[#ac2b2e]/90 backdrop-blur-md text-white text-[12px] px-3 py-1 rounded-full font-['Inter'] font-semibold uppercase tracking-wider">{doc.yearOfExp}+ Years Exp</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <span className="text-[#ac2b2e] font-['Inter'] text-[11px] font-semibold uppercase tracking-widest mb-1 block line-clamp-1">
                      {doc.expertiesMaster?.expertyType || 'General Medicine'}
                    </span>
                    <h3 className="font-['Playfair_Display'] text-[24px] font-semibold text-[#251817] mb-2">{doc.name}</h3>
                    <p className="font-['Inter'] text-[16px] text-[#59413f] line-clamp-2 mb-4 opacity-70">{doc.description}</p>
                    <Link
                      to={`/experts/${doc.id}`}
                      className="block w-full bg-[#D74A49] text-white py-3 rounded-xl font-['Inter'] text-[14px] font-semibold text-center transition-all hover:bg-[#ac2b2e] active:scale-95"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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
