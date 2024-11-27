import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from 'src/app/shared/models/login.model';
import { Professor } from 'src/app/shared/models/professor.model';
import { Student } from 'src/app/shared/models/student.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  login(login: Login): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, login);
  }

  registerProfessor(professor: Professor): Observable<any> {
    return this.http.post(`${this.baseUrl}/professor`, professor);
  }

  registerStudent(student: Student): Observable<any> {
    return this.http.post(`${this.baseUrl}/student`, student);
  }
}
