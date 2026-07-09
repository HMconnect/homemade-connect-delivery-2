import React from 'react';

// ============================================
// UX POLISH — Animations and transitions
// These CSS classes are injected globally
// ============================================

export const UX_POLISH_CSS = `
/* Modal entrance animation */
@keyframes slideInFromBottom {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal */
[role="dialog"] > div {
  animation: slideInFromBottom 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

/* Backdrop */
[role="dialog"] > [aria-hidden="true"] {
  animation: fadeIn 0.2s ease-out;
}

/* Theme transition — smooth dark/light switch */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.15s ease;
}

/* Vendor card hover */
.vendor-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.vendor-card:hover {
  transform: translateY(-2px);
}

/* Welcome popup — no flicker */
.welcome-popup-enter {
  animation: slideInFromBottom 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

/* PayPal button */
.paypal-btn {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.paypal-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 48, 135, 0.3);
}

/* Bottom nav active state */
.nav-tab-active {
  transition: color 0.15s ease;
}

/* Mobile touch targets — minimum 44px */
button, [role="button"], a {
  min-height: 44px;
  min-width: 44px;
}

/* Sample badge */
.sample-badge {
  animation: fadeIn 0.3s ease;
}

/* Spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 0.8s linear infinite;
}
`;

// Inject UX polish styles
export const injectUXPolish = () => {
  if (document.getElementById('hmc-ux-polish')) return;
  const style = document.createElement('style');
  style.id = 'hmc-ux-polish';
  style.textContent = UX_POLISH_CSS;
  document.head.appendChild(style);
};
