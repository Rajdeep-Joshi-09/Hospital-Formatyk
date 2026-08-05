import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const specialities = [
  {
    slug: 'gastroenterology',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuSuAv5VVDZ0T_exVWZxXv1sVphKI_FQRHsH3FQ1eqMZjmDANqADfKgJRZh9wUMqGCxJwZnGJjIRq-OYNTFDsQ_PN_VpBlr7Fp8TSQDB0E6K5RQJ5UT4F9QO5HWY_xWWjQ-mSv0KE5l-j4FZ2m2DzTylKhFOOCLqSGWz3Z-ckM7KbWiCUyBPP5z_nqLQIXj-nOgBvRMhswEOIIDxA2oFRaMYy6jU6Z8kOUSZhPxgAMdKTBh0elC4k4',
    title: 'Gastroenterology',
    desc: 'Expert treatment for digestive disorders, liver health, and nutritional wellness programs using the latest diagnostic endoscopies.',
    materialIcon: 'gastroenterology',
  },
  {
    slug: 'pulmonology',
    icon: null,
    title: 'Pulmonology',
    desc: 'Expert diagnosis and management of respiratory conditions, chronic lung diseases, and comprehensive asthma care.',
    materialIcon: 'pulmonology',
  },
  {
    slug: 'cardiology',
    icon: null,
    title: 'Cardiology',
    desc: 'Comprehensive heart care including non-invasive diagnostics, interventional procedures, and cardiac rehabilitation.',
    materialIcon: 'cardiology',
  },
  {
    slug: 'neurology',
    icon: null,
    title: 'Neurology',
    desc: 'Specialized care for brain and spine disorders, utilizing advanced neuro-imaging and minimally invasive surgical techniques.',
    materialIcon: 'neurology',
  },
  {
    slug: 'orthopedics',
    icon: null,
    title: 'Orthopedics',
    desc: 'Comprehensive bone and joint care, from sports medicine to complex joint replacements and trauma surgery.',
    materialIcon: 'orthopedics',
  },
  {
    slug: 'pediatrics',
    icon: null,
    title: 'Pediatrics',
    desc: 'Dedicated healthcare for children and adolescents, focusing on growth, development, and specialized pediatric treatments.',
    materialIcon: 'pediatrics',
  },
];

const iconMap = {
  gastroenterology: 'gastroenterology',
  pulmonology: 'pulmonology',
  cardiology: 'cardiology',
  neurology: 'neurology',
  orthopedics: 'orthopedics',
  pediatrics: 'pediatrics',
};

const materialIconFallback = {
  gastroenterology: 'science',
  pulmonology: 'respiratory_rate',
  cardiology: 'favorite',
  neurology: 'psychology',
  orthopedics: 'accessibility_new',
  pediatrics: 'child_care',
};

const SpecialitiesPage = () => {
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
      <section className="py-12 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialities.map((spec, i) => (
              <Link
                key={spec.slug}
                to={`/specialities/${spec.slug}`}
                className="reveal group glass-card p-8 rounded-[24px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 block"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-16 h-16 bg-[#ffe9e7] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#ac2b2e] transition-colors">
                  <span className="material-symbols-outlined text-[#ac2b2e] group-hover:text-white text-3xl">
                    {materialIconFallback[spec.slug]}
                  </span>
                </div>
                <h3 className="font-['Playfair_Display'] text-[24px] font-semibold mb-3 text-[#251817] group-hover:text-[#ac2b2e] transition-colors">{spec.title}</h3>
                <p className="font-['Inter'] text-[14px] text-[#59413f] mb-4">{spec.desc}</p>
                <div className="flex items-center gap-2 text-[#ac2b2e] font-['Inter'] text-[14px] font-semibold">
                  Learn More
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
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
