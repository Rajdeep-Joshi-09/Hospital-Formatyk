import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const SpecialitiesPage = () => {
  const pageRef = useRef(null);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await api.get('/public/specialities');
        setSpecialities(response.data.result || []);
      } catch (error) {
        console.error('Error fetching specialities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialities();
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

  const getFallbackIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('cardio')) return 'favorite';
    if (lower.includes('neuro')) return 'psychology';
    if (lower.includes('ortho')) return 'accessibility_new';
    if (lower.includes('pedia')) return 'child_care';
    if (lower.includes('gastro')) return 'science';
    if (lower.includes('pulmo')) return 'respiratory_rate';
    if (lower.includes('onco')) return 'coronavirus';
    if (lower.includes('derma')) return 'face';
    if (lower.includes('eye') || lower.includes('ophthal')) return 'visibility';
    if (lower.includes('ent')) return 'hearing';
    return 'medical_services';
  };

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <section className="relative pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto text-center reveal active">
          <span className="inline-block bg-[#ac2b2e]/10 text-[#ac2b2e] px-4 py-2 rounded-full font-['Inter'] text-[14px] font-semibold mb-4">CENTERS OF EXCELLENCE</span>
          <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold mb-4 text-[#251817]">Medical Specialities</h1>
          <p className="font-['Inter'] text-[18px] text-[#59413f] max-w-2xl mx-auto">
            Focusing on excellence in clinical outcomes, LuxCare offers world-class expertise in specialized medical departments equipped with revolutionary technology.
          </p>
        </div>
      </section>

      {/* Specialities Grid */}
      <section className="py-12 px-6 mb-12 min-h-[400px]">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <span className="material-symbols-outlined animate-spin text-[#ac2b2e] text-4xl">autorenew</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialities.map((spec, i) => (
                <Link
                  key={spec.id}
                  to={`/specialities/${spec.id}`}
                  className="reveal group glass-card p-8 rounded-[24px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 block"
                  style={{ transitionDelay: `${(i % 6) * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-[#ffe9e7] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#ac2b2e] transition-colors overflow-hidden">
                    {spec.icon ? (
                      <img src={spec.icon} alt={spec.speciality} className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="material-symbols-outlined text-[#ac2b2e] group-hover:text-white text-3xl">
                        {getFallbackIcon(spec.speciality)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-['Playfair_Display'] text-[24px] font-semibold mb-3 text-[#251817] group-hover:text-[#ac2b2e] transition-colors">{spec.speciality}</h3>
                  <p className="font-['Inter'] text-[14px] text-[#59413f] mb-4 line-clamp-3">{spec.description || 'Providing state-of-the-art treatments and comprehensive care.'}</p>
                  <div className="flex items-center gap-2 text-[#ac2b2e] font-['Inter'] text-[14px] font-semibold">
                    Learn More
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-[#3c2d2c] rounded-[48px] p-12 text-center relative overflow-hidden reveal">
          <div className="relative z-10">
            <h2 className="font-['Playfair_Display'] text-[32px] font-semibold text-white mb-6">Take the First Step Towards Personalized Care</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8 font-['Inter'] text-[18px]">Our team of world-class experts is ready to support your health journey.</p>
            <Link to="/book-appointment" className="inline-block bg-[#D74A49] text-white px-12 py-4 rounded-xl font-['Inter'] text-[14px] font-semibold shadow-xl hover:scale-105 transition-transform">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecialitiesPage;
