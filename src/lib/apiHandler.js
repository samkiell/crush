import { NextResponse } from 'next/server';

export const apiHandler = (handler) => async (req, ...args) => {
  try {
    return await handler(req, ...args);
  } catch (error) {
    console.error('Global Error Handler:', error);

    let statusCode = 500;
    let message = 'Something went wrong. Please try again.';

    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
      statusCode = 400;
      // Extract the first validation error message
      const errors = Object.values(error.errors).map((err) => err.message);
      message = errors[0] || 'Validation Error';
    }

    // Mongoose Cast Error (Invalid ID)
    if (error.name === 'CastError') {
      statusCode = 400;
      message = 'Resource not found or invalid ID.';
    }

    // Mongoose Duplicate Key Error
    if (error.code === 11000) {
      statusCode = 400;
      const field = Object.keys(error.keyValue)[0];
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    }

    // Custom Error (if we throw errors with statusCode)
    if (error.statusCode) {
      statusCode = error.statusCode;
      message = error.message;
    } else if (error instanceof Error && error.message && statusCode !== 500) {
       // If it's a standard error but we haven't caught it as a specific type, 
       // we usually default to 500 and generic message to hide stack traces.
       // However, if we manually threw new Error("Specific message"), we might want to show it?
       // The requirement says: "Never return ... stack traces ... Map known error types ... into simple user-friendly messages."
       // It also says: "Unified Express error handler that always returns ... { success: false, message: 'Something went wrong...' }"
       // BUT it also says: "Map known error types ... into simple user-friendly messages."
       // So for unknown errors, we stick to the generic message.
    }

    return NextResponse.json(
      { success: false, message },
      { status: statusCode }
    );
  }
};
