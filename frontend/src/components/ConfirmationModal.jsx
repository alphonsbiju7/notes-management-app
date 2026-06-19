import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog box */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden transform transition-all duration-300 scale-100 p-6">
        {/* Close Button */}
        <button
          id="close-confirm-btn"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-200/65 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header alert icon */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="flex-shrink-0 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{title || 'Confirm Action'}</h3>
            <p className="text-xs text-slate-400 font-medium">This action cannot be undone</p>
          </div>
        </div>

        {/* Message body */}
        <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
          {message || 'Are you sure you want to proceed with this action?'}
        </p>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            id="cancel-confirm-btn"
            onClick={onClose}
            className="px-4.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 hover:text-slate-800 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-600/10 hover:shadow-rose-700/20 active:scale-95 transition-all duration-200"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
