import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef}>
      {/* Hero Section */}
      <header className="relative pt-12 md:pt-20 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="reveal active">
            <span className="inline-block px-4 py-2 bg-[#ffe9e7] text-[#ac2b2e] rounded-full font-['Inter'] text-[12px] font-bold tracking-widest uppercase mb-6">
              Established 1999
            </span>
            <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold leading-tight tracking-[-0.02em] text-[#251817] mb-6">
              Healing Hands, <br />
              <span className="italic text-[#ac2b2e]">Caring Hearts.</span>
            </h1>
            <p className="font-['Inter'] text-[18px] text-[#59413f] max-w-[36rem] leading-relaxed mb-8">
              LuxCare Hospital represents a sanctuary of advanced medicine and soulful hospitality. For over two decades, we've blended clinical excellence with the warmth of a luxury retreat, redefining the patient experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/specialities" className="bg-[#ac2b2e] text-white px-8 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold hover:opacity-90 shadow-lg shadow-[#ac2b2e]/20">
                Explore Services
              </Link>
              <a href="#milestones" className="bg-transparent border border-[#8d706e] text-[#251817] px-8 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold hover:bg-[#ffe9e7] transition-colors">
                Our Impact
              </a>
            </div>
          </div>
          <div className="relative reveal active" style={{ transitionDelay: '200ms' }}>
            <div className="rounded-[48px] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square">
              <img className="w-full h-full object-cover" alt="Doctor caring for patient" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1x_mI2Rr9BY1Bzw7xO9tR4DDpr5FLKlmyNcqMWz6Xv2y3C4q29seLD1nhDVCbdyfmyIEMKMMd3MjGUt2qrqOcbtVcgq5CLBYpO8IF2hb_wUShgAKp_mXIt-Ior361MG7kvZ771EUmn_vd64yj6fWs3OY1zyhrJIBegEnuCLCMGGascHTcre7BgS1a7ER0O0H_98IIeQBRfO5IE6zi89BG0aIBtbUydAl8Lc_ywPTW3j8-uNPYEmpVvg" />
            </div>
            <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-[24px] shadow-xl max-w-[20rem] hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ac2b2e] rounded-full flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <div className="font-['Playfair_Display'] text-[24px] font-semibold text-[#251817]">JCI Accredited</div>
                  <div className="font-['Inter'] text-[12px] text-[#5f5e5e]">Global Safety Standard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <div className="rounded-[32px] overflow-hidden shadow-lg aspect-video md:aspect-[3/4]">
                <img className="w-full h-full object-cover" alt="LuxCare Hospital exterior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnG7nG33z71XZepT6Pf_WaO8HqpFyuaxJ7YtpuKjyJvJhC-kj94AE-uEdHFqJsFWS2K7KTPpS9OdaeVkMXgt_sUGyDfaCdx4eK2jiViBNCYp2u9dsKuDflU7X1fJ4_ZMrT4cpzD8mwYGgG85O7A-vpHhcd5VohuImuCDXh5EHy_09D38jyvaDxTX0aDjWWK1BS_yRz_zAiU5Rg4T1aikgW2XePYEV6nrjehEIV5AVbNJQO5BseFFoTpg" />
              </div>
            </div>
            <div className="reveal" style={{ transitionDelay: '200ms' }}>
              <h2 className="font-['Playfair_Display'] text-[32px] font-semibold mb-6">Our Journey Through Care</h2>
              <p className="font-['Inter'] text-[16px] text-[#59413f] mb-4">
                Founded with a vision to transcend traditional healthcare boundaries, LuxCare began as a boutique clinic in the heart of the city. We recognized early on that healing is as much about the environment as it is about the medicine.
              </p>
              <p className="font-['Inter'] text-[16px] text-[#59413f] mb-8">
                Today, we stand as a beacon of medical innovation, housing the region's most advanced diagnostic technologies and world-renowned specialists. Our mission remains unchanged: to deliver world-class clinical outcomes with uncompromised human dignity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/experts" className="inline-flex items-center gap-2 text-[#ac2b2e] font-bold group">
                  Meet Our Experts
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="reveal glass-card p-12 rounded-[32px] hover:shadow-2xl transition-all duration-500 group">
              <div className="w-16 h-16 bg-[#ffe9e7] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#ac2b2e] text-3xl">track_changes</span>
              </div>
              <h3 className="font-['Playfair_Display'] text-[24px] font-semibold mb-4">Our Mission</h3>
              <p className="text-[#59413f] leading-relaxed font-['Inter']">To provide patient-centered healthcare with excellence in quality, service, and access. We commit ourselves to the health and wellness of the communities we serve through education, research, and high-quality medical care.</p>
            </div>
            <div className="reveal glass-card p-12 rounded-[32px] hover:shadow-2xl transition-all duration-500 group" style={{ transitionDelay: '200ms' }}>
              <div className="w-16 h-16 bg-[#ffe9e7] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#ac2b2e] text-3xl">visibility</span>
              </div>
              <h3 className="font-['Playfair_Display'] text-[24px] font-semibold mb-4">Our Vision</h3>
              <p className="text-[#59413f] leading-relaxed font-['Inter']">To be the global leader in compassionate, patient-first care, setting new benchmarks for medical outcomes and digital integration in the healthcare landscape while fostering a culture of lifelong wellness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-20 bg-[#ac2b2e] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '20,000k+', label: 'Patients Treated' },
              { value: '150+', label: 'Expert Doctors' },
              { value: '30+', label: 'Specialties' },
              { value: '25+', label: 'Years of Service' },
            ].map((stat, i) => (
              <div key={stat.label} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold mb-1">{stat.value}</div>
                <div className="text-white/70 uppercase tracking-widest text-[12px] font-['Inter']">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section id="milestones" className="py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#e0bfbc] -translate-x-1/2 hidden md:block" />
          <div className="text-center mb-12 reveal">
            <h2 className="font-['Playfair_Display'] text-[32px] font-semibold">Milestones of Trust</h2>
          </div>
          <div className="space-y-12">
            {[
              { year: '1999', title: 'Foundation Stone', desc: 'LuxCare Hospital is founded with a 50-bed capacity focusing on cardiac care.', left: true },
              { year: '2008', title: 'Expansion & Accreditation', desc: 'Expansion to a 200-bed multi-specialty facility and first international accreditation.', left: false },
              { year: '2016', title: 'Innovation Center', desc: 'Opening of the Advanced Robotic Surgery and AI Diagnostics wing.', left: true },
              { year: 'Present', title: 'Today', desc: 'Leading the region in personalized medicine and digital health integration.', left: false },
            ].map((item) => (
              <div key={item.year} className="relative flex items-center reveal">
                {item.left ? (
                  <>
                    <div className="w-1/2 pr-8 text-right hidden md:block">
                      <span className="text-[#ac2b2e] font-bold font-['Playfair_Display'] text-[24px]">{item.year}</span>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#ac2b2e] border-4 border-white z-10 hidden md:block" />
                    <div className="md:w-1/2 md:pl-8 pl-8">
                      <span className="text-[#ac2b2e] font-bold font-['Playfair_Display'] text-[24px] md:hidden">{item.year}</span>
                      <h5 className="font-bold text-lg font-['Inter']">{item.title}</h5>
                      <p className="text-[#59413f] font-['Inter'] text-[12px]">{item.desc}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:w-1/2 md:pr-8 pr-8 text-right order-1 md:order-none">
                      <h5 className="font-bold text-lg font-['Inter']">{item.title}</h5>
                      <p className="text-[#59413f] font-['Inter'] text-[12px]">{item.desc}</p>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#ac2b2e] border-4 border-white z-10 hidden md:block" />
                    <div className="w-1/2 pl-8 hidden md:block">
                      <span className="text-[#ac2b2e] font-bold font-['Playfair_Display'] text-[24px]">{item.year}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Gallery */}
      <section className="py-20 bg-[#fff0ef]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-[32px] font-semibold text-center mb-12 reveal">State-of-the-Art Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqsXOH7qk4c800onHdfA5hLH8vcU7u_JGh7aCcO3WYii8WOFN010DNKNcv0diSehT6rYK1bLQKdKFKMsw3E460577yQibsmhKDmJv0RbKLbQ56lnFLHaQldvkD8M_NPVhkfvmwxwLeMZL5vPE3ofDnU0WkgHCsyzeiSHtyeBvRPGA6M-3ebUB5U1fbODXb6TqlggN1KSha4A49nVbMJxcLH4SzuOqOxFqLsZYRieckioK4uONpcQT2VA', label: 'Main Reception' },
              { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU0g6cWA-aAuaOwTMYeIQk2GrEsbqR7MMHe_kg31256qb853hEszg8OxAm9y2ih7HgEM4c3wTxmtXDSdKtS5sdcO-bkn9RYE-jUWloY38iSMgcbkMqK3D4WX5jRLG9iblabUg8vi20yjodXHQpxMjPMu70Q8FNotnQMimQftGrEGY4sjtu4XhUoi1N1GIWlDUE6IkTCLyRWN7HSAbpgKorW0MQWVRJzk7ikpglo2I5Yo5SnJxmHNHAZg', label: 'Advanced Surgical OT' },
              { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATIYy5nhAI145fDXvWCyKg3zews4eUiDZasOvbquoqwxzCU8DMNpguAWHgXIcPC5FHuEqh6Z8e-lYbhJg38J7lQBlkxLIZ2uwhB9pIhnXBImWCmq_7Og04zsxqUpF5tN3loEdCMxPOVBUpUT_qhH_h6QitNJ2vhGZkRfCYubK6euIdFV5OT64GBkiNRZp8HCKogiyitj5yQYGwZtMrmbZ9aQgwIFMWwg1URiL4XX3y1L2ynmRtK2mxkA', label: 'Premium Suites' },
            ].map((item, i) => (
              <div key={item.label} className="reveal rounded-2xl overflow-hidden group relative aspect-video" style={{ transitionDelay: `${i * 100}ms` }}>
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={item.src} alt={item.label} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <span className="text-white font-bold font-['Inter']">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Message */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-card rounded-[48px] overflow-hidden grid grid-cols-1 md:grid-cols-5 items-center">
            <div className="md:col-span-2 h-full reveal">
              <img className="w-full h-full object-cover min-h-[300px]" alt="Medical Director" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCBGqEphZxtbrNexAaXQZvXwHSIAEyzrZueAOhdeHVz0xnzZhNfeaQjRjlLvX-PSuDE8Dvqur89b8HOtdgyvrLvQvVvDXyjG5afEzp7W3U8ZOYSQex6eFGETM0sM9Cui9G11PRQooSGDb2Srqt2fBN-q6PCR4NHYF7qq4Q3vrEkuixgu4CJz_gffQbluy2ZdMv_Jg_hK7hri4JxFAKybitHztRlAlmIr3ToGM2c_FN1eSmMdutzme2hQ" />
            </div>
            <div className="md:col-span-3 p-8 md:p-12 reveal" style={{ transitionDelay: '200ms' }}>
              <span className="material-symbols-outlined text-[#ce4343] text-4xl mb-4">format_quote</span>
              <h2 className="font-['Playfair_Display'] text-[32px] font-semibold mb-6">A Message from our Director</h2>
              <p className="font-['Inter'] text-[18px] italic text-[#59413f] leading-relaxed mb-8">
                "At LuxCare, we believe that medical excellence is only half of the healing process. The other half is the human connection. We strive to create an environment where technology serves the heart, ensuring every patient feels seen, heard, and deeply cared for."
              </p>
              <div>
                <div className="font-bold font-['Playfair_Display'] text-[24px] mb-1">Dr. Alistair Vaughn</div>
                <div className="text-[#ac2b2e] font-medium tracking-widest uppercase font-['Inter'] text-[12px]">Chief Medical Officer & Founder</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-[#3c2d2c] rounded-[48px] p-12 text-center relative overflow-hidden">
          <div className="relative z-10 reveal">
            <h2 className="font-['Playfair_Display'] text-[32px] md:text-[32px] font-semibold text-white mb-6">Ready to Experience Exceptional Care?</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8 font-['Inter'] text-[18px]">Schedule your visit or consultation today and begin your journey to better health with LuxCare.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book-appointment" className="bg-[#ac2b2e] text-white px-12 py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform font-['Inter']">
                Book An Appointment
              </Link>
              <Link to="/contact" className="bg-white/10 text-white backdrop-blur border border-white/20 px-12 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors font-['Inter']">
                Contact Our Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
