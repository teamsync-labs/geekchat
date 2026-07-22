import React, { useState, useEffect } from 'react';

function ApiExample() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Используем /api вместо полного URL
      const response = await fetch('/api/posts?_limit=5');
      
      console.log('Статус ответа:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Данные получены:', data);
      setPosts(data);
    } catch (err) {
      console.error('❌ Ошибка:', err);
      setError('Ошибка: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#0A1628', color: 'white', minHeight: '100vh' }}>
      <h1>📡 Работа с API</h1>
      
      <button 
        onClick={fetchPosts} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: '#2A4A7A',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        {loading ? '⏳ Загрузка...' : '🔄 Обновить'}
      </button>
      
      {error && (
        <div style={{ 
          background: 'rgba(255,0,0,0.1)', 
          border: '1px solid rgba(255,0,0,0.3)',
          color: '#f87171',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          ❌ {error}
        </div>
      )}
      
      <p style={{ color: 'rgba(255,255,255,0.5)' }}>Постов: {posts.length}</p>
      
      {posts.length === 0 && !loading && (
        <div style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '40px 0' }}>
          Нет постов. Нажмите "Обновить".
        </div>
      )}
      
      {posts.map((post) => (
        <div key={post.id} style={{ 
          border: '1px solid #2A4A7A', 
          padding: '16px', 
          margin: '10px 0', 
          borderRadius: '12px',
          background: '#1A2D4A'
        }}>
          <h3 style={{ color: 'white', margin: '0 0 8px 0' }}>{post.title}</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0' }}>{post.body}</p>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>ID: {post.id}</span>
        </div>
      ))}
    </div>
  );
}

export default ApiExample;
