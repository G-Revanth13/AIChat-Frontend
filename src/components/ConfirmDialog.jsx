import { useEffect, useId, useMemo, useRef, useState } from 'react';

import './ConfirmDialog.css';

/**
 * Reusable confirmation dialog.
 *
 * Props:
 * - open: boolean
 * - title: string
 * - message: string | ReactNode
 * - confirmText?: string (default: "Logout")
 * - cancelText?: string (default: "Cancel")
 * - confirmTone?: 'danger' | 'primary' (default: 'danger')
 * - onConfirm: () => void | Promise<void>
 * - onCancel: () => void
 * - disableConfirm?: boolean
 */
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Logout',
  cancelText = 'Cancel',
  confirmTone = 'danger',
  onConfirm,
  onCancel,
  disableConfirm = false
}) => {
  const dialogId = useId();
  const titleId = useMemo(() => `${dialogId}-title`, [dialogId]);
  const messageId = useMemo(() => `${dialogId}-message`, [dialogId]);

  const [submitting, setSubmitting] = useState(false);
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    // Prevent background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus confirm button for accessibility
    const t = window.setTimeout(() => {
      confirmBtnRef.current?.focus?.();
    }, 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  const handleConfirm = async () => {
    if (disableConfirm || submitting) return;

    try {
      setSubmitting(true);
      await onConfirm?.();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="confirm-dialog-overlay"
      role="presentation"
      onMouseDown={(e) => {
        // Close when clicking outside modal
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
      >
        <div className="confirm-dialog-header">
          <h2 id={titleId} className="confirm-dialog-title">
            {title}
          </h2>
        </div>

        <div id={messageId} className="confirm-dialog-message">
          {message}
        </div>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-dialog-btn confirm-dialog-btn-cancel"
            onClick={onCancel}
            disabled={submitting}
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            className={
              confirmTone === 'primary'
                ? 'confirm-dialog-btn confirm-dialog-btn-primary'
                : 'confirm-dialog-btn confirm-dialog-btn-danger'
            }
            onClick={handleConfirm}
            disabled={disableConfirm || submitting}
          >
            {submitting ? 'Working...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

