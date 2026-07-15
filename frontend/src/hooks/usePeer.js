import { useEffect, useRef, useState } from 'react';
import { Peer } from 'peerjs';

export const usePeer = () => {
  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState('');
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const peerRef = useRef(null);

  // Запрос доступа к камере и микрофону
  const startMedia = async () => {
    try {
      console.log('📷 Запрашиваем доступ к камере и микрофону...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      console.log('✅ Доступ к камере и микрофону получен');
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('❌ Ошибка доступа к камере/микрофону:', err);
      setError(err.message);
      alert('⚠️ Не удалось получить доступ к камере и микрофону. Проверьте разрешения в браузере.');
      return null;
    }
  };

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      debug: 2,
    });

    newPeer.on('open', async (id) => {
      console.log('✅ Мой Peer ID:', id);
      setMyId(id);
      setIsReady(true);

      // Запрашиваем доступ к камере и микрофону
      await startMedia();
    });

    newPeer.on('call', (call) => {
      console.log('📞 Входящий звонок от:', call.peer);
      
      if (localStream) {
        call.answer(localStream);
        call.on('stream', (remoteStream) => {
          console.log('📹 Получен поток от:', call.peer);
          setRemoteStream(remoteStream);
        });
      } else {
        console.warn('⚠️ Нет локального потока для ответа');
        // Пробуем получить доступ к медиа
        startMedia().then((stream) => {
          if (stream) {
            call.answer(stream);
            call.on('stream', (remoteStream) => {
              setRemoteStream(remoteStream);
            });
          }
        });
      }
    });

    newPeer.on('error', (err) => {
      console.error('❌ PeerJS ошибка:', err);
      setError(err.message);
    });

    peerRef.current = newPeer;
    setPeer(newPeer);

    return () => {
      if (newPeer) {
        newPeer.destroy();
        console.log('🔴 Peer уничтожен');
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const callPeer = (remoteId) => {
    if (!peer || !localStream) {
      console.warn('⚠️ Peer или локальный поток не готовы');
      // Пробуем получить доступ к медиа
      startMedia().then((stream) => {
        if (stream && peer) {
          console.log('📞 Звонок на:', remoteId);
          const call = peer.call(remoteId, stream);
          call.on('stream', (remoteStream) => {
            console.log('📹 Получен поток от:', remoteId);
            setRemoteStream(remoteStream);
          });
        }
      });
      return;
    }

    console.log('📞 Звонок на:', remoteId);
    const call = peer.call(remoteId, localStream);
    call.on('stream', (remoteStream) => {
      console.log('📹 Получен поток от:', remoteId);
      setRemoteStream(remoteStream);
    });
  };

  return { peer, myId, remoteStream, localStream, isReady, error, callPeer, startMedia };
};
