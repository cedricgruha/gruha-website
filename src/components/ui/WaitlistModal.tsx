"use client";

import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useWaitlist } from '@/contexts/WaitlistContext';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export const WaitlistModal = () => {
  const { isOpen, closeModal } = useWaitlist();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({ firstName: '', lastName: '', phone: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitted(false);
      setErrors({});
      setForm({ firstName: '', lastName: '', phone: '', email: '' });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* Close on ESC */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeModal]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = 'Valid phone required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Join the Waitlist"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) closeModal(); }}
    >
      {/* Backdrop — warm dark overlay */}
      <div className="absolute inset-0 bg-[#1C1C1E]/75 backdrop-blur-sm" />

      {/* Modal Card — warm cream background */}
      <div className="relative w-full max-w-md bg-[#FDFAF7] rounded-2xl shadow-2xl overflow-hidden animate-modal-in">

        {/* Header band — dark charcoal like the Footer */}
        <div className="bg-[#1C1C1E] px-7 pt-7 pb-6 relative">
          <button
            onClick={closeModal}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand orange pill label */}
          <span className="inline-block font-inter text-[0.625rem] font-bold tracking-[0.18em] uppercase text-[#FE6235] bg-[#FE6235]/10 px-2.5 py-1 rounded-full mb-3">
            Early Access
          </span>
          <h2 className="font-fraunces text-[1.625rem] font-semibold text-white leading-snug">
            Join the Waitlist
          </h2>
          <p className="font-inter text-sm text-[#A1A1AA] mt-1.5">
            Be among the first to experience Gruha.ai in Bengaluru.
          </p>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {submitted ? (
            /* Success state — warm orange tint */
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-14 h-14 rounded-full bg-[#FE6235]/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-[#FE6235]" />
              </div>
              <div>
                <h3 className="font-fraunces text-xl font-semibold text-[#1C1C1E] mb-1">You&apos;re on the list!</h3>
                <p className="font-inter text-sm text-[#6B6B6B]">
                  We&apos;ll reach out to <span className="font-medium text-[#1C1C1E]">{form.email}</span> when we&apos;re ready for you.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="mt-2 font-inter text-sm font-semibold text-[#FE6235] hover:text-[#E05020] transition-colors"
              >
                Close ↗
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  id="firstName" label="First Name" value={form.firstName}
                  error={errors.firstName} onChange={handleChange('firstName')}
                  placeholder="Riya" autoComplete="given-name"
                />
                <Field
                  id="lastName" label="Last Name" value={form.lastName}
                  error={errors.lastName} onChange={handleChange('lastName')}
                  placeholder="Sharma" autoComplete="family-name"
                />
              </div>

              <Field
                id="phone" label="Phone" type="tel" value={form.phone}
                error={errors.phone} onChange={handleChange('phone')}
                placeholder="+91 98765 43210" autoComplete="tel"
              />

              <Field
                id="email" label="Email" type="email" value={form.email}
                error={errors.email} onChange={handleChange('email')}
                placeholder="riya@example.com" autoComplete="email"
              />

              {/* CTA — brand orange matching WaitlistSection */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-[#FE6235] hover:bg-[#E05020] disabled:bg-[#FE6235]/50 text-white font-inter font-semibold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg shadow-[#FE6235]/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting…
                  </span>
                ) : (
                  <>
                    Request Early Access
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center font-inter text-[0.6875rem] text-[#A1A1AA]">
                No spam. We&apos;ll only contact you about your access.
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .animate-modal-in { animation: modalIn 0.22s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
    </div>
  );
};

/* Reusable input field — warm cream style */
interface FieldProps {
  id: string; label: string; value: string; error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; autoComplete?: string;
}
const Field = ({ id, label, value, error, onChange, placeholder, type = 'text', autoComplete }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="font-inter text-[0.6875rem] font-bold text-[#6B6B6B] tracking-[0.1em] uppercase">
      {label}
    </label>
    <input
      id={id} type={type} value={value} onChange={onChange}
      placeholder={placeholder} autoComplete={autoComplete}
      className={`font-inter text-sm text-[#1C1C1E] bg-[#F9F5F0] border rounded-xl px-4 py-3 outline-none transition-all placeholder:text-[#C4B8A8]
        ${error
          ? 'border-red-400 focus:ring-2 focus:ring-red-100'
          : 'border-[#E8DDD0] focus:border-[#FE6235] focus:ring-2 focus:ring-[#FE6235]/10'
        }`}
    />
    {error && <span className="font-inter text-[0.6875rem] text-red-500">{error}</span>}
  </div>
);
