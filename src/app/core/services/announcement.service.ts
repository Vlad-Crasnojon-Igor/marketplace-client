import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Announcement } from '../models/announcement.model';

@Injectable({
    providedIn: 'root',
})
export class AnnouncementService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:5040';
    private readonly apiUrl = `${this.baseUrl}/api/Announcement`;

    getAnnouncements(): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(this.apiUrl).pipe(
            map(announcements => announcements.map(a => this.normalizeAnnouncement(a)))
        );
    }

    createAnnouncement(announcement: Announcement): Observable<Announcement> {
        return this.http.post<Announcement>(this.apiUrl, announcement).pipe(
            map(a => this.normalizeAnnouncement(a))
        );
    }

    getAnnouncementsByCategoryId(categoryId: number): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(`${this.apiUrl}/category/${categoryId}`).pipe(
            map(announcements => announcements.map(a => this.normalizeAnnouncement(a)))
        );
    }

    getAnnouncementsByUserId(userId: number): Observable<Announcement[]> {
        return this.getAnnouncements().pipe(
            map(announcements => announcements.filter(a => a.sellerId === userId))
        );
    }

    searchAnnouncements(query: string): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(`${this.apiUrl}/${query}`).pipe(
            map(announcements => announcements.map(a => this.normalizeAnnouncement(a)))
        );
    }

    deleteAnnouncement(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    uploadImage(file: File): Observable<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
    }

    private normalizeAnnouncement(a: Announcement): Announcement {
        if (a.imageUrl && a.imageUrl.startsWith('/')) {
            a.imageUrl = `${this.baseUrl}${a.imageUrl}`;
        }
        return a;
    }
}
