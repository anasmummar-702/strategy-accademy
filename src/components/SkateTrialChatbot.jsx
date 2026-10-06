import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  X, 
  Check, 
  CheckCheck,
  Phone, 
  Video, 
  MoreVertical, 
  Smile, 
  Paperclip, 
  Camera, 
  Mic, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Code, 
  Copy, 
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Lock
} from 'lucide-react';

export default function SkateTrialChatbot({ 
  onConfirmBooking,
  isFloating = false,
  isOpen = true,
  onClose,
  onMinimize
}) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'json' | 'dialogflow'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState('');
  const [inputText, setInputText] = useState('');

  // Audio tone generator for bot messages
  const playBeep = (freq = 587.33, type = 'sine') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio fallback
    }
  };

  // Structured booking entity state
  const [bookingData, setBookingData] = useState({
    childName: 'Zaid',
    age: '8 Years',
    sport: 'Skating',
    location: 'Al Nahyan',
    day: 'Saturday',
    time: '10:00 AM to 12:00 PM',
    shoeSize: 'EU 34 (Kids UK 2)',
    hasExperience: 'Beginner (Can stand/glide)',
    hasSkates: 'No, need sanitized rental skates (FREE Included)',
    trialFee: 'AED 30',
    status: 'pending'
  });

  const [collectStep, setCollectStep] = useState(0);

  // Chat message history with WhatsApp styling
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      content: `Hello! 👋 I'm Coach Leo from Strategy Skate Academy. Welcome to our 45-Minute Skating Trial Class experience (only 30 AED with sanitized skates & full safety armor included!).`,
      time: '10:30 AM'
    },
    {
      id: 2,
      sender: 'bot',
      type: 'options',
      content: `To book the skating trial class, please provide the following details:\n• Child's full name\n• Child's age\n• Preferred location\n• Preferred day\n• Shoe size\n• Does your child have skating experience?\n• Does your child have skates?`,
      options: [
        { label: '🚀 Start Trial Booking (30 AED)', action: 'start_booking' },
        { label: '⚡ Fast Demo Booking (Zaid, 8yo)', action: 'fast_demo' },
        { label: '📍 View Available Locations', action: 'show_locations' },
        { label: '🛡️ Safety Pad & Skates Info', action: 'show_gear_info' }
      ],
      time: '10:31 AM'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addBotMessage = (content, options = null, type = 'text', delay = 600) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      playBeep(659.25);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          type: options ? 'options' : type,
          content,
          options,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, delay);
  };

  const addUserMessage = (text) => {
    playBeep(440);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        type: 'text',
        content: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Handle Quick Action Selection
  const handleQuickAction = (action, label) => {
    addUserMessage(label);

    if (action === 'start_booking') {
      setCollectStep(1);
      addBotMessage(
        "Wonderful! Let's get your child registered for their first glide session. 😊\n\nWhat is your **Child's full name**?",
        [
          { label: 'Zaid Al-Mansoor', action: 'set_name', value: 'Zaid Al-Mansoor' },
          { label: 'Maya Smith', action: 'set_name', value: 'Maya Smith' },
          { label: 'Leo Chen', action: 'set_name', value: 'Leo Chen' }
        ]
      );
    } else if (action === 'set_name') {
      const name = label;
      setBookingData((prev) => ({ ...prev, childName: name }));
      setCollectStep(2);
      addBotMessage(
        `Great to meet ${name}! 🌟\n\nHow old is ${name}? (**Child's age**):`,
        [
          { label: '4 - 6 Years (PeeWee)', action: 'set_age', value: '5 Years' },
          { label: '7 - 10 Years (Junior)', action: 'set_age', value: '8 Years' },
          { label: '11 - 15 Years (Cadet)', action: 'set_age', value: '12 Years' },
          { label: '16+ Years (Adult)', action: 'set_age', value: '16+ Years' }
        ]
      );
    } else if (action === 'set_age') {
      const age = label;
      setBookingData((prev) => ({ ...prev, age }));
      setCollectStep(3);
      addBotMessage(
        `Got it! Which Strategy Academy branch is your **Preferred location**?`,
        [
          { label: '📍 Al Nahyan', action: 'set_location', value: 'Al Nahyan' },
          { label: '📍 Al Bateen', action: 'set_location', value: 'Al Bateen' },
          { label: '📍 Khalifa City', action: 'set_location', value: 'Khalifa City' }
        ]
      );
    } else if (action === 'set_location') {
      const location = label.replace(/^📍\s*/, '').trim();
      setBookingData((prev) => ({ ...prev, location }));
      setCollectStep(4);
      
      let scheduleOptions = [];
      if (location === 'Al Nahyan') {
        scheduleOptions = [
          { label: '🗓️ Saturday • 10:00 AM to 12:00 PM', action: 'set_day' },
          { label: '🗓️ Sunday • 10:00 AM to 12:00 PM', action: 'set_day' }
        ];
      } else if (location === 'Al Bateen') {
        scheduleOptions = [
          { label: '🗓️ Wednesday • 5:00 PM', action: 'set_day' },
          { label: '🗓️ Thursday • 5:00 PM', action: 'set_day' },
          { label: '🗓️ Friday • 5:00 PM', action: 'set_day' }
        ];
      } else { // Khalifa City
        scheduleOptions = [
          { label: '🗓️ Wednesday • 5:00 PM', action: 'set_day' },
          { label: '🗓️ Saturday • 5:00 PM', action: 'set_day' }
        ];
      }

      addBotMessage(
        `Excellent choice! What is your **Preferred day & time** for the trial at ${location}?`,
        scheduleOptions
      );
    } else if (action === 'set_day') {
      const parts = label.replace('🗓️ ', '').split(' • ');
      const day = parts[0];
      const time = parts[1];
      setBookingData((prev) => ({ ...prev, day, time }));
      setCollectStep(5);
      addBotMessage(
        `Noted: ${day} at ${time}. ⏰\n\nWhat is your child's **Shoe size**? (We prepare sanitized rental skates in advance):`,
        [
          { label: 'EU 28-30 (Kids UK 10-12)', action: 'set_size', value: 'EU 28-30' },
          { label: 'EU 31-34 (Kids UK 13-2)', action: 'set_size', value: 'EU 31-34' },
          { label: 'EU 35-37 (Junior UK 3-4)', action: 'set_size', value: 'EU 35-37' },
          { label: 'EU 38-40 (Youth/Adult)', action: 'set_size', value: 'EU 38-40' }
        ]
      );
    } else if (action === 'set_size') {
      const size = label;
      setBookingData((prev) => ({ ...prev, shoeSize: size }));
      setCollectStep(6);
      addBotMessage(
        `Perfect. **Does your child have skating experience?**`,
        [
          { label: '🐣 First Timer (Never skated before)', action: 'set_exp', value: 'First Timer' },
          { label: '⛸️ Beginner (Can stand & glide a little)', action: 'set_exp', value: 'Beginner' },
          { label: '⚡ Intermediate (Can turn & brake)', action: 'set_exp', value: 'Intermediate' }
        ]
      );
    } else if (action === 'set_exp') {
      const exp = label;
      setBookingData((prev) => ({ ...prev, hasExperience: exp }));
      setCollectStep(7);
      addBotMessage(
        `Final detail: **Does your child have skates?**`,
        [
          { label: '🛡️ No, need sanitized rental skates (FREE Included)', action: 'set_skates', value: 'No, need rental skates' },
          { label: '👟 Yes, we will bring our own skates', action: 'set_skates', value: 'Yes, own skates' }
        ]
      );
    } else if (action === 'set_skates') {
      const skates = label;
      const updatedBooking = { ...bookingData, hasSkates: skates, status: 'confirmed' };
      setBookingData(updatedBooking);
      setCollectStep(8);

      // Phase 5: Confirmation & Attendance Prep (Exact specified template)
      setTimeout(() => {
        playBeep(880, 'triangle');
        const confirmationTemplate = `Your skating trial class is confirmed ✅\n• Child name: ${updatedBooking.childName}\n• Age: ${updatedBooking.age}\n• Sport: Skating\n• Location: ${updatedBooking.location}\n• Day: ${updatedBooking.day}\n• Time: ${updatedBooking.time}\n• Trial fee: AED 30\n\n⚠️ Please arrive 15 minutes before the class so the coach can help your child wear the skates and safety protection.\n\nWe are excited to welcome your child at Strategy Academy 😊`;

        addBotMessage(
          confirmationTemplate,
          [
            { label: '🌟 Test Phase 6: Post-Trial Conversion Follow-Up', action: 'trigger_phase_6' },
            { label: '🎫 Open Official Pass Ticket', action: 'sync_to_page' },
            { label: '📋 View JSON & Dialogflow Schema', action: 'view_schema' }
          ],
          'confirmation',
          700
        );

        if (onConfirmBooking) {
          onConfirmBooking(updatedBooking);
        }
      }, 500);

    } else if (action === 'fast_demo') {
      const demoBooking = {
        childName: 'Zaid',
        age: '8 Years',
        sport: 'Skating',
        location: 'Al Nahyan',
        day: 'Saturday',
        time: '10:00 AM to 12:00 PM',
        shoeSize: 'EU 34 (Kids UK 2)',
        hasExperience: 'Beginner (Can stand/glide)',
        hasSkates: 'No, need sanitized rental skates (FREE Included)',
        trialFee: 'AED 30',
        status: 'confirmed'
      };
      setBookingData(demoBooking);
      setCollectStep(8);

      const confirmationTemplate = `Your skating trial class is confirmed ✅\n• Child name: ${demoBooking.childName}\n• Age: ${demoBooking.age}\n• Sport: Skating\n• Location: ${demoBooking.location}\n• Day: ${demoBooking.day}\n• Time: ${demoBooking.time}\n• Trial fee: AED 30\n\n⚠️ Please arrive 15 minutes before the class so the coach can help your child wear the skates and safety protection.\n\nWe are excited to welcome your child at Strategy Academy 😊`;

      addBotMessage(
        confirmationTemplate,
        [
          { label: '🌟 Test Phase 6: Post-Trial Conversion Follow-Up', action: 'trigger_phase_6' },
          { label: '🎫 Open Official Pass Ticket', action: 'sync_to_page' },
          { label: '📋 View JSON & Dialogflow Schema', action: 'view_schema' }
        ],
        'confirmation',
        400
      );

      if (onConfirmBooking) {
        onConfirmBooking(demoBooking);
      }

    } else if (action === 'trigger_phase_6') {
      // Phase 6: Post-Trial Conversion & Follow-Up (Exact specified template)
      const followUpMsg = `We hope ${bookingData.childName} had a wonderful time in today's session! 🌟 The coach has completed the level evaluation and shared gear recommendations. Based on the assessment, here are our available membership options:\n\n• 1 Month (8 classes): AED 500 total (includes AED 50 uniform + free registration)\n• 2 Months (16 classes): AED 800 total (Save AED 150)\n• 3 Months (Unlimited): AED 1,050 total (Save AED 300)\n\nWhich package would you like to enroll ${bookingData.childName} into?`;

      addBotMessage(
        followUpMsg,
        [
          { label: '🥇 1 Month (8 classes) • AED 500', action: 'enroll_pkg', pkg: '1 Month (8 classes) - AED 500' },
          { label: '🥈 2 Months (16 classes) • AED 800 (Save 150)', action: 'enroll_pkg', pkg: '2 Months (16 classes) - AED 800' },
          { label: '🏆 3 Months (Unlimited) • AED 1,050 (Save 300)', action: 'enroll_pkg', pkg: '3 Months (Unlimited) - AED 1,050' },
          { label: '📞 Talk to Head Coach', action: 'talk_director' }
        ],
        'conversion',
        700
      );

    } else if (action === 'enroll_pkg') {
      addBotMessage(
        `🎉 Fantastic! We have reserved ${bookingData.childName}'s spot in the **${label}** package!\n\nOur enrollment desk has prepared the Academy Welcome Kit (free uniform + student jersey). A coach supervisor will contact you on WhatsApp to finalize your class schedule. Welcome to Strategy Academy! 🏆`,
        [
          { label: '🔄 Restart Demo Conversation', action: 'restart' },
          { label: '📋 View Chatbot Data Schema', action: 'view_schema' }
        ]
      );

    } else if (action === 'talk_director') {
      addBotMessage(
        `📞 Our head coach and Academy Director (Coach Dave) will call you within 15 minutes at your registered phone number. You can also reach our rink reception directly at **+971 4 800 SKATE**.`,
        [{ label: '🔄 Start New Booking', action: 'restart' }]
      );

    } else if (action === 'show_locations') {
      addBotMessage(
        `📍 **Our 3 Official UAE Rink Locations:**\n\n1. **Al Nahyan**: Saturday & Sunday (10:00 AM to 12:00 PM).\n2. **Al Bateen**: Wednesday, Thursday & Friday (5:00 PM).\n3. **Khalifa City**: Wednesday & Saturday (5:00 PM).\n\nAll venues have free parking and sanitized skate fitting stations!`,
        [
          { label: '🎟️ Book 30 AED Trial Now', action: 'start_booking' },
          { label: '⚡ Fast Demo Booking', action: 'fast_demo' }
        ]
      );

    } else if (action === 'show_gear_info') {
      addBotMessage(
        `🛡️ **What's Included in the 30 AED Trial:**\n\n• High-precision adjustable inline/quad rental skates (sanitized before every session)\n• Pro-grade impact helmet\n• Dual-layer wrist guards, elbow guards & knee pads\n• 1:1 supervision with Certified World Skate Coaches\n\nYou only need to wear comfortable sports clothes and long socks!`,
        [
          { label: '🎟️ Book 30 AED Trial Now', action: 'start_booking' }
        ]
      );

    } else if (action === 'sync_to_page') {
      if (onConfirmBooking) {
        onConfirmBooking(bookingData);
      }
      addBotMessage(
        `✅ Your digital trial pass ticket has been generated on the main trial page! You can review or print your barcode pass anytime.`,
        [{ label: '🌟 Test Phase 6: Post-Trial Conversion', action: 'trigger_phase_6' }]
      );

    } else if (action === 'view_schema') {
      setActiveTab('json');

    } else if (action === 'restart') {
      setCollectStep(0);
      setMessages([
        {
          id: Date.now(),
          sender: 'bot',
          type: 'text',
          content: `Chat session refreshed! 👋 Ready to book another trial session?`,
          time: 'Just now'
        },
        {
          id: Date.now() + 1,
          sender: 'bot',
          type: 'options',
          content: `To book the skating trial class, please provide the following details:\n• Child's full name\n• Child's age\n• Preferred location\n• Preferred day\n• Shoe size\n• Does your child have skating experience?\n• Does your child have skates?`,
          options: [
            { label: '🚀 Start Trial Booking (30 AED)', action: 'start_booking' },
            { label: '⚡ Fast Demo Booking (Zaid, 8yo)', action: 'fast_demo' }
          ],
          time: 'Just now'
        }
      ]);
    }
  };

  // Handle Freeform Text Input
  const handleSendInput = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    addUserMessage(text);

    if (collectStep === 1) {
      setBookingData((prev) => ({ ...prev, childName: text }));
      setCollectStep(2);
      addBotMessage(
        `Pleasure to meet ${text}! 🌟 How old is ${text}?`,
        [
          { label: '4 - 6 Years', action: 'set_age', value: '5 Years' },
          { label: '7 - 10 Years', action: 'set_age', value: '8 Years' },
          { label: '11 - 15 Years', action: 'set_age', value: '12 Years' }
        ]
      );
    } else if (collectStep === 2) {
      setBookingData((prev) => ({ ...prev, age: text }));
      setCollectStep(3);
      addBotMessage(
        `Got it! Which location do you prefer?`,
        [
          { label: '📍 Al Nahyan', action: 'set_location', value: 'Al Nahyan' },
          { label: '📍 Al Bateen', action: 'set_location', value: 'Al Bateen' },
          { label: '📍 Khalifa City', action: 'set_location', value: 'Khalifa City' }
        ]
      );
    } else {
      const lower = text.toLowerCase();
      if (lower.includes('price') || lower.includes('fee') || lower.includes('cost') || lower.includes('how much')) {
        addBotMessage(
          `The 45-minute trial session is only **30 AED** (regularly 120 AED). It includes 1:1 certified coaching, sanitized rental skates, pro helmet, and all protective armor pads!`,
          [{ label: '🚀 Book Trial for 30 AED', action: 'start_booking' }]
        );
      } else if (lower.includes('where') || lower.includes('location') || lower.includes('address')) {
        addBotMessage(
          `We have 3 state-of-the-art rinks in the UAE: Al Nahyan, Al Bateen, and Khalifa City. Which one is closest to you?`,
          [
            { label: '📍 Al Nahyan', action: 'set_location', value: 'Al Nahyan' },
            { label: '📍 Al Bateen', action: 'set_location', value: 'Al Bateen' },
            { label: '📍 Khalifa City', action: 'set_location', value: 'Khalifa City' }
          ]
        );
      } else if (lower.includes('age') || lower.includes('young') || lower.includes('old')) {
        addBotMessage(
          `We welcome skaters from **Age 4 to 16+**! We have dedicated PeeWee classes (ages 4-6) with balance stabilizers, and Youth/Adult classes.`,
          [{ label: '🚀 Start Trial Booking (30 AED)', action: 'start_booking' }]
        );
      } else {
        addBotMessage(
          `Thanks for your message! To confirm your child's 30 AED trial class and prepare the sanitized skates, let's complete the quick registration:`,
          [
            { label: '🚀 Start Trial Booking (30 AED)', action: 'start_booking' },
            { label: '⚡ Fast Demo Booking (Zaid, 8yo)', action: 'fast_demo' }
          ]
        );
      }
    }
  };

  // Structured JSON export
  const structuredJsonExport = {
    chatbot_metadata: {
      bot_name: "Coach Leo - Strategy Skate Concierge",
      academy: "Strategy Skate Academy UAE",
      version: "2.4.0",
      sport: "Roller & Inline Skating",
      trial_price_aed: 30,
      session_duration: "45 Minutes"
    },
    phase_4_data_collection: {
      required_entities: [
        { key: "Child_Name", type: "sys.person", question: "Child's full name", current_value: bookingData.childName },
        { key: "Age", type: "sys.age", question: "Child's age", current_value: bookingData.age },
        { key: "Location", type: "sys.location", question: "Preferred location", current_value: bookingData.location },
        { key: "Day", type: "sys.date", question: "Preferred day", current_value: bookingData.day },
        { key: "Time", type: "sys.time", question: "Preferred time slot", current_value: bookingData.time },
        { key: "Shoe_Size", type: "sys.custom", question: "Shoe size", current_value: bookingData.shoeSize },
        { key: "Experience", type: "sys.custom", question: "Does your child have skating experience?", current_value: bookingData.hasExperience },
        { key: "Has_Skates", type: "sys.boolean", question: "Does your child have skates?", current_value: bookingData.hasSkates }
      ]
    },
    phase_5_confirmation: {
      quick_reply_code: "BOOKING_CONFIRMATION",
      template_structure: "Your skating trial class is confirmed ✅\n• Child name: {{Child_Name}} • Age: {{Age}} • Sport: Skating • Location: {{Location}} • Day: {{Day}} • Time: {{Time}} • Trial fee: AED 30\n⚠️ Please arrive 15 minutes before the class so the coach can help your child wear the skates and safety protection.\nWe are excited to welcome your child at Strategy Academy 😊",
      populated_payload: {
        Child_Name: bookingData.childName,
        Age: bookingData.age,
        Sport: "Skating",
        Location: bookingData.location,
        Day: bookingData.day,
        Time: bookingData.time,
        Trial_Fee: "AED 30"
      }
    },
    phase_6_post_trial_conversion: {
      quick_reply_code: "POST_TRIAL_FOLLOWUP",
      template_message: "We hope {{Child_Name}} had a wonderful time in today's session! 🌟 The coach has completed the level evaluation and shared gear recommendations. Based on the assessment, here are our available membership options:\n• 1 Month (8 classes): AED 500 total (includes AED 50 uniform + free registration) • 2 Months (16 classes): AED 800 total (Save AED 150) • 3 Months (Unlimited): AED 1,050 total (Save AED 300)\nWhich package would you like to enroll {{Child_Name}} into?",
      packages: [
        { id: "pkg_1m", title: "1 Month (8 classes)", fee_aed: 500, perk: "Includes AED 50 uniform + free registration" },
        { id: "pkg_2m", title: "2 Months (16 classes)", fee_aed: 800, perk: "Save AED 150" },
        { id: "pkg_3m", title: "3 Months (Unlimited)", fee_aed: 1050, perk: "Save AED 300" }
      ]
    }
  };

  const copyToClipboard = (text, formatName) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(''), 2500);
  };

  return (
    <div className={`w-full h-full bg-[#efeae2] flex flex-col font-['Inter',sans-serif] ${!isFloating ? 'rounded-3xl border border-emerald-900/20 shadow-2xl overflow-hidden h-[620px]' : ''}`}>
      
      {/* =========================================================================
          WHATSAPP SIGNATURE TOP BAR (#075E54 / #008069)
          ========================================================================= */}
      <div className="bg-[#008069] px-4 py-3 text-white flex items-center justify-between shadow-md shrink-0 select-none">
        
        {/* Left: Back / Minimize button & Coach Profile */}
        <div className="flex items-center gap-2.5">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
              title="Close WhatsApp"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Coach Avatar with WhatsApp Green Border */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-white overflow-hidden shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                alt="Coach Leo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="material-symbols-outlined text-[24px]">sports_martial_arts</span>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#008069] absolute bottom-0 right-0 animate-pulse" />
          </div>

          {/* Contact Details */}
          <div className="flex flex-col leading-tight cursor-pointer">
            <div className="flex items-center gap-1.5">
              <span className="font-['Outfit',sans-serif] font-bold text-sm text-white truncate max-w-[170px] sm:max-w-[210px]">
                Coach Leo • Strategy Academy
              </span>
              <span className="material-symbols-outlined text-[14px] text-cyan-200">verified</span>
            </div>
            <span className="text-[11px] text-emerald-100 font-medium">
              {isTyping ? 'typing…' : 'online'}
            </span>
          </div>
        </div>

        {/* Right: WhatsApp Video Call, Phone, More, & Sound controls */}
        <div className="flex items-center gap-2 text-white">
          <button 
            type="button" 
            onClick={() => playBeep(523.25)} 
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title="Video Call"
          >
            <Video className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            onClick={() => playBeep(587.33)} 
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title="Voice Call"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-all ml-1 flex items-center justify-center cursor-pointer"
              title="Close Chat (X)"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>



      {/* =========================================================================
          TAB 1: WHATSAPP CHAT CANVAS
          ========================================================================= */}
      {activeTab === 'chat' && (
        <>
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 whatsapp-bg text-xs">
            
            {/* WhatsApp End-to-End Encryption Notice Pill */}
            <div className="flex justify-center my-1">
              <div className="bg-[#ffeecd] text-[#54656f] text-[10px] text-center px-3 py-1.5 rounded-lg shadow-xs max-w-xs border border-[#ffdf9d] flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#795548] shrink-0" />
                <span>Messages and calls are end-to-end encrypted. Strategy Skate Academy Trial Desk.</span>
              </div>
            </div>

            {/* Date Separator Pill */}
            <div className="flex justify-center mb-2">
              <span className="bg-white/80 text-[#54656f] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs border border-[#d1c7b7]">
                TODAY
              </span>
            </div>

            {/* Render WhatsApp Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[80%] flex flex-col gap-1.5`}>
                  
                  {/* WhatsApp Message Bubble */}
                  <div
                    className={`p-3 text-[12.5px] leading-relaxed whitespace-pre-line text-[#111b21] ${
                      msg.sender === 'user'
                        ? 'whatsapp-bubble-out'
                        : 'whatsapp-bubble-in'
                    }`}
                  >
                    {msg.content}

                    {/* Timestamp & Read Receipts */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#667781] select-none">
                      <span>{msg.time}</span>
                      {msg.sender === 'user' && (
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      )}
                    </div>
                  </div>

                  {/* Render WhatsApp Quick Reply Action Buttons */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickAction(opt.action, opt.label)}
                          className="w-full text-left px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#008069] font-semibold text-xs rounded-xl shadow-xs border border-emerald-600/20 hover:border-emerald-600/50 transition-all flex items-center justify-between group active:scale-[0.98]"
                        >
                          <span className="truncate">{opt.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="whatsapp-bubble-in p-2.5 px-3.5 flex items-center gap-1.5 shadow-xs">
                  <span className="text-[11px] text-[#667781] italic">Coach Leo is typing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008069] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008069] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008069] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* =========================================================================
              WHATSAPP INPUT BAR (😊 📎 [Type a message] 📷 🎤 / ➤)
              ========================================================================= */}
          <form onSubmit={handleSendInput} className="p-2 sm:p-2.5 bg-[#f0f2f5] border-t border-[#e9edef] flex items-center gap-1.5 shrink-0">
            <div className="flex-1 bg-white rounded-2xl flex items-center px-3.5 py-1.5 border border-white shadow-xs focus-within:border-emerald-600 ml-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message"
                className="w-full text-xs !text-[#111b21] !bg-transparent focus:!outline-none placeholder:text-[#8696a0] !p-0 !border-none !shadow-none !m-0 !h-auto !leading-normal"
              />
            </div>

            {/* Green WhatsApp Send / Mic button */}
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-[#008069] hover:bg-[#00705b] text-white flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0"
              title={inputText.trim() ? "Send Message" : "Voice Message"}
            >
              {inputText.trim() ? (
                <Send className="w-4 h-4 ml-0.5" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </form>
        </>
      )}

      {/* =========================================================================
          TAB 2: STRUCTURED JSON SCHEMA EXPORT
          ========================================================================= */}
      {activeTab === 'json' && (
        <div className="flex-1 p-4 overflow-y-auto bg-slate-900 text-slate-100 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700">
              <span className="text-emerald-400 font-bold">structured_chatbot_data.json</span>
              <button
                onClick={() => copyToClipboard(JSON.stringify(structuredJsonExport, null, 2), 'json')}
                className="bg-[#008069] hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-[11px] flex items-center gap-1.5 transition-colors font-bold"
              >
                {copiedFormat === 'json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'json' ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
              {JSON.stringify(structuredJsonExport, null, 2)}
            </pre>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Payload contains Phase 4 collection, Phase 5 confirmation, & Phase 6 follow-up.</span>
            <button
              onClick={() => setActiveTab('chat')}
              className="text-emerald-400 underline font-bold"
            >
              Back to WhatsApp Chat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
