import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';

const ExpertDetailPage = () => {
  const { id } = useParams();
  const pageRef = useRef(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const avgRating = doctor?.reviews?.length 
    ? (doctor.reviews.reduce((acc, curr) => acc + curr.ratings, 0) / doctor.reviews.length).toFixed(1)
    : '5.0';
  const reviewCount = doctor?.reviews?.length || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDoctor = async () => {
      try {
        const response = await api.get(`/public/doctors/${id}`);
        setDoctor(response.data.result);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (loading || !doctor) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, doctor]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[#ac2b2e] text-4xl">autorenew</span>
      </div>
    );
  }

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
            <div className="rounded-[32px] overflow-hidden shadow-xl border-4 border-white bg-gray-100 flex items-center justify-center min-h-[400px]">
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.name} className="w-full aspect-[3/4] object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[#ac2b2e]/20" style={{ fontSize: '160px' }}>medical_services</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 reveal" style={{ transitionDelay: '200ms' }}>
            <span className="text-[#ac2b2e] font-['Inter'] text-[12px] font-semibold uppercase tracking-widest">{doctor.expertiesMaster?.expertyType || 'General Medicine'}</span>
            <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold text-[#251817] mt-2 mb-2">{doctor.name}</h1>
            <p className="font-['Inter'] text-[18px] text-[#59413f] mb-6">Senior {doctor.expertiesMaster?.expertyType || 'Physician'}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              {doctor.yearOfExp && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ac2b2e]">schedule</span>
                  <span className="font-['Inter'] text-[14px] font-semibold">{doctor.yearOfExp}+ Years</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-['Inter'] text-[14px] font-semibold">{avgRating} Rating ({reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ac2b2e]">language</span>
                <span className="font-['Inter'] text-[14px] font-semibold">{doctor.languageMaster?.lang || 'English'}</span>
              </div>
            </div>

            {/* Bio */}
            <p className="font-['Inter'] text-[16px] text-[#59413f] leading-relaxed mb-8">{doctor.description}</p>

            {/* Education */}
            <div className="mb-8">
              <h3 className="font-['Playfair_Display'] text-[24px] font-semibold mb-4">Education & Credentials</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 font-['Inter'] text-[16px]">
                  <span className="material-symbols-outlined text-[#ac2b2e] text-[18px]">school</span>
                  {doctor.education}
                </li>
              </ul>
            </div>

            {/* Expertise */}
            <div className="mb-8">
              <h3 className="font-['Playfair_Display'] text-[24px] font-semibold mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#fce2e0] text-[#ac2b2e] px-4 py-2 rounded-full font-['Inter'] text-[14px] font-medium">
                  {doctor.expertiesMaster?.expertyType || 'General Medicine'}
                </span>
                <span className="bg-[#fce2e0] text-[#ac2b2e] px-4 py-2 rounded-full font-['Inter'] text-[14px] font-medium">
                  Comprehensive Care
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/book-appointment"
              className="inline-block bg-[#D74A49] text-white px-10 py-4 rounded-xl font-['Inter'] text-[14px] font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Book Appointment with {doctor.name.split(' ')[1] || doctor.name}
            </Link>
          </div>
        </div>

        {/* Patient Reviews Section */}
        <div className="mt-20 reveal">
          <h2 className="font-['Playfair_Display'] text-[32px] font-bold text-[#251817] mb-8">Patient Reviews</h2>
          {doctor.reviews && doctor.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctor.reviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-[#e0bfbc]">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[#ac2b2e]" style={{ fontVariationSettings: i < review.ratings ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                    ))}
                  </div>
                  <p className="font-['Inter'] text-[16px] italic text-[#59413f] mb-4">"{review.reviewDescription}"</p>
                  <p className="font-['Inter'] text-[14px] font-semibold text-[#ac2b2e]">{review.patient?.name || 'Anonymous'}</p>
                  <p className="font-['Inter'] text-[12px] text-[#5f5e5e]">{new Date(review.createdDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-['Inter'] text-[#59413f]">No reviews yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExpertDetailPage;
