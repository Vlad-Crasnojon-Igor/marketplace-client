import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Announcement } from '../models/announcement.model';

@Injectable({
    providedIn: 'root',
})
export class AnnouncementService {
    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:5040/api/Announcement';

    getAnnouncements(): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(this.apiUrl);
    }

    createAnnouncement(announcement: Announcement): Observable<Announcement> {
        return this.http.post<Announcement>(this.apiUrl, announcement);
    }

    getAnnouncementsByCategoryId(categoryId: number): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(`${this.apiUrl}/category/${categoryId}`);
    }

    getAnnouncementsByUserId(userId: number): Observable<Announcement[]> {
        return this.getAnnouncements().pipe(
            map(announcements => announcements.filter(a => a.sellerId === userId))
        );
    }

    deleteAnnouncement(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
