import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: 'alerts',
})
export class AlertsGateway {
  @WebSocketServer()
  server: Server;

  emitNewAlert(alert: any) {
    this.server.emit('alertCreated', { type: 'alert_created', alert });
  }

  emitAlertUpdated(alert: any) {
    this.server.emit('alertUpdated', { type: 'alert_updated', alert });
  }

  emitNewLike(like: any) {
    this.server.emit('likeAdded', { type: 'like_added', like });
  }

  emitNewComment(comment: any) {
    this.server.emit('commentAdded', { type: 'comment_added', comment });
  }
}