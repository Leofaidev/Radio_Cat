import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService, WsMessage } from '../../core/services/websocket.service';
import { MessageService, Message } from '../../core/services/message.service';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: WsMessage[] = [];
  newMessage = '';
  isLoading = true;
  isConnected = false;
  currentUser: User | null = null;
  roomName = 'general';

  private wsSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;
  private shouldScrollToBottom = false;

  constructor(
    private wsService: WebsocketService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadHistory();
    this.connectWebSocket();
  }

  loadHistory(): void {
    this.messageService.getMessages(this.roomName).subscribe({
      next: (msgs: Message[]) => {
        this.messages = msgs.map(m => ({
          sender: m.sender_username,
          text: m.text,
          timestamp: m.timestamp
        }));
        this.isLoading = false;
        this.shouldScrollToBottom = true;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  connectWebSocket(): void {
    const socket$ = this.wsService.connect(this.roomName);
    this.isConnected = true;

    this.wsSubscription = socket$.subscribe({
      next: (msg: WsMessage) => {
        this.messages.push(msg);
        this.shouldScrollToBottom = true;
      },
      error: () => {
        this.isConnected = false;
      },
      complete: () => {
        this.isConnected = false;
      }
    });
  }

  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text || !this.isConnected) return;

    const msg: WsMessage = {
      sender: this.currentUser?.username || 'anonymous',
      text,
      timestamp: new Date().toISOString()
    };

    this.wsService.sendMessage(msg);
    this.newMessage = '';
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  isOwnMessage(msg: WsMessage): boolean {
    return msg.sender === this.currentUser?.username;
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (e) {}
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
    this.wsService.disconnect();
  }
}
