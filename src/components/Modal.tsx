import React, { useEffect, useRef, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
  size = 'md',
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const firstFocusRef = useRef<HTMLDivElement>(null);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  // Focus trap
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    const modal = firstFocusRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
    if (e.key === 'Escape') onClose();
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', trapFocus);
    closeRef.current?.focus();
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = '';
    };
  }, [isOpen, trapFocus]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
    >
      {/* Backdrop - dark mode aware */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={firstFocusRef}
        className={`
          relative bg-white dark:bg-gray-900 rounded-3xl w-full ${sizes[size]}
          overflow-hidden shadow-2xl
          animate-in slide-in-from-bottom-4 duration-200
        `}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {children}
      </div>
    </div>
  );
};
