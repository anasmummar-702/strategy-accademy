import React, { useState } from 'react';
import Modal from '../components/Modal';
import { TextInput } from '../components/FormInputs';
import { adminApi } from '../services/adminApi';
import { Key, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PasswordResetModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('The new password needs at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('The two new passwords are not the same.');
      return;
    }

    setLoading(true);

    try {
      await adminApi.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess(false);
      }, 1500);
    } catch (err) {
      // Never pretend it worked: tell the person what happened.
      if (err?.details?.isNetworkError) {
        setError("The password can't be changed right now because the sign-in server isn't running. Nothing was changed.");
      } else if (err?.status === 401 || err?.status === 400) {
        setError('Your current password is not right. Nothing was changed.');
      } else {
        setError(`Could not change the password: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change password"
      subtitle="Choose a new password with at least 8 characters."
      maxWidth="max-w-md"
    >
      {success ? (
        <div className="py-8 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="text-sm font-semibold text-zinc-900">Password Updated</h4>
          <p className="text-xs text-zinc-500">Your password has been changed successfully.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-lg text-xs text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <TextInput
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            icon={Key}
          />

          <TextInput
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            hint="Must be at least 8 characters"
            icon={Key}
          />

          <TextInput
            label="Type the new password again"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            icon={Key}
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
