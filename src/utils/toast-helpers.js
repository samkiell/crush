import toast from 'react-hot-toast';

/**
 * Nigerian-student friendly error message mappings
 */
const errorMessageMap = {
  // Registration errors
  'User already exists': 'This account already exist. You don try login?',
  'Please provide all required fields': 'Abeg, fill all the boxes make we fit register you',
  'Password too short': 'Password too short, do better. At least 6 characters abeg',
  'Invalid user data': 'Something no correct with the details you enter',
  
  // Login errors
  'Invalid email or password': 'Email or password no correct. Check am well',
  'Please provide email and password': 'Abeg, enter your email and password',
  'User not found': 'We no fit find this account. You don register?',
  
  // General errors
  'Server error': 'Network dey do strong head, try again',
  'Network Error': 'Network dey do strong head, try again',
  'Failed to fetch': 'Network dey do strong head, try again',
  
  // Validation errors
  'Email not valid': 'Email no correct, check am well',
  'Invalid email format': 'Email no correct, check am well',
  'Passwords do not match': 'The two passwords no be the same. Check am again',
};

/**
 * Parse API error and return Nigerian-friendly message
 */
export const parseApiError = (error) => {
  // Check if error has a message property
  if (error?.message) {
    // Check if we have a mapping for this error
    const mappedMessage = errorMessageMap[error.message];
    if (mappedMessage) return mappedMessage;
    
    // Check if message contains any key from our map
    for (const [key, value] of Object.entries(errorMessageMap)) {
      if (error.message.includes(key)) return value;
    }
    
    return error.message;
  }
  
  // Check if error is a string
  if (typeof error === 'string') {
    const mappedMessage = errorMessageMap[error];
    if (mappedMessage) return mappedMessage;
    
    for (const [key, value] of Object.entries(errorMessageMap)) {
      if (error.includes(key)) return value;
    }
    
    return error;
  }
  
  // Default fallback
  return 'Network dey do strong head, try again';
};

/**
 * Show success toast notification
 */
export const showSuccessToast = (message) => {
  return toast.success(message, {
    duration: 3000,
    style: {
      borderRadius: '12px',
      padding: '12px 16px',
    },
  });
};

/**
 * Show error toast notification with Nigerian-friendly message
 */
export const showErrorToast = (error) => {
  const friendlyMessage = parseApiError(error);
  return toast.error(friendlyMessage, {
    duration: 5000,
    style: {
      borderRadius: '12px',
      padding: '12px 16px',
    },
  });
};

/**
 * Show welcome toast after successful login
 */
export const showWelcomeToast = (username) => {
  return toast.success(`Welcome, ${username} 🎉`, {
    duration: 4000,
    style: {
      borderRadius: '12px',
      padding: '12px 16px',
      fontSize: '15px',
    },
  });
};

/**
 * Show registration success toast
 */
export const showRegistrationSuccessToast = () => {
  return toast.success('Registration successful. Login to continue.', {
    duration: 4000,
    style: {
      borderRadius: '12px',
      padding: '12px 16px',
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
    style: {
      borderRadius: '12px',
      padding: '12px 16px',
    },
  });
};

/**
 * Show loading toast notification
 */
export const showLoadingToast = (message) => {
  return toast.loading(message, {
    style: {
      borderRadius: '12px',
      padding: '12px 16px',
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
