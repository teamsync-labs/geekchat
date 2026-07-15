import { useEffect, useRef, useState } from 'react';
import { Peer } from 'peerjs';

export const usePeer = () => {
  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState('');
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const peerRef = useRef(null);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      debug: 2,
    });

    newPeer.on('open', (id) => {
      console.log('✅ Мой Peer ID:', id);
      setMyId(id);
    });

    newPeer.on('call', (call) => {
      console.log('📞 Входящий звонок от:', call.peer);
      setIsConnecting(true);
      
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            setIsCallActive(true);
            setIsConnecting(false);
            console.log('✅ Звонок установлен');
          });
        })
        .catch(console.error);
    });

    newPeer.on('error', (err) => {
      console.error('❌ PeerJS ошибка:', err);
      setIsConnecting(false);
    });

    newPeer.on('disconnected', () => {
      console.log('🔌 Peer отключён');
      setIsCallActive(false);
    });

    peerRef.current = newPeer;
    setPeer(newPeer);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((err) => {
        console.warn('⚠️ Не удалось получить доступ к камере/микрофону:', err);
      });

    return () => {
      newPeer.destroy();
    };
  }, []);

  const callPeer = (remotePeerId) => {
    if (!peerRef.current) {
      console.warn('⚠️ Peer не инициализирован');
      return;
    }

    setIsConnecting(true);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        const call = peerRef.current.call(remotePeerId, stream);
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
          setIsCallActive(true);
          setIsConnecting(false);
          console.log('✅ Звонок установлен с:', remotePeerId);
        });
        call.on('error', (err) => {
          console.error('❌ Ошибка звонка:', err);
          setIsConnecting(false);
        });
      })
      .catch((err) => {
        console.error('❌ Ошибка доступа к медиа:', err);
        setIsConnecting(false);
      });
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.disconnect();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
      }
      setRemoteStream(null);
      setIsCallActive(false);
      setIsConnecting(false);
      console.log('📴 Звонок завершён');
    }
  };

  return {
    myId,
    remoteStream,
    localStream,
    isCallActive,
    isConnecting,
    callPeer,
    endCall,
  };
};
