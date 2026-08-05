import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const specialityData = {
  neurology: {
    title: 'Neurology & Neurosurgery',
    subtitle: 'Precision Excellence in Neuroscience',
    desc: 'Our neurology department is a center of excellence, providing comprehensive care for disorders of the nervous system. We utilize the latest diagnostic tools to create personalized recovery pathways for every patient.',
    heroDesc: 'Experience world-class precision in brain and spine care. Our integrated approach combines neuro-imaging excellence with pioneering surgical techniques to restore your neurological health.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOu5OCdPrpRFpciLt3YkrCR7pZYlno_tGfkR2pHKNvOEf3dxZe44qXpQpsu6n933yMThBGRprXc3A8tjl5exKmu-GnBBw9P4r-wbMlpQJTdLAxslDzIvCOa222PSnwbkv0Kr-5QtPXMfPYmo6IGoR6W62U1ZuE9gzyPVXAjCoePvWdsP14lhOs9MnaehwliXgzwdGMIuq414ytRBLPzzG6tuFyj1auySRkuRiVwDNH5ldnQ7HzoLM-ww',
    expertise: ['Stroke Care', 'Epilepsy Management', "Parkinson's Disease"],
    methods: ['AI Imaging', 'Robotic Surgery', 'Neuro Rehabilitation'],
    stats: { years: '20+', specialists: '12' },
    conditions: [
      { title: 'Stroke & Cerebrovascular', desc: 'Comprehensive stroke treatment including emergency intervention and long-term rehabilitation.', icon: 'emergency' },
      { title: 'Epilepsy & Seizure Disorders', desc: 'Advanced diagnostic evaluation and management of epilepsy using state-of-the-art EEG monitoring.', icon: 'electric_bolt' },
      { title: "Parkinson's & Movement Disorders", desc: 'Multidisciplinary care for movement disorders with innovative deep brain stimulation therapies.', icon: 'accessibility_new' },
      { title: 'Brain & Spinal Tumors', desc: 'Specialized neuro-oncology services with minimally invasive surgical options.', icon: 'psychology' },
      { title: 'Multiple Sclerosis', desc: 'Comprehensive MS care with the latest disease-modifying therapies and rehabilitation support.', icon: 'neurology' },
      { title: 'Chronic Pain Management', desc: 'Interventional pain management techniques for chronic neurological pain conditions.', icon: 'healing' },
    ],
  },
  cardiology: {
    title: 'Cardiology',
    subtitle: 'Heart Care Excellence',
    desc: 'Our cardiology department provides comprehensive cardiovascular care with state-of-the-art technology and world-class specialists.',
    heroDesc: 'Comprehensive heart care including non-invasive diagnostics, interventional procedures, and cardiac rehabilitation programs tailored to your needs.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgu27QTyEYg6FIscpj8bgxkiGKRtIgVuJYAaQCA3VgKGHbk4M-bTX3V-ih9d5b1_w1uCZ-S3zy8joRaYdmsHWG4hlseNrqfRHEAbSbwwiiBsON6gEf0rOq2W3hjXXEqFsAtEFtxsOlo9oBvmL2-8-vMs6jBjIt3KywjByGahTPy5vPLIfcrhUn4jgKnxMVs8xGjyAS-MS2aVK6zMVUUmwYJSpAMJ2R6jw6RK3eUrEC3vD8jsgBBH3qbw',
    expertise: ['Heart Failure', 'Arrhythmia Care', 'Valve Disorders'],
    methods: ['AI Diagnostics', 'Catheterization', 'Cardiac Rehab'],
    stats: { years: '22+', specialists: '15' },
    conditions: [
      { title: 'Coronary Artery Disease', desc: 'Comprehensive treatment for blocked arteries including stenting and bypass surgery.', icon: 'favorite' },
      { title: 'Heart Failure', desc: 'Advanced heart failure management with device therapy and transplant evaluation.', icon: 'cardiology' },
      { title: 'Arrhythmias', desc: 'Electrophysiology services for abnormal heart rhythms including ablation procedures.', icon: 'electric_bolt' },
      { title: 'Valve Disorders', desc: 'Minimally invasive valve repair and replacement procedures.', icon: 'healing' },
      { title: 'Hypertension', desc: 'Comprehensive hypertension management programs with lifestyle counseling.', icon: 'monitor_heart' },
      { title: 'Preventive Cardiology', desc: 'Risk assessment and prevention strategies for cardiovascular disease.', icon: 'shield' },
    ],
  },
};

// Default data for specialities without detailed content
const defaultData = {
  gastroenterology: { title: 'Gastroenterology', heroDesc: 'Expert treatment for digestive disorders, liver health, and nutritional wellness programs.', icon: 'science' },
  pulmonology: { title: 'Pulmonology', heroDesc: 'Expert diagnosis and management of respiratory conditions and chronic lung diseases.', icon: 'respiratory_rate' },
  orthopedics: { title: 'Orthopedics', heroDesc: 'Comprehensive bone and joint care, from sports medicine to complex joint replacements.', icon: 'accessibility_new' },
  pediatrics: { title: 'Pediatrics', heroDesc: 'Dedicated healthcare for children and adolescents, focusing on growth and development.', icon: 'child_care' },
};

