import React from 'react';

const ErrorPage: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="error__page" >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Упс...</h1>
      <p style={{ fontSize: '1.5rem' }}>
        Страница не найдена
      </p>
      <p style={{ fontSize: '1.5rem' }}>
        или
      </p>
      <p style={{ fontSize: '1.5rem' }}>
        что-то пошло не так... Пожалуйста, обновите страницу.
      </p>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        Пожалуйста, обновите страницу
      </p>
      <button
        onClick={handleRefresh}
        className="refresh__btn"
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
      >
        Обновить страницу
      </button>
    </div>
  );
};

export default ErrorPage;
