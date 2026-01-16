import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
    upId: number;
    userId: number;
    user?: any; // Avoiding circular dependency for now
    pfp: string;
    description: string;
}

export interface User {
    id?: number;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    userProfile?: UserProfile;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:5040/api/User';

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    getUserByEmail(email: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${email}`);
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    login(credentials: { email: string; password: string }): Observable<any> {
        // The API might return text "ok" or a JSON object.
        // We set responseType: 'text' to avoid JSON parse errors on "ok".
        // We will parse it manually in the component if it's JSON.
        return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' });
    }
    updateBio(userId: number, description: string): Observable<any> {
        const headers = { 'Content-Type': 'application/json' };
        return this.http.put(`${this.apiUrl.replace('/api/User', '/api/UserProfile')}/update-bio/${userId}`, JSON.stringify(description), { headers });
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
