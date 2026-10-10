import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { TextInput, TextareaInput, SelectInput } from '../../components/FormInputs';
import StatusBadge from '../../components/StatusBadge';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  GraduationCap,
  ShoppingBag,
  Truck
} from 'lucide-react';

export default function FaqsView() {
  const [faqs, setFaqs] = useState([
    {
      id: 'faq_01',
      question: 'How do I book a Free Trial Skating class?',
      answer: 'Parents can schedule a free trial directly through our website booking form or trial assistant. We provide complimentary skates and safety gear for the first session.',
      category: 'academy',
      displayOrder: 1,
      status: 'active'
    },
    {
      id: 'faq_02',
      question: 'What is included in the 2-Months Skating Training Package?',
      answer: 'The 2-Months package includes 16 guided on-track sessions, an official STRATEGY team jersey kit, and mid-term progress medal grading.',
      category: 'academy',
      displayOrder: 2,
      status: 'active'
    },
    {
      id: 'faq_03',
      question: 'What is the standard delivery timeframe across the UAE?',
      answer: 'Standard shipping takes 1 to 2 business days across Dubai, Abu Dhabi, and Sharjah via Emirates Post express couriers.',
      category: 'shipping',
      displayOrder: 3,
      status: 'active'
    },
    {
      id: 'faq_04',
      question: 'Are the STRATEGY Speed Carbon inline skates heat-moldable?',
      answer: 'Yes, our carbon fiber racing shells are 100% heat-moldable. Our pro staff in Dubai provides custom fitting sessions for optimal comfort.',
      category: 'gear',
      displayOrder: 4,
      status: 'active'
    },
    {
      id: 'faq_05',
      question: 'Can we reschedule a training session if a student is sick?',
      answer: 'Yes, parents may flexibly reschedule any class with at least 24 hours advance notification on WhatsApp without losing session credit.',
      category: 'academy',
      displayOrder: 5,
      status: 'active'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'academy',
    displayOrder: 1,
    status: 'active'
  });

  const handleOpenCreate = () => {
    setEditingFaqId(null);
    setFormData({
      question: '',
      answer: '',
      category: 'academy',
      displayOrder: faqs.length + 1,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaqId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      displayOrder: faq.displayOrder,
      status: faq.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingFaqId) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === editingFaqId ? { ...f, ...formData } : f))
      );
      setToastMessage('FAQ updated successfully.');
    } else {
      const newFaq = {
        ...formData,
        id: `faq_${Date.now()}`
      };
      setFaqs((prev) => [...prev, newFaq]);
      setToastMessage('New FAQ created.');
    }
    setIsModalOpen(false);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDelete = (faqId) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs((prev) => prev.filter((f) => f.id !== faqId));
      setToastMessage('FAQ deleted.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'academy':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[10px] font-semibold">
            <GraduationCap className="w-3 h-3" />
            Academy & Training
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-semibold">
            <Truck className="w-3 h-3" />
            Shipping & Orders
          </span>
        );
      case 'gear':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-semibold">
            <ShoppingBag className="w-3 h-3" />
            Gear & Sizing
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-semibold">
            General
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed top-16 right-6 z-[100] bg-zinc-900 text-white px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>FAQs & Customer Knowledge Base</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage public academy inquiries, gear guidance, and storefront order questions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-zinc-200/90 rounded-xl shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer font-medium ${
              activeCategory === 'all'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            All Questions ({faqs.length})
          </button>
          <button
            onClick={() => setActiveCategory('academy')}
            className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer font-medium ${
              activeCategory === 'academy'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Academy & Training
          </button>
          <button
            onClick={() => setActiveCategory('shipping')}
            className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer font-medium ${
              activeCategory === 'shipping'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Orders & Shipping
          </button>
          <button
            onClick={() => setActiveCategory('gear')}
            className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer font-medium ${
              activeCategory === 'gear'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Gear & Sizing
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-zinc-900 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition"
          />
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-white border border-zinc-200/90 rounded-xl text-zinc-500 text-xs">
            No questions found matching your filter criteria.
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="p-4 bg-white border border-zinc-200/90 rounded-xl space-y-2 hover:border-zinc-300 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(faq.category)}
                  <StatusBadge status={faq.status} size="sm" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(faq)}
                    className="p-1 text-zinc-400 hover:text-zinc-900 transition cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-1 text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-zinc-900 text-sm">{faq.question}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-normal">{faq.answer}</p>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaqId ? 'Edit Knowledge Base FAQ' : 'Add New FAQ'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <TextInput
            label="Question Title"
            value={formData.question}
            onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
            placeholder="e.g. How do I book a trial session?"
            required
          />

          <SelectInput
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            options={[
              { label: 'Academy & Training', value: 'academy' },
              { label: 'Orders & Shipping', value: 'shipping' },
              { label: 'Gear & Sizing', value: 'gear' },
            ]}
          />

          <TextareaInput
            label="Detailed Answer"
            rows={4}
            value={formData.answer}
            onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
            placeholder="Provide a helpful and clear answer..."
            required
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-lg text-xs transition cursor-pointer"
            >
              Save FAQ
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
