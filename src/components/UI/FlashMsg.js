// FlashMessage.js
import React, { useEffect } from 'react';

const FlashMessage = ({ storeName, onClose }) => {
  useEffect(() => {
    console.log('Store ID:', storeName);

    // Perform any actions related to the store ID

    // Close the flash message after 5 seconds
    const timer = setTimeout(() => {
      onClose(storeName);  // Call onClose with parameters
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [storeName, onClose]);

  return (
    <div>
      Flash message for store ID: {storeName}
    </div>
  );
};

export default FlashMessage;
