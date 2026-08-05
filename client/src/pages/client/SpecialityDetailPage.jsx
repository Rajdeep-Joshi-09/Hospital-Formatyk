import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';

const SpecialityDetailPage = () => {
  const { id } = useParams();
  const pageRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSpeciality = async () => {
      try {
        const response = await api.get(`/public/specialities/${id}`);
        setData(response.data.result);
      } catch (error) {
        console.error('Error fetching speciality:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpeciality();
  }, [id]);

  useEffect(() => {
    if (loading || !data) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, data]);

  const getFallbackIcon = (name) => {
    if (!name) return 'medical_services';
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[#ac2b2e] text-4xl">autorenew</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div ref={pageRef}>
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <Link to="/specialities" className="inline-flex items-center gap-2 text-[#ac2b2e] font-['Inter'] text-[14px] font-semibold mb-6 hover:underline">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Specialities
          </Link>
        </section>
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-8 text-center reveal active">
          <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold mb-4">Speciality Not Found</h1>
        </section>
      </div>
    );
  }

  return (
    <div ref={pageRef}>
      {/* Back link */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-4">
        <Link to="/specialities" className="inline-flex items-center gap-2 text-[#ac2b2e] font-['Inter'] text-[14px] font-semibold hover:underline reveal active">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Specialities
        </Link>
      </section>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-8 text-center reveal active">
        <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold mb-4">{data.speciality}</h1>
        <p className="font-['Inter'] text-[18px] text-[#59413f] max-w-2xl mx-auto">
          Center of Excellence for {data.speciality}
        </p>
      </section>

      {/* Specialty Overview */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative group reveal">
          <div className="absolute inset-0 bg-[#ac2b2e]/5 rounded-[24px] -rotate-3 scale-105 group-hover:rotate-0 transition-transform duration-700" />
          <div className="relative w-full aspect-[4/3] rounded-[24px] shadow-lg border border-[#e0bfbc]/30 bg-gray-100 flex items-center justify-center">
            {data.icon ? (
              <img className="w-full h-full object-cover rounded-[24px]" alt={data.speciality} src={data.icon} />
            ) : (
              <span className="material-symbols-outlined text-[#ac2b2e]/20" style={{ fontSize: '120px' }}>
                {getFallbackIcon(data.speciality)}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-8 reveal" style={{ transitionDelay: '200ms' }}>
          <div className="space-y-4">
            <h2 className="font-['Playfair_Display'] text-[32px] font-semibold text-[#ac2b2e]">{data.treatmentType?.treatType || 'Specialized Care'}</h2>
            <p className="font-['Inter'] text-[16px] text-[#59413f] leading-relaxed">{data.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="font-['Inter'] text-[14px] font-semibold text-[#ac2b2e] uppercase tracking-wider">Expertise</span>
              <ul className="space-y-1 font-['Inter'] text-[16px]">
                <li className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-[#ac2b2e]">check_circle</span> Advanced Diagnostics
                </li>
                <li className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-[#ac2b2e]">check_circle</span> Targeted Treatments
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="font-['Inter'] text-[14px] font-semibold text-[#ac2b2e] uppercase tracking-wider">Advanced Methods</span>
              <ul className="space-y-1 font-['Inter'] text-[16px]">
                <li className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-[#ac2b2e]">check_circle</span> AI Diagnostics
                </li>
                <li className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-[#ac2b2e]">check_circle</span> Minimally Invasive
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-8 py-4 border-y border-[#e0bfbc]/20">
            {data.experience && (
              <div>
                <div className="font-['Playfair_Display'] text-[32px] font-semibold text-[#ac2b2e]">{data.experience}+</div>
                <div className="font-['Inter'] text-[14px] font-semibold text-[#59413f]">Years Experience</div>
              </div>
            )}
            <div>
              <div className="font-['Playfair_Display'] text-[32px] font-semibold text-[#ac2b2e]">Excellence</div>
              <div className="font-['Inter'] text-[14px] font-semibold text-[#59413f]">In Patient Care</div>
            </div>
          </div>
          <Link to="/book-appointment" className="inline-block bg-[#ac2b2e] text-white px-12 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold hover:shadow-lg transition-all active:scale-95">
            Book Specialist Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SpecialityDetailPage;
