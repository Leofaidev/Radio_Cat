import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject, timer } from 'rxjs';
import { retryWhen, delay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface WsMessage {
  sender: string;
  text: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<WsMessage> | null = null;
  private readonly WS_URL = environment.wsUrl;

  constructor(private authService: AuthService) {}

  connect(roomName: string): WebSocketSubject<WsMessage> {
    const token = this.authService.getAccessToken();
    const url = `${this.WS_URL}/ws/chat/${roomName}/?token=${token}`;

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<WsMessage>({
        url,
        deserializer: (e) => JSON.parse(e.data),
        serializer: (msg) => JSON.stringify(msg),
      });
    }
    return this.socket$;
  }

  sendMessage(message: WsMessage): void {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
  }
}
