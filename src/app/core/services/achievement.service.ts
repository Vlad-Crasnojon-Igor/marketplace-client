import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from '../models/achievement.model';

@Injectable({
    providedIn: 'root'
})
export class AchievementService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:5040';
    private readonly apiUrl = `${this.baseUrl}/api/Achievement`;

    getUserAchievements(userId: number): Observable<Achievement[]> {
        return this.http.get<Achievement[]>(`${this.apiUrl}/user/${userId}`);
    }

    assignAchievement(userId: number, achievementId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/assign`, { userId, achievementId });
    }
}
