import toast from 'react-hot-toast';

/**
 * Show success toast notification
 */
export const showSuccessToast = (message) => {
  return toast.success(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#333',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px',
    },
  });
};

/**
 * Show error toast notification
 */
export const showErrorToast = (message) => {
  // Ensure message is a string
  const msg = typeof message === 'string' ? message : 'Something went wrong. Please try again.';
  
  return toast.error(msg, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#333',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px',
    },
  });
};

/**
 * Show info toast notification
 */
export const showInfoToast = (message) => {
  return toast(message, {
    duration: 3000,
    icon: '💡',
    position: 'top-center',
    style: {
      background: '#333',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px',
    },
  });
};

/**
 * Show loading toast notification
 */
export const showLoadingToast = (message) => {
  return toast.loading(message, {
    position: 'top-center',
    style: {
      background: '#333',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px',
    },
  });
};

/**
 * Dismiss a specific toast
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};
