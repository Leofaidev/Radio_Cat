import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Message {
  id: number;
  sender: number;
  sender_username: string;
  text: string;
  timestamp: string;
  room_name: string;
}

export interface MessageCreateData {
  text: string;
  room_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMessages(room: string = 'general'): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.API_URL}/api/messages/?room=${room}`);
  }

  createMessage(data: MessageCreateData): Observable<Message> {
    return this.http.post<Message>(`${this.API_URL}/api/messages/`, data);
  }
}
