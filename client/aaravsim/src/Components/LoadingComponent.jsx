import React from 'react'
import { CircleNotch } from '@phosphor-icons/react'
import "../styles/Loading.scss"

export const LoadingOverlay = ({ message = "Loading...", variant = "default" }) => {
    return (
      <div className={`loading-overlay ${variant}`}>
        <div className="loading-content">
          <CircleNotch className="loading-spinner" weight="bold" />
          <p className="loading-message">{message}</p>
        </div>
      </div>
    );
  };
  
  // For inline loading indicators
  export const LoadingInline = ({ size = "medium", message }) => {
    return (
      <div className={`loading-inline size-${size}`}>
        <CircleNotch className="loading-spinner" weight="bold" />
        {message && <span className="loading-message">{message}</span>}
      </div>
    );
  };
  
  // For buttons with loading state
  export const LoadingButton = ({ isLoading, children, className, ...props }) => {
    return (
      <button 
        className={`${className} ${isLoading ? 'loading' : ''}`} 
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="loading-button-content">
            <CircleNotch className="loading-spinner" weight="bold" />
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  };