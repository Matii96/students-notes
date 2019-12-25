import { Socket } from 'socket.io';
import User from '@/model/entities/user';

export default interface SocketUser extends Socket {
  user: User;
}
