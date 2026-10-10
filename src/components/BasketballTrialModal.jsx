import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, User, Mail, Phone, Calendar, AlertCircle } from 'lucide-react';
import { format10DigitPhone, validate10DigitPhone, validateGmail } from '../utils/validation';

export default function BasketballTrialModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailVal = validateGmail(formData.email);
    if (!emailVal.isValid) {
      setEmailError(emailVal.error);
      return;
    }
    setEmailError('');

    const phoneVal = validate10DigitPhone(formData.phone);
    if (!phoneVal.isValid) {
      setPhoneError(phoneVal.error);
      return;
    }
    setPhoneError('');

    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#070f2b',
        borderRadius: '24px',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0a1640 100%)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', color: '#bfdbfe', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
          
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            Book Your Free Trial
          </h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#93c5fd' }}>
            Enter the candidate's details to secure your spot
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <CheckCircle2 size={50} color="#38bdf8" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 8px 0' }}>Request Received!</h3>
              <p style={{ color: '#93c5fd', fontSize: '13px', margin: 0 }}>Our coaching staff will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#93c5fd', marginBottom: '6px' }}>Candidate Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                    style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#93c5fd', marginBottom: '6px' }}>Age</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input 
                      required 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      placeholder="e.g. 10"
                      style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#93c5fd', marginBottom: '6px' }}>Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '14px', outline: 'none', appearance: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="Male" style={{ background: '#0a1640' }}>Male</option>
                    <option value="Female" style={{ background: '#0a1640' }}>Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#93c5fd', marginBottom: '6px' }}>
                  Gmail Address (@gmail.com only) *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (emailError) setEmailError('');
                    }}
                    placeholder="example@gmail.com"
                    style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: emailError ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>
                {emailError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>
                    <AlertCircle size={12} />
                    <span>{emailError}</span>
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#93c5fd' }}>
                    Mobile (9 Digits) *
                  </label>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                    {formData.phone.length}/9
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: phoneError ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '12px 14px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#38bdf8',
                    fontWeight: 800,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Phone size={14} color="#38bdf8" />
                    <span>+971</span>
                  </div>
                  <input 
                    required 
                    type="tel"
                    maxLength={9}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = format10DigitPhone(e.target.value);
                      setFormData({...formData, phone: digits});
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="50 123 4567"
                    style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none' }} 
                  />
                </div>
                {phoneError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>
                    <AlertCircle size={12} />
                    <span>{phoneError}</span>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: '1px solid rgba(147, 197, 253, 0.4)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.45)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Submit Details</span>
                <ChevronRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
