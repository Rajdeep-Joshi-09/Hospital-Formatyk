import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { requestNotificationPermission } from '../../utils/firebase';

const BookAppointmentPage = () => {
  const pageRef = useRef(null);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    departmentId: '',
    departmentName: '',
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/public/doctors');
        const docs = response.data.result || [];
        setDoctors(docs);
        
        // Extract unique departments from doctors' expertise
        const uniqueDepts = [];
        const seen = new Set();
        docs.forEach(doc => {
          if (doc.expertiesMaster && !seen.has(doc.expertiesMaster.id)) {
            seen.add(doc.expertiesMaster.id);
            uniqueDepts.push({
              id: doc.expertiesMaster.id,
              name: doc.expertiesMaster.expertyType
            });
          }
        });
        setDepartments(uniqueDepts);
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
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Request notification permission and get token
      const fcmToken = await requestNotificationPermission();

      await api.post('/public/appointments', {
        name: formData.name,
        phone: formData.phone,
        doctorId: formData.doctorId,
        appointmentDate: formData.date,
        appointmentTime: formData.time,
        reason: formData.notes,
        fcmToken: fcmToken || null
      });
      toast.success('Your appointment has been booked successfully! You will receive a confirmation SMS shortly.');
      setStep(1);
      setFormData({ departmentId: '', departmentName: '', doctorId: '', doctorName: '', date: '', time: '', name: '', email: '', phone: '', notes: '' });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const filteredDoctors = doctors.filter(doc => doc.expertiesMaster?.id === formData.departmentId);

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="max-w-3xl reveal active">
          <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold text-[#251817] mb-4">Book an Appointment</h1>
          <p className="font-['Inter'] text-[18px] text-[#59413f] leading-relaxed">
            Schedule your visit with one of our world-class specialists. Complete the form below and our team will confirm your appointment.
          </p>
        </div>
      </header>

      {/* Progress Steps */}
      <section className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8 reveal active">
          {['Select Department', 'Choose Schedule', 'Your Details'].map((label, i) => (
            <div key={label} className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-['Inter'] text-[14px] font-bold transition-colors ${
                step > i + 1 ? 'bg-[#00685c] text-white' : step === i + 1 ? 'bg-[#ac2b2e] text-white' : 'bg-[#e5e2e1] text-[#5f5e5e]'
              }`}>
                {step > i + 1 ? <span className="material-symbols-outlined text-[18px]">check</span> : i + 1}
              </div>
              <span className={`hidden sm:block font-['Inter'] text-[14px] font-medium ${
                step === i + 1 ? 'text-[#ac2b2e]' : 'text-[#5f5e5e]'
              }`}>
                {label}
              </span>
              {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${step > i + 1 ? 'bg-[#00685c]' : 'bg-[#e5e2e1]'}`} />}
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 rounded-[32px] reveal active">
          {/* Step 1: Department */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-['Playfair_Display'] text-[24px] font-semibold mb-4">Select Department & Doctor</h2>
              
              {loading ? (
                <div className="flex justify-center p-8">
                  <span className="material-symbols-outlined animate-spin text-[#ac2b2e] text-3xl">autorenew</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {departments.map((dept) => (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, departmentId: dept.id, departmentName: dept.name, doctorId: '', doctorName: '' })}
                        className={`p-4 rounded-xl border-2 text-left font-['Inter'] text-[16px] font-medium transition-all ${
                          formData.departmentId === dept.id
                            ? 'border-[#ac2b2e] bg-[#fce2e0] text-[#ac2b2e]'
                            : 'border-[#e0bfbc] hover:border-[#ac2b2e]/50 text-[#251817]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined ${formData.departmentId === dept.id ? 'text-[#ac2b2e]' : 'text-[#59413f]'}`}>
                            {formData.departmentId === dept.id ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                          {dept.name}
                        </div>
                      </button>
                    ))}
                  </div>

                  {formData.departmentId && (
                    <div className="mt-8">
                      <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-3">Select a Doctor</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredDoctors.map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, doctorId: doc.id, doctorName: doc.name })}
                            className={`p-4 rounded-xl border-2 text-left font-['Inter'] text-[14px] font-medium transition-all flex items-center gap-3 ${
                              formData.doctorId === doc.id
                                ? 'border-[#ac2b2e] bg-[#fce2e0] text-[#ac2b2e]'
                                : 'border-[#e0bfbc] hover:border-[#ac2b2e]/50 text-[#251817]'
                            }`}
                          >
                            <span className={`material-symbols-outlined ${formData.doctorId === doc.id ? 'text-[#ac2b2e]' : 'text-[#59413f]'}`}>
                              {formData.doctorId === doc.id ? 'check_circle' : 'person'}
                            </span>
                            {doc.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.departmentId || !formData.doctorId}
                      className="bg-[#ac2b2e] text-white px-8 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                    >
                      Next Step
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-['Playfair_Display'] text-[24px] font-semibold mb-4">Choose Your Schedule</h2>
              <div>
                <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Preferred Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0bfbc] bg-white focus:border-[#ac2b2e] focus:ring-2 focus:ring-[#ac2b2e]/10 transition-all font-['Inter'] text-[16px]"
                  required
                />
              </div>
              <div>
                <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Preferred Time</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({ ...formData, time })}
                      className={`py-3 px-2 rounded-xl border text-center font-['Inter'] text-[14px] font-medium transition-all ${
                        formData.time === time
                          ? 'border-[#ac2b2e] bg-[#fce2e0] text-[#ac2b2e]'
                          : 'border-[#e0bfbc] hover:border-[#ac2b2e]/50 text-[#251817]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={prevStep} className="border border-[#e0bfbc] text-[#251817] px-8 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold hover:bg-[#fff0ef] transition-all">
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.date || !formData.time}
                  className="bg-[#ac2b2e] text-white px-8 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-['Playfair_Display'] text-[24px] font-semibold mb-4">Your Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e0bfbc] bg-white focus:border-[#ac2b2e] focus:ring-2 focus:ring-[#ac2b2e]/10 transition-all font-['Inter'] text-[16px]"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e0bfbc] bg-white focus:border-[#ac2b2e] focus:ring-2 focus:ring-[#ac2b2e]/10 transition-all font-['Inter'] text-[16px]"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0bfbc] bg-white focus:border-[#ac2b2e] focus:ring-2 focus:ring-[#ac2b2e]/10 transition-all font-['Inter'] text-[16px]"
                  placeholder="+44 20 7946 0123"
                  required
                />
              </div>
              <div>
                <label className="block font-['Inter'] text-[14px] font-semibold text-[#251817] mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0bfbc] bg-white focus:border-[#ac2b2e] focus:ring-2 focus:ring-[#ac2b2e]/10 transition-all font-['Inter'] text-[16px] resize-none"
                  placeholder="Any specific concerns or requirements..."
                />
              </div>

              {/* Summary */}
              <div className="bg-[#fff0ef] p-6 rounded-xl">
                <h3 className="font-['Inter'] text-[14px] font-semibold text-[#ac2b2e] uppercase tracking-wider mb-3">Appointment Summary</h3>
                <div className="space-y-2 font-['Inter'] text-[14px]">
                  <div className="flex justify-between"><span className="text-[#59413f]">Department:</span><span className="font-semibold">{formData.departmentName}</span></div>
                  <div className="flex justify-between"><span className="text-[#59413f]">Doctor:</span><span className="font-semibold">{formData.doctorName}</span></div>
                  <div className="flex justify-between"><span className="text-[#59413f]">Date:</span><span className="font-semibold">{formData.date}</span></div>
                  <div className="flex justify-between"><span className="text-[#59413f]">Time:</span><span className="font-semibold">{formData.time}</span></div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={prevStep} className="border border-[#e0bfbc] text-[#251817] px-8 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold hover:bg-[#fff0ef] transition-all">
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#D74A49] text-white px-10 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </div>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default BookAppointmentPage;
