import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  constructor(private http: HttpClient) {}

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my`);
  }
  getAllOrders(filters?: any): Observable<any[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<any[]>(this.apiUrl, { params });
  }
  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  requestCancel(id: string, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancel-request`, { reason });
  }
  handleCancelRequest(id: string, action: 'approve' | 'reject'): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancel-action`, { action });
  }
  getDashboard(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/orders/dashboard`);
  }
}