import React, { useState, useEffect } from 'react';
import { TextInput, CurrencyInput } from '../../components/FormInputs';
import { Save, CheckCircle2, Store, Truck, Phone } from 'lucide-react';

function Card({ icon: Icon, title, children }) {
  return (
    <section className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-4">
      <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
        <Icon className="w-5 h-5 text-zinc-500" />
        {title}
      </h2>
      {children}
    </section>
  );
}

// Shop details: name, tax, delivery prices and contact info.
export default function SettingsView() {
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [storeData, setStoreData] = useState({
    storeName: 'STRATEGY Athletics & Gear',
    currency: 'AED',
    vatPercent: 5,
    trnNumber: '100293847500003',
    freeShippingThresholdFils: 30000,
    shippingFeeFils: 2000,
    contactEmail: 'support@strategy.ae',
    contactPhone: '+971 4 330 0000',
    address: 'STRATEGY Sports Tower, Al Wasl Road, Dubai, UAE',
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/admin/settings/store-settings');
        const result = await res.json();
        if (result.success && result.data?.settings) setStoreData(result.data.settings);
      } catch {
        // keep defaults
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    let ok = false;
    try {
      const token = localStorage.getItem('strategy_admin_token');
      const res = await fetch('http://localhost:5000/api/v1/admin/settings/store-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(storeData),
      });
      ok = res.ok;
    } catch {
      ok = false; // server not reachable
    }
    setSaving(false);
    setToastMessage(ok ? 'Settings saved.' : 'Not saved: the shop server is offline.');
    setTimeout(() => setToastMessage(''), ok ? 3000 : 6000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {toastMessage && (
        <div
          className={`!m-0 fixed top-20 right-6 z-[100] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 font-medium text-sm ${
            toastMessage.startsWith('Not saved') ? 'bg-rose-700' : 'bg-zinc-900'
          }`}
        >
          {!toastMessage.startsWith('Not saved') && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toastMessage}</span>
        </div>
      )}

      <p className="text-base text-zinc-500">Your shop name, delivery prices and contact details.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card icon={Store} title="Shop details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="Shop name" name="storeName" value={storeData.storeName} onChange={handleChange} required />
            <TextInput
              label="Tax number (TRN)"
              name="trnNumber"
              value={storeData.trnNumber}
              onChange={handleChange}
              hint="Printed on invoices"
              required
            />
            <TextInput
              label="VAT (%)"
              name="vatPercent"
              type="number"
              value={storeData.vatPercent}
              onChange={handleChange}
              hint="Usually 5% in the UAE"
              required
            />
          </div>
        </Card>

        <Card icon={Truck} title="Delivery">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CurrencyInput
              label="Free delivery for orders over"
              valueFils={storeData.freeShippingThresholdFils}
              onChangeFils={(fils) => setStoreData((prev) => ({ ...prev, freeShippingThresholdFils: fils }))}
            />
            <CurrencyInput
              label="Delivery price for smaller orders"
              valueFils={storeData.shippingFeeFils}
              onChangeFils={(fils) => setStoreData((prev) => ({ ...prev, shippingFeeFils: fils }))}
            />
          </div>
        </Card>

        <Card icon={Phone} title="Contact details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="Email" name="contactEmail" value={storeData.contactEmail} onChange={handleChange} required />
            <TextInput label="Phone" name="contactPhone" value={storeData.contactPhone} onChange={handleChange} required />
          </div>
          <TextInput label="Address" name="address" value={storeData.address} onChange={handleChange} />
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white font-medium text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving…' : 'Save settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
