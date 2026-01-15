import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
