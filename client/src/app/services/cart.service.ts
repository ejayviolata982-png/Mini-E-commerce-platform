import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<any>({ items: [], total: 0 });
  cart$ = this.cartSubject.asObservable();
  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(tap((cart: any) => this.cartSubject.next(cart)));
  }
  addToCart(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(tap((cart: any) => this.cartSubject.next(cart)));
  }
  updateItem(productId: string, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${productId}`, { quantity }).pipe(tap((cart: any) => this.cartSubject.next(cart)));
  }
  clearCart(): Observable<any> {
    return this.http.delete<any>(this.apiUrl).pipe(tap(() => this.cartSubject.next({ items: [], total: 0 })));
  }
  getItemCount(): number {
    return this.cartSubject.value?.items?.length || 0;
  }
}