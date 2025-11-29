import toast from 'react-hot-toast';

export const showErrorToast = (message) => {
  toast.error(message || 'Something went wrong. Please try again.', {
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

export const showSuccessToast = (message) => {
  toast.success(message, {
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