const SpecialityDetailPage = () => {
  const { slug } = useParams();
  const pageRef = useRef(null);
  const data = specialityData[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [slug]);

  // Fallback for specialties without detailed data
  if (!data) {
    const fallback = defaultData[slug] || { title: slug?.charAt(0).toUpperCase() + slug?.slice(1), heroDesc: 'Specialized care with world-class expertise.', icon: 'local_hospital' };
    return (
      <div ref={pageRef}>
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <Link to="/specialities" className="inline-flex items-center gap-2 text-[#ac2b2e] font-['Inter'] text-[14px] font-semibold mb-6 hover:underline">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Specialities
          </Link>
        </section>
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-8 text-center reveal active">
          <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold mb-4">{fallback.title}</h1>
          <p className="font-['Inter'] text-[18px] text-[#59413f] max-w-2xl mx-auto">{fallback.heroDesc}</p>
        </section>
        <section className="py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto glass-card p-12 rounded-[32px]">
            <span className="material-symbols-outlined text-[#ac2b2e] mb-4" style={{ fontSize: '48px' }}>{fallback.icon}</span>
            <h2 className="font-['Playfair_Display'] text-[24px] font-semibold mb-4">Coming Soon</h2>
            <p className="font-['Inter'] text-[16px] text-[#59413f] mb-6">Detailed information for this speciality is being prepared. Please contact us for more information.</p>
            <Link to="/contact" className="inline-block bg-[#ac2b2e] text-white px-8 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold">Contact Us</Link>
          </div>
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
        <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold mb-4">{data.title}</h1>
        <p className="font-['Inter'] text-[18px] text-[#59413f] max-w-2xl mx-auto">{data.heroDesc}</p>
      </section>

      {/* Specialty Overview */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative group reveal">
          <div className="absolute inset-0 bg-[#ac2b2e]/5 rounded-[24px] -rotate-3 scale-105 group-hover:rotate-0 transition-transform duration-700" />
          <img
            className="relative w-full aspect-[4/3] object-cover rounded-[24px] shadow-lg border border-[#e0bfbc]/30"
            alt={data.title}
            src={data.img}
          />
        </div>
        <div className="space-y-8 reveal" style={{ transitionDelay: '200ms' }}>
          <div className="space-y-4">
            <h2 className="font-['Playfair_Display'] text-[32px] font-semibold text-[#ac2b2e]">{data.subtitle}</h2>
            <p className="font-['Inter'] text-[16px] text-[#59413f]">{data.desc}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="font-['Inter'] text-[14px] font-semibold text-[#ac2b2e] uppercase tracking-wider">Expertise</span>
              <ul className="space-y-1 font-['Inter'] text-[16px]">
                {data.expertise.map((item) => (
                  <li key={item} className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-[#ac2b2e]">check_circle</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <span className="font-['Inter'] text-[14px] font-semibold text-[#ac2b2e] uppercase tracking-wider">Advanced Methods</span>
              <ul className="space-y-1 font-['Inter'] text-[16px]">
                {data.methods.map((item) => (
                  <li key={item} className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-[#ac2b2e]">check_circle</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-8 py-4 border-y border-[#e0bfbc]/20">
            <div>
              <div className="font-['Playfair_Display'] text-[32px] font-semibold text-[#ac2b2e]">{data.stats.years}</div>
              <div className="font-['Inter'] text-[14px] font-semibold text-[#59413f]">Years Experience</div>
            </div>
            <div>
              <div className="font-['Playfair_Display'] text-[32px] font-semibold text-[#ac2b2e]">{data.stats.specialists}</div>
              <div className="font-['Inter'] text-[14px] font-semibold text-[#59413f]">Top Specialists</div>
            </div>
          </div>
          <Link to="/book-appointment" className="inline-block bg-[#ac2b2e] text-white px-12 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold hover:shadow-lg transition-all active:scale-95">
            Book Specialist Consultation
          </Link>
        </div>
      </section>

      {/* Conditions Grid */}
      <section className="bg-[#fff0ef] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <h2 className="font-['Playfair_Display'] text-[32px] font-semibold mb-2">Conditions We Treat</h2>
            <div className="w-24 h-1 bg-[#ac2b2e] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.conditions.map((cond, i) => (
              <div key={cond.title} className="reveal bg-white p-8 rounded-[24px] shadow-sm border border-[#e0bfbc]/30 hover:shadow-xl transition-all group" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 bg-[#ffe9e7] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#ac2b2e] transition-colors">
                  <span className="material-symbols-outlined text-[#ac2b2e] group-hover:text-white">{cond.icon}</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-[20px] font-semibold mb-2">{cond.title}</h3>
                <p className="font-['Inter'] text-[14px] text-[#59413f]">{cond.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecialityDetailPage;
