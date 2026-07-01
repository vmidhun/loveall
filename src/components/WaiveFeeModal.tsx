import React, { useState, useEffect } from 'react';

/**
 * WaiveFeeModal Component
 * Modal dialog for waiving a fee with a reason
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

interface WaiveFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  studentName?: string;
  feeAmount?: number;
}

export const WaiveFeeModal: React.FC<WaiveFeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  studentName,
  feeAmount,
}) => {
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setReason('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate reason is not empty
    if (!reason.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(reason.trim());
      onClose();
    } catch (error) {
      console.error('Error waiving fee:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Waive Fee</h2>
            {studentName && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Student: {studentName}
              </p>
            )}
            {feeAmount !== undefined && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Amount: {formatCurrency(feeAmount)}
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              {/* Reason Text Area */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Waiving Fee <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter the reason for waiving this fee (e.g., financial hardship, exceptional performance, special circumstances)"
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This reason will be stored in the fee record notes field
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reason.trim()}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Waiving...
                  </>
                ) : (
                  'Waive Fee'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default WaiveFeeModal;
