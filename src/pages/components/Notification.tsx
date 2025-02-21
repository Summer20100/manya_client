import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string | { msg: string }[] | { detail: string };
  onClose: () => void;
  type: 'error' | 'message';
}

const Notification: React.FC<NotificationProps> = ({ message, onClose, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    height: 'auto',
    top: '4.5rem',
    right: '0',
    zIndex: 9999,
    padding: '8px',
    boxSizing: 'border-box',
    margin: '8px 0',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1000px',
    backgroundColor: type === 'error' ? '#f8d7da' : '#d1ecf1',
    color: type === 'error' ? '#721c24' : '#0c5460',
    border: type === 'error' ? '1px solid #fc031d' : '1px solid #00ff00',
    opacity: isVisible ? 0.9 : 0,
    transition: 'opacity 1s ease-out',
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '8px',
    marginBottom: '0',
  };

  const messageTextStyle: React.CSSProperties = {
    flexGrow: 1,
    marginBottom: '0',
    wordWrap: 'break-word',
  };

  // Ensure message is properly formatted before rendering
  let formattedMessage: string | { msg: string }[];

  if (typeof message === 'string') {
    formattedMessage = message;
  } else if (Array.isArray(message)) {
    formattedMessage = message;
  } else if (message && typeof message === 'object' && 'detail' in message) {
    formattedMessage = message.detail; // Extract the detail field
  } else {
    formattedMessage = 'Unknown error occurred'; // Fallback message
  }

  return (
    <div style={containerStyle} onClick={onClose}>
      {Array.isArray(formattedMessage) ? (
        formattedMessage.map((el, index) => (
          <div key={index} style={itemStyle}>
            <span style={iconStyle}>{type === 'error' ? '❌' : 'ℹ️'}</span>
            <span style={messageTextStyle}>{el.msg}</span>
          </div>
        ))
      ) : (
        <div style={itemStyle}>
          <span style={iconStyle}>{type === 'error' ? '❌' : 'ℹ️'}</span>
          <span style={messageTextStyle}>{formattedMessage}</span>
        </div>
      )}
    </div>
  );
};

export const ErrorNotification: React.FC<Omit<NotificationProps, 'type'>> = (props) => (
  <Notification {...props} type="error" />
);

export const MessageNotification: React.FC<Omit<NotificationProps, 'type'>> = (props) => (
  <Notification {...props} type="message" />
);
