import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const doctorsData = {
  'dr-arthur-sterling': {
    name: 'Dr. Arthur Sterling',
    specialty: 'Internal Medicine',
    title: 'Chief of Internal Medicine & Executive Health',
    exp: '25+ Years',
    rating: '5.0',
    patients: '5,000+',
    bio: 'Dr. Arthur Sterling is one of the most distinguished internists in the country, with a career spanning over two decades. He specializes in longevity science, complex diagnostic evaluations, and executive health programs. His approach combines traditional clinical wisdom with cutting-edge AI-assisted diagnostics.',
    education: ['MD, Harvard Medical School', 'Fellowship, Mayo Clinic', 'Board Certified, Internal Medicine'],
    expertise: ['Executive Health Screening', 'Longevity Medicine', 'Complex Diagnostics', 'Chronic Disease Management'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR81ZOGtXgMF1OTJa49LzxZ9Omjv8ZFWhiZDUbysLEBMeWJlsgvElAurZ6AFXV_qhefVYTt5k-H73gvbTL00Yu1A-kNY4Bzw5cT6YTbihbNCJLy1i9n8E4XsPt8LrZna_LQzZ-lh1ocW_646cl832BiB06Yk7fvBVgGqzNhXRcBvEIFh6ybJYeTYX0HCba-N9WcRmjl8zcxj7C66IISWKGTGZkAh30I31rxlFaxCeE5XeI8JHkdEXkNA',
  },
  'dr-elena-vance': {
    name: 'Dr. Elena Vance',
    specialty: 'Neurosurgery',
    title: 'Head of Neurosurgery',
    exp: '18+ Years',
    rating: '5.0',
    patients: '3,200+',
    bio: 'Dr. Elena Vance is a pioneer in minimally invasive cranial procedures and neuro-regenerative therapies. Her groundbreaking research has redefined the standard of care in neurosurgical interventions.',
    education: ['MD, Johns Hopkins University', 'Fellowship, Cleveland Clinic', 'Board Certified, Neurosurgery'],
    expertise: ['Minimally Invasive Brain Surgery', 'Spinal Disorders', 'Neuro-oncology', 'Deep Brain Stimulation'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFImE0TqudKxB7W5z0a2Ks8jFjrx2kPzh-43tuJNyAjTEjJAM5KgX1sNAiDpLzQzrTNOlXrWNBTY9s3t081bF8IxDkYBopQQgh2l1-0j27FJ57L6MfXnYihYG8SJF2BrYbSry3Pve0nrIkxxd2UmxS7Cvcu7f1VS5tvj2tSF7k6GlpZtXy5_IkhSmQPANSG9r460ZlfoMUebvOyJuAya1_-h3aMxnXQ-sAM1MSwBQvPRAX9UpqbQuJyg',
  },
  'dr-sarah-chen': {
    name: 'Dr. Sarah Chen',
    specialty: 'Pediatrics',
    title: 'Head of Pediatric Medicine',
    exp: '12+ Years',
    rating: '5.0',
    patients: '4,100+',
    bio: 'Dr. Sarah Chen is focused on holistic child development and integrated wellness for the next generation. She brings warmth and expertise to every consultation, ensuring children feel safe and families feel empowered.',
    education: ['MD, Stanford University', 'Residency, Boston Children\'s Hospital', 'Board Certified, Pediatrics'],
    expertise: ['Child Development', 'Pediatric Immunology', 'Adolescent Medicine', 'Wellness Programs'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl1z4En7sJZEvKSFc_vEUFqjacQgF7RTzFZIGZaWWTLw9QIc8CccOcUWmh3p96Q2eeGk-Jy4buR3MKG562OF7HbACaYJ8vh5FFs5-jH-AmqKmTbVXucapVgd3A9F43mCCSoPosSMfnniB3nMm93lSsl94QnigSlV25UNX4C1BF8IGCoFHMnq4ey-2nLoMS3SVD4R9vCVNR3wN0ZJoNl89E0nSMJM4VwZBJR9m73LEK0vcOuXUekTtiGQ',
  },
  'dr-julian-rossi': {
    name: 'Dr. Julian Rossi',
    specialty: 'Cardiology',
    title: 'Director of Cardiovascular Medicine',
    exp: '15+ Years',
    rating: '4.9',
    patients: '3,800+',
    bio: 'Dr. Julian Rossi is an expert in preventive cardiology and precision heart health, utilizing advanced AI imaging to detect and manage cardiovascular conditions at the earliest stages.',
    education: ['MD, University of Cambridge', 'Fellowship, Mount Sinai Hospital', 'Board Certified, Cardiology'],
    expertise: ['Preventive Cardiology', 'AI-Assisted Diagnostics', 'Interventional Procedures', 'Cardiac Rehabilitation'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_dw-_OlrKH2_1NhnXrYMF5-zlM-XJJzcub4qCFynw_RJW2TekLyf37U07W3leaULNwpukFhxw0X1irCOyA6wF-dOSO9EWKbc-geiWm2mhy1ShcfmGkh92qr8w_Ru-TjeDzcCfIg2VXvnkej9OgR1Oo7gSeIoOrsOYD6blk9_wa4oifyMqUuq2BPPB2L5XSbEzxJp_TYR_f_xVc7HGbCFlir2v6ihwrTWoiLVisnMqmHKPDfAoOnvYew',
  },
};

const ExpertDetailPage = () => {
  const { slug } = useParams();
  const pageRef = useRef(null);
  const doctor = doctorsData[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [slug]);

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['Playfair_Display'] text-[32px] font-bold mb-4">Doctor Not Found</h1>
          <Link to="/experts" className="text-[#ac2b2e] font-semibold hover:underline">← Back to Experts</Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <Link to="/experts" className="inline-flex items-center gap-2 text-[#ac2b2e] font-['Inter'] text-[14px] font-semibold mb-6 hover:underline reveal active">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Experts
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Profile Image */}
          <div className="reveal">
            <div className="rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
              <img src={doctor.img} alt={doctor.name} className="w-full aspect-[3/4] object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 reveal" style={{ transitionDelay: '200ms' }}>
            <span className="text-[#ac2b2e] font-['Inter'] text-[12px] font-semibold uppercase tracking-widest">{doctor.specialty}</span>
            <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold text-[#251817] mt-2 mb-2">{doctor.name}</h1>
            <p className="font-['Inter'] text-[18px] text-[#59413f] mb-6">{doctor.title}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ac2b2e]">schedule</span>
                <span className="font-['Inter'] text-[14px] font-semibold">{doctor.exp}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-['Inter'] text-[14px] font-semibold">{doctor.rating} Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ac2b2e]">people</span>
                <span className="font-['Inter'] text-[14px] font-semibold">{doctor.patients} Patients</span>
              </div>
            </div>

            {/* Bio */}
            <p className="font-['Inter'] text-[16px] text-[#59413f] leading-relaxed mb-8">{doctor.bio}</p>

            {/* Education */}
            <div className="mb-8">
              <h3 className="font-['Playfair_Display'] text-[24px] font-semibold mb-4">Education & Credentials</h3>
              <ul className="space-y-2">
                {doctor.education.map((edu) => (
                  <li key={edu} className="flex items-center gap-3 font-['Inter'] text-[16px]">
                    <span className="material-symbols-outlined text-[#ac2b2e] text-[18px]">school</span>
                    {edu}
                  </li>
                ))}
              </ul>
            </div>

            {/* Expertise */}
            <div className="mb-8">
              <h3 className="font-['Playfair_Display'] text-[24px] font-semibold mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {doctor.expertise.map((exp) => (
                  <span key={exp} className="bg-[#fce2e0] text-[#ac2b2e] px-4 py-2 rounded-full font-['Inter'] text-[14px] font-medium">
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/book-appointment"
              className="inline-block bg-[#D74A49] text-white px-10 py-4 rounded-xl font-['Inter'] text-[14px] font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Book Appointment with {doctor.name.split(' ')[1]}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertDetailPage;
