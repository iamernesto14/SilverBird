import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../enviroments/environment';
import { ApiWrapper, RegisterRequest, User } from '../../../model/auth';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) { }

  register(payload: RegisterRequest): Observable<User> {
    return this.http.post<ApiWrapper<User>>(`${this.apiUrl}/auth/register`, payload).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          // wrap backend validation errors into a thrown error
          const errMsg = response.error?.length ? response.error.join('; ') : response.message;
          throw new Error(errMsg);
        }
      }),
      catchError((err: HttpErrorResponse | Error) => {
        // Normalize error into consistent shape for component consumption
        let message: string;
        if (err instanceof HttpErrorResponse) {
          if (err.error && typeof err.error === 'object') {
            // expect backend error format
            const body = err.error as Partial<ApiWrapper<unknown>>;
            if (body.error && Array.isArray(body.error)) {
              message = body.error.join('; ');
            } else if (body.message) {
              message = body.message;
            } else {
              message = err.message;
            }
          } else {
            message = err.message;
          }
        } else {
          message = err.message;
        }
        return throwError(() => new Error(message));
      })
    );
  }
  
}