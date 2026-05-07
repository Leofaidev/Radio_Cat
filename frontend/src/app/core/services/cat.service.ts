import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
  is_hairy: boolean;
  color: string;
  created_at: string;
  updated_at: string;
  owner: number;
  owner_username: string;
}

export interface CatCreateData {
  name: string;
  age: number;
  breed: string;
  is_hairy: boolean;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${this.API_URL}/api/cats/`);
  }

  getCat(id: number): Observable<Cat> {
    return this.http.get<Cat>(`${this.API_URL}/api/cats/${id}/`);
  }

  createCat(data: CatCreateData): Observable<Cat> {
    return this.http.post<Cat>(`${this.API_URL}/api/cats/`, data);
  }

  updateCat(id: number, data: Partial<CatCreateData>): Observable<Cat> {
    return this.http.put<Cat>(`${this.API_URL}/api/cats/${id}/`, data);
  }

  patchCat(id: number, data: Partial<CatCreateData>): Observable<Cat> {
    return this.http.patch<Cat>(`${this.API_URL}/api/cats/${id}/`, data);
  }

  deleteCat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/cats/${id}/`);
  }
}
