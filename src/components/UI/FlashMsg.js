import { ClassNames } from '@emotion/react';
import React, { useState, useEffect } from 'react';

const FlashMessage = ({onClose, onCancel }) => {
    console.log('onCancel', onCancel);
    const [isVisible, setIsVisible] = useState(true);
    const [loadingPercentage, setLoadingPercentage] = useState(100);

    useEffect(() => {
        // Automatically close after 5 seconds
        const timeoutId = setTimeout(() => {
            //sets showFlas to false
            onClose();
        }, 4000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [onClose]);

    return (
        <div className="container mx-auto text-center relative">
          <div
            className="absolute left-1/2 transform  top-2 -translate-x-1/2 flex justify-between text-green-200 shadow-inner rounded bg-green-600 z-20 "
          >
            <p className="self-center mr-2">
              <strong>Your item's position has been changed.</strong>
            </p>
            <button type="button" className="mr-2" onClick={onCancel}>
              Cancel?
            </button>
      
            <strong
              className="text-xl align-center cursor-pointer alert-del mr-2"
              onClick={onClose}
            >
              &times;
            </strong>
          </div>
        </div>
      );
      
};

export default FlashMessage;
