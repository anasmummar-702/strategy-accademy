import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  MapPin,
  QrCode,
  Printer,
  Award,
  Flame,
  Check,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  CreditCard,
  Building2,
  Lock,
  Shield,
  User,
  Calendar,
  Trophy,
  Tag,
  Share2
} from 'lucide-react';
import { format10DigitPhone, validate10DigitPhone, validateGmail } from '../utils/validation';
import { getBasketballPackage } from '../utils/academyPackagesData';

// Custom Styled Dark Dropdown to eliminate mobile OS white overflow glitch
function CustomDropdown({ label, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      {label && (
        <label style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: '12px',
          backgroundColor: '#04091a',
          border: isOpen ? '1px solid #38bdf8' : '1px solid rgba(59, 130, 246, 0.4)',
          boxShadow: isOpen ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 600,
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
          {selectedOption ? selectedOption.label : value}
        </span>
        <ChevronDown
          style={{
            width: '16px',
            height: '16px',
            color: '#38bdf8',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease'
          }}
        />
      </button>

      {/* Dropdown Options Popup */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: '#071233',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '14px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(37, 99, 235, 0.25)',
            overflow: 'hidden',
            maxHeight: '260px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '12px 16px',
                  fontSize: '13px',
                  fontWeight: isSelected ? 800 : 500,
                  color: isSelected ? '#ffffff' : '#bfdbfe',
                  backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.6)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  transition: 'background-color 0.15s ease',
                  borderBottom: '1px solid rgba(59, 130, 246, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {option.label}
                </span>
                {isSelected && (
                  <Check style={{ width: '15px', height: '15px', color: '#38bdf8', flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BasketballCheckoutPage({ navigateTo }) {
  // Dynamic Basketball Package State
  const [bbPackage, setBbPackage] = useState(getBasketballPackage);

  useEffect(() => {
    const handleUpdate = () => {
      setBbPackage(getBasketballPackage());
    };
    window.addEventListener('strategy_packages_updated', handleUpdate);
    return () => window.removeEventListener('strategy_packages_updated', handleUpdate);
  }, []);

  // Step in checkout: 1: Details & Package Review, 2: Payment, 3: Confirmation Pass
  const [currentStep, setCurrentStep] = useState(1);


  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ageCategory, setAgeCategory] = useState('youth');
  const [trainingDays, setTrainingDays] = useState('Sat & Sun (6:00 PM) - Al Nahyan Arena');
  const [jerseySize, setJerseySize] = useState('Youth L / Adult S');

  // Errors
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'bank'
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardError, setCardError] = useState('');

  const [bankSenderName, setBankSenderName] = useState('');
  const [bankSenderBank, setBankSenderBank] = useState('Emirates NBD');
  const [bankTxRef, setBankTxRef] = useState('');
  const [bankError, setBankError] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderTicket, setOrderTicket] = useState(null);

  // Handle Step 1 Validation
  const handleProceedToPayment = (e) => {
    if (e) e.preventDefault();

    let valid = true;

    if (!fullName.trim()) {
      setNameError('Please enter the student or player full name');
      valid = false;
    } else {
      setNameError('');
    }

    const emailVal = validateGmail(email);
    if (!emailVal.isValid) {
      setEmailError(emailVal.error);
      valid = false;
    } else {
      setEmailError('');
    }

    const phoneVal = validate10DigitPhone(phone);
    if (!phoneVal.isValid) {
      setPhoneError(phoneVal.error);
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!valid) return;

    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Step 2 Payment Submission
  const handleFinalPayment = (e) => {
    if (e) e.preventDefault();

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        setCardError('Please enter a valid 16-digit credit or debit card number');
        return;
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
        setCardError('Please enter expiration date in MM/YY format');
        return;
      }
      if (cardCvv.length < 3) {
        setCardError('Please enter a valid 3-digit CVV security code');
        return;
      }
      if (!cardHolder.trim()) {
        setCardError('Please enter the name on the card');
        return;
      }
      setCardError('');
    } else {
      if (!bankSenderName.trim()) {
        setBankError('Please enter the sender name from your bank transfer');
        return;
      }
      if (!bankTxRef.trim()) {
        setBankError('Please enter the transaction reference / receipt ID');
        return;
      }
      setBankError('');
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const ticket = {
        orderId: 'STR-BB-' + Math.floor(100000 + Math.random() * 900000),
        packageName: `${bbPackage.title || '2 Months Basketball Coaching Package'} (${bbPackage.classesCount || 16} Classes)`,
        regularPrice: `${bbPackage.originalPriceAED || 750} AED`,
        dealPrice: `${bbPackage.priceAED || 500} AED`,
        savedAmount: `${Math.max(0, (bbPackage.originalPriceAED || 750) - (bbPackage.priceAED || 500))} AED`,
        promoCode: 'HOOPS250',
        studentName: fullName,
        email,
        phone,
        ageCategory: ageCategory === 'kids' ? 'Rookie Ballers (4-8)' : ageCategory === 'youth' ? 'Junior Pro (9-14)' : ageCategory === 'elite' ? 'Elite Prep (15-18)' : 'Adult 5v5 (18+)',
        trainingSchedule: trainingDays,
        jerseySize,
        venue: 'Al Nahyan Arena, Abu Dhabi',
        dateIssued: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        paymentMethod: paymentMethod === 'card'
          ? `Card •••• ${cardNumber.replace(/\s/g, '').slice(-4) || '8842'}`
          : `UAE Bank Transfer (Ref: ${bankTxRef.trim()})`
      };

      setOrderTicket(ticket);
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030718',
      color: '#ffffff',
      paddingTop: '20px',
      paddingBottom: '90px',
      position: 'relative',
      fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)'
    }}>

      {/* Background Graphic Texture */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url('/images/basketball_bg_gradient.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35) contrast(1.3)',
          opacity: 0.8,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(3, 7, 24, 0.8) 0%, rgba(5, 12, 38, 0.6) 40%, rgba(2, 5, 18, 0.95) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: '0 20px',
        position: 'relative',
        zIndex: 10
      }}>

        {/* Top Navigation Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
          marginBottom: '28px',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => {
              if (navigateTo) navigateTo('basketball');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(30, 58, 138, 0.6)',
              border: '1px solid rgba(96, 165, 250, 0.35)',
              color: '#bfdbfe',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
            <span>Back to Basketball Academy</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#67e8f9',
            fontSize: '11px',
            fontWeight: 800
          }}>
            <ShieldCheck style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Step Progress Indicator */}
        {currentStep < 3 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '9999px',
              backgroundColor: currentStep === 1 ? '#2563eb' : 'rgba(37, 99, 235, 0.2)',
              border: '1px solid rgba(96, 165, 250, 0.4)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 800
            }}>
              <span style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: currentStep === 1 ? '#ffffff' : '#38bdf8',
                color: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 900
              }}>1</span>
              <span>Player & Contact Info</span>
            </div>

            <div style={{ width: '24px', height: '2px', backgroundColor: 'rgba(59, 130, 246, 0.4)' }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '9999px',
              backgroundColor: currentStep === 2 ? '#2563eb' : 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: currentStep === 2 ? '#ffffff' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 800
            }}>
              <span style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: currentStep === 2 ? '#ffffff' : 'rgba(255,255,255,0.2)',
                color: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 900
              }}>2</span>
              <span>Payment (Card / Bank)</span>
            </div>
          </div>
        )}

        {/* STEP 1: CONTACT INFO & PACKAGE REVIEW */}
        {currentStep === 1 && (
          <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* VIP Package Banner with 450 AED Discount Applied */}
            <div style={{
              padding: '22px 24px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #0d2159 0%, #08153b 100%)',
              border: '2px solid rgba(56, 189, 248, 0.5)',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(245, 158, 11, 0.25)',
                    color: '#fde047',
                    border: '1px solid rgba(250, 204, 21, 0.5)',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }}>
                    🎉 Exclusive Package: 2 Months • 16 Classes
                  </span>
                </div>

                <div style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#6ee7b7',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '11px',
                  fontWeight: 800
                }}>
                  SAVE AED 250 (33% OFF)
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#ffffff',
                    marginBottom: '6px'
                  }}>
                    {bbPackage.title || '2 Months Basketball Coaching Package'} ({bbPackage.classesCount || 16} Classes)
                  </h2>
                  <p style={{ fontSize: '13px', color: '#bfdbfe', margin: 0, lineHeight: 1.5 }}>
                    {bbPackage.classesCount || 16} Total Classes • 2x Weekly FIBA Training • Al Nahyan Arena • Free Official Jersey
                  </p>
                </div>

                {/* Price Breakdown Box */}
                <div style={{
                  textAlign: 'right',
                  backgroundColor: '#040b21',
                  padding: '12px 20px',
                  borderRadius: '16px',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 700 }}>
                    Regular: AED {bbPackage.originalPriceAED || (Number(bbPackage.priceAED) + 250)}
                  </div>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: 900,
                    color: '#facc15',
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    lineHeight: 1,
                    marginTop: '2px'
                  }}>
                    AED {bbPackage.priceAED}
                  </div>
                  <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                    All-Inclusive (Save AED {Math.max(0, (bbPackage.originalPriceAED || (Number(bbPackage.priceAED) + 250)) - Number(bbPackage.priceAED))})
                  </span>
                </div>
              </div>

              {/* Package Included Checklist */}
              <div style={{
                marginTop: '18px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px',
                fontSize: '12px',
                color: '#bfdbfe'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
                  <span>2x Weekly Pro Hardwood Coaching</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
                  <span>Dr. Dish 500-Shot Rapid Analytics</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
                  <span>Free Official Strategy Player Jersey</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
                  <span>Chilled Indoor Arena & Locker Access</span>
                </div>
              </div>
            </div>

            {/* Candidate & Contact Details Card */}
            <div style={{
              padding: '24px',
              borderRadius: '24px',
              backgroundColor: '#071233',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                fontSize: '18px',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <User style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
                <span>Student & Contact Information</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#bfdbfe', marginBottom: '20px' }}>
                Please provide your contact email and phone number for session confirmation and digital VIP pass delivery.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

                {/* Full Name */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Student / Player Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: '#04091a',
                      border: nameError ? '1.5px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.4)',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  {nameError && <span style={{ fontSize: '11px', color: '#f87171', marginTop: '4px', display: 'block' }}>{nameError}</span>}
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Gmail Address (@gmail.com only) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }} />
                    <input
                      type="email"
                      required
                      placeholder="e.g. parent.alex@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '12px',
                        backgroundColor: '#04091a',
                        border: emailError ? '1.5px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.4)',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {emailError && <span style={{ fontSize: '11px', color: '#f87171', marginTop: '4px', display: 'block' }}>{emailError}</span>}
                </div>

                {/* Phone Number - 9 Digits Only */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', display: 'block' }}>
                      Phone (9 Digits) *
                    </label>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {phone.length}/9
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '12px',
                    backgroundColor: '#04091a',
                    border: phoneError ? '1.5px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.4)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '12px 14px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      borderRight: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#60a5fa',
                      fontWeight: 800,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Phone style={{ width: '15px', height: '15px', color: '#60a5fa' }} />
                      <span>+971</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={9}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="50 123 4567"
                      value={phone}
                      onChange={(e) => {
                        const digits = format10DigitPhone(e.target.value);
                        setPhone(digits);
                        if (phoneError) setPhoneError('');
                      }}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {phoneError && <span style={{ fontSize: '11px', color: '#f87171', marginTop: '4px', display: 'block' }}>{phoneError}</span>}
                </div>

                {/* Age & Skill Tier */}
                <CustomDropdown
                  label="Age Category / Coaching Tier"
                  value={ageCategory}
                  onChange={setAgeCategory}
                  options={[
                    { value: 'kids', label: 'Rookie Ballers (Ages 4–8)' },
                    { value: 'youth', label: 'Junior Pro & Shooting Lab (Ages 9–14)' },
                    { value: 'elite', label: 'Elite High-Performance Prep (Ages 15–18)' },
                    { value: 'adult', label: 'Adult 5v5 League & Open Runs (18+)' }
                  ]}
                />

                {/* Preferred Schedule */}
                <CustomDropdown
                  label="Preferred Training Days"
                  value={trainingDays}
                  onChange={setTrainingDays}
                  options={[
                    { value: 'Sat & Sun (6:00 PM) - Al Nahyan Arena', label: 'Saturday & Sunday (6:00 PM) - Al Nahyan Arena' },
                    { value: 'Sat & Wed (6:00 PM) - Al Nahyan Arena', label: 'Saturday & Wednesday (6:00 PM) - Al Nahyan Arena' },
                    { value: 'Sun & Wed (6:00 PM) - Al Nahyan Arena', label: 'Sunday & Wednesday (6:00 PM) - Al Nahyan Arena' },
                    { value: 'Flexible (Sat, Sun, Wed @ 6:00 PM) - Al Nahyan Arena', label: 'Flexible 2x/Week (Sat, Sun or Wed @ 6:00 PM)' }
                  ]}
                />

                {/* Jersey Size */}
                <CustomDropdown
                  label="Complimentary Official Jersey Size"
                  value={jerseySize}
                  onChange={setJerseySize}
                  options={[
                    { value: 'Kids S (Ages 4-6)', label: 'Kids S (Ages 4–6)' },
                    { value: 'Kids M (Ages 7-9)', label: 'Kids M (Ages 7–9)' },
                    { value: 'Youth L / Adult S', label: 'Youth L / Adult S' },
                    { value: 'Adult M', label: 'Adult M' },
                    { value: 'Adult L', label: 'Adult L' },
                    { value: 'Adult XL', label: 'Adult XL' }
                  ]}
                />

              </div>

            </div>

            {/* Next Step Action Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '12px', color: '#93c5fd' }}>
                ⚡ Offer locked: <strong>500 AED</strong> for 2 full months.
              </div>

              <button
                type="submit"
                style={{
                  padding: '16px 36px',
                  borderRadius: '16px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 900,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(147, 197, 253, 0.4)',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Continue to Payment (500 AED)</span>
                <ChevronRight style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

          </form>
        )}

        {/* STEP 2: PAYMENT (PAY THROUGH CARD OR THROUGH BANK) */}
        {currentStep === 2 && (
          <form onSubmit={handleFinalPayment} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Payment Summary Bar */}
            <div style={{
              padding: '18px 22px',
              borderRadius: '20px',
              backgroundColor: '#09153d',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>Selected Package</span>
                <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', margin: '2px 0 0 0' }}>
                  2 Month Basketball VIP Pass • {fullName}
                </h4>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 700 }}>AED 750</span>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#facc15', fontFamily: 'var(--font-heading)' }}>
                  AED 500.00
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div style={{
              padding: '24px',
              borderRadius: '24px',
              backgroundColor: '#071233',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <h3 style={{
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                fontSize: '18px',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '16px'
              }}>
                Choose Payment Method
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: paymentMethod === 'card' ? 'rgba(37, 99, 235, 0.3)' : '#04091a',
                    border: paymentMethod === 'card' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '13px'
                  }}
                >
                  <CreditCard style={{ width: '18px', height: '18px', color: paymentMethod === 'card' ? '#38bdf8' : '#94a3b8' }} />
                  <span>Pay with Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: paymentMethod === 'bank' ? 'rgba(37, 99, 235, 0.3)' : '#04091a',
                    border: paymentMethod === 'bank' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '13px'
                  }}
                >
                  <Building2 style={{ width: '18px', height: '18px', color: paymentMethod === 'bank' ? '#38bdf8' : '#94a3b8' }} />
                  <span>Pay via Bank Transfer (UAE)</span>
                </button>
              </div>

              {/* CARD PAYMENT FORM */}
              {paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {cardError && (
                    <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', fontSize: '12px' }}>
                      {cardError}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ALEX MORGAN"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        backgroundColor: '#04091a',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Card Number *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <CreditCard style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }} />
                      <input
                        type="text"
                        maxLength="19"
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        style={{
                          width: '100%',
                          padding: '12px 16px 12px 42px',
                          borderRadius: '12px',
                          backgroundColor: '#04091a',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          color: '#ffffff',
                          fontSize: '13px',
                          letterSpacing: '1px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Expiration Date (MM/YY) *
                      </label>
                      <input
                        type="text"
                        maxLength="5"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                          setCardExpiry(val);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: '#04091a',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          color: '#ffffff',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        CVV / CVC (3 Digits) *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#64748b' }} />
                        <input
                          type="password"
                          maxLength="4"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 40px',
                            borderRadius: '12px',
                            backgroundColor: '#04091a',
                            border: '1px solid rgba(59, 130, 246, 0.4)',
                            color: '#ffffff',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* BANK TRANSFER DETAILS */}
              {paymentMethod === 'bank' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Official Strategy Bank Account Card */}
                  <div style={{
                    padding: '18px',
                    borderRadius: '16px',
                    backgroundColor: '#040a1c',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)',
                    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.4)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8', fontWeight: 800, fontSize: '13px' }}>
                      <Building2 style={{ width: '16px', height: '16px' }} />
                      <span>Official Strategy Basketball Bank Account (UAE)</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Bank</span>
                        <strong style={{ fontSize: '13px', color: '#ffffff' }}>Emirates NBD</strong>
                      </div>

                      <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Beneficiary Name</span>
                        <strong style={{ fontSize: '13px', color: '#ffffff' }}>Strategy Sports Academy LLC</strong>
                      </div>

                      <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', gridColumn: '1 / -1' }}>
                        <span style={{ fontSize: '10px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>IBAN (UAE Dirham)</span>
                        <strong style={{ fontSize: '13px', color: '#facc15', fontFamily: 'monospace', letterSpacing: '1px' }}>
                          AE24 0260 0012 3456 7890 01
                        </strong>
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', color: '#bfdbfe', marginTop: '10px', lineHeight: 1.4 }}>
                      💡 Transfer exactly <strong>500.00 AED</strong> via your mobile banking app or ATM, then enter your transaction reference number below for instant activation.
                    </div>
                  </div>

                  {bankError && (
                    <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', fontSize: '12px' }}>
                      {bankError}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Sender Account Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Name on your bank account"
                        value={bankSenderName}
                        onChange={(e) => setBankSenderName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: '#04091a',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          color: '#ffffff',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Transaction Ref / Receipt No. *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TRX-982314 or Ref ID"
                        value={bankTxRef}
                        onChange={(e) => setBankTxRef(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: '#04091a',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          color: '#ffffff',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                style={{
                  padding: '14px 24px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer'
                }}
              >
                Back to Details
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  padding: '16px 40px',
                  borderRadius: '16px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 900,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(147, 197, 253, 0.4)',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.5)',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  opacity: isProcessing ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isProcessing ? (
                  <span>Processing VIP Enrollment...</span>
                ) : (
                  <>
                    <ShieldCheck style={{ width: '18px', height: '18px' }} />
                    <span>Pay 500 AED & Activate Pass</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* STEP 3: OFFICIAL VIP PASS CONFIRMATION */}
        {currentStep === 3 && orderTicket && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
              }}>
                <Check style={{ width: '32px', height: '32px', strokeWidth: 3 }} />
              </div>

              <h2 style={{
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                fontSize: '28px',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '6px'
              }}>
                Enrollment Confirmed & VIP Pass Issued!
              </h2>

              <p style={{ fontSize: '13px', color: '#bfdbfe', maxWidth: '520px', margin: '0 auto', lineHeight: 1.5 }}>
                Thank you, <strong>{orderTicket.studentName}</strong>! Your 2-Month VIP Basketball Coaching Pass has been activated at the discounted 500 AED rate.
              </p>
            </div>

            {/* Official Digital VIP Pass Card */}
            <div style={{
              width: '100%',
              maxWidth: '560px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #091a45 0%, #061130 50%, #03081c 100%)',
              border: '2px solid rgba(56, 189, 248, 0.7)',
              boxShadow: '0 0 50px rgba(56, 189, 248, 0.35)',
              overflow: 'hidden',
              position: 'relative'
            }}>

              {/* Pass Header */}
              <div style={{
                padding: '16px 20px',
                backgroundColor: 'rgba(37, 99, 235, 0.25)',
                borderBottom: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy style={{ width: '18px', height: '18px', color: '#facc15' }} />
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#fde047', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Strategy Basketball Academy VIP Pass
                  </span>
                </div>

                <div style={{
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 900
                }}>
                  PAID: 500 AED
                </div>
              </div>

              {/* Pass Details */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Student Athlete</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: '2px 0 0 0' }}>
                      {orderTicket.studentName}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Pass ID</span>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>
                      {orderTicket.orderId}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', display: 'block' }}>Program Tier</span>
                    <strong style={{ color: '#ffffff' }}>{orderTicket.ageCategory}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', display: 'block' }}>Schedule</span>
                    <strong style={{ color: '#ffffff' }}>{orderTicket.trainingSchedule}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', display: 'block' }}>Jersey Size</span>
                    <strong style={{ color: '#ffffff' }}>{orderTicket.jerseySize}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', display: 'block' }}>Payment Reference</span>
                    <strong style={{ color: '#6ee7b7' }}>{orderTicket.paymentMethod}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#bfdbfe', marginBottom: '16px' }}>
                  <MapPin style={{ width: '14px', height: '14px', color: '#38bdf8', flexShrink: 0 }} />
                  <span>{orderTicket.venue}</span>
                </div>

                {/* QR Code / Barcode Area */}
                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#facc15' }}>PROMO APPLIED: {orderTicket.promoCode}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Present this pass at Arena Reception Desk</div>
                  </div>

                  <div style={{
                    padding: '6px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff'
                  }}>
                    <QrCode style={{ width: '42px', height: '42px', color: '#091a45' }} />
                  </div>
                </div>

              </div>

            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer style={{ width: '15px', height: '15px' }} />
                <span>Print / Save Pass</span>
              </button>

              <button
                onClick={() => {
                  if (navigateTo) navigateTo('basketball');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: '1px solid rgba(147, 197, 253, 0.4)',
                  cursor: 'pointer'
                }}
              >
                Return to Basketball Page
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
