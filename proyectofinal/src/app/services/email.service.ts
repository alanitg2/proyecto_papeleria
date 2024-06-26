import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, text: string, attachments: any[] = []): Observable<any> {
    const emailData = { to, subject, text, attachments };
    return this.http.post(`${this.apiUrl}/send-email`, emailData);
  }

  sendChangeReceipt(to: string, subject: string, text: string, action: string, categoryName: string): Observable<any> {
    const emailData = { to, subject, text, action, categoryName };
    return this.http.post(`${this.apiUrl}/send-change-receipt`, emailData);
  }
}
