import io, { Socket } from 'socket.io-client';
import { useCallback } from 'react';

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const backUrl = 'http://localhost:3095';
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, []);

  if (!workspace) {
    return [undefined, disconnect];
  }

  if(!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  
  // socket.emit('hello', 'world');
  // socket.on('message', (data) => [
  //   console.log(data)
  // ]);

  return [sockets[workspace], disconnect];
};

export default useSocket;