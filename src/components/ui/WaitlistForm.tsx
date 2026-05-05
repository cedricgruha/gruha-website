"use client";

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  message?: string;
}

interface WaitlistFormProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showLabels?: boolean;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ 
  className = "", 
  title, 
  subtitle,
  showLabels = true 
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({ firstName: '', lastName: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});

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

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        console.error('Submission failed:', data.error);
        alert('Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (submitted) {
    return (
      <div className={`flex flex-col items-center text-center py-10 gap-4 ${className}`}>
        <div className="w-16 h-16 rounded-full bg-[#FE6235]/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-[#FE6235]" />
        </div>
        <div>
          <h3 className="font-fraunces text-2xl font-semibold text-[#1C1C1E] mb-2">You&apos;re on the list!</h3>
          <p className="font-inter text-gray-600 max-w-sm">
            We&apos;ll reach out to <span className="font-medium text-[#1C1C1E]">{form.email}</span> when we&apos;re ready for you.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 font-inter text-sm font-semibold text-[#FE6235] hover:text-[#E05020] transition-colors"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h2 className="font-fraunces text-2xl md:text-3xl text-black mb-2">{title}</h2>}
          {subtitle && <p className="font-inter text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            id="firstName" label="First Name" value={form.firstName}
            error={errors.firstName} onChange={handleChange('firstName')}
            placeholder="Riya" showLabel={showLabels}
          />
          <Field
            id="lastName" label="Last Name" value={form.lastName}
            error={errors.lastName} onChange={handleChange('lastName')}
            placeholder="Sharma" showLabel={showLabels}
          />
        </div>

        <Field
          id="phone" label="Phone Number" type="tel" value={form.phone}
          error={errors.phone} onChange={handleChange('phone')}
          placeholder="+91 98765 43210" showLabel={showLabels}
        />

        <Field
          id="email" label="Email Address" type="email" value={form.email}
          error={errors.email} onChange={handleChange('email')}
          placeholder="riya@example.com" showLabel={showLabels}
        />

        <div className="flex flex-col gap-1.5">
          {showLabels && (
            <label htmlFor="message" className="font-inter text-[0.7rem] font-bold text-[#6B6B6B] tracking-[0.1em] uppercase">
              Message (Optional)
            </label>
          )}
          <textarea
            id="message"
            value={form.message}
            onChange={handleChange('message')}
            placeholder="Tell us what you're looking for..."
            className="font-inter text-sm text-[#1C1C1E] bg-[#F9F5F0] border border-[#E8DDD0] rounded-xl px-4 py-3 outline-none transition-all focus:border-[#FE6235] focus:ring-2 focus:ring-[#FE6235]/10 placeholder:text-[#C4B8A8] min-h-[120px] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-[#FE6235] hover:bg-[#E05020] disabled:bg-[#FE6235]/50 text-white font-inter font-semibold text-sm px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-[#FE6235]/20 active:scale-[0.98]"
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

        <p className="text-center font-inter text-[0.7rem] text-gray-500">
          No spam. We&apos;ll only contact you about your access.
        </p>
      </form>
    </div>
  );
};

interface FieldProps {
  id: string; label: string; value: string; error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; showLabel?: boolean;
}

const Field = ({ id, label, value, error, onChange, placeholder, type = 'text', showLabel = true }: FieldProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    {showLabel && (
      <label htmlFor={id} className="font-inter text-[0.7rem] font-bold text-[#6B6B6B] tracking-[0.1em] uppercase">
        {label}
      </label>
    )}
    <input
      id={id} type={type} value={value} onChange={onChange}
      placeholder={placeholder}
      className={`font-inter text-sm text-[#1C1C1E] bg-[#F9F5F0] border rounded-xl px-4 py-3.5 outline-none transition-all placeholder:text-[#C4B8A8]
        ${error
          ? 'border-red-400 focus:ring-2 focus:ring-red-100'
          : 'border-[#E8DDD0] focus:border-[#FE6235] focus:ring-2 focus:ring-[#FE6235]/10'
        }`}
    />
    {error && <span className="font-inter text-[0.65rem] text-red-500 font-medium ml-1">{error}</span>}
  </div>
);
