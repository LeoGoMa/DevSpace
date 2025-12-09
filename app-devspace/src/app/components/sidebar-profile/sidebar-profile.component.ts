import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
    selector: 'app-sidebar-profile',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './sidebar-profile.component.html',
    styleUrl: './sidebar-profile.component.css'
})
export class SidebarProfileComponent implements OnInit {
    currentUser: any = null;
    avatarUrl: string = '';
    postCount: number = 0;

    constructor(private api: ApiService, private router: Router) { }

    ngOnInit() {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            const localUser = JSON.parse(userStr);
            if (localUser && localUser.id) {
                // Fetch full user details from API
                this.api.getUser(localUser.id).subscribe({
                    next: (user) => {
                        this.currentUser = { ...localUser, ...user };
                        // Update localStorage with fresh data
                        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                        this.loadUserData();
                    },
                    error: (err) => {
                        console.error('Error fetching user details', err);
                        // Fallback to local data if API fails
                        this.currentUser = localUser;
                        this.loadUserData();
                    }
                });
            }
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.router.navigate(['/']);
    }

    loadUserData() {
        this.avatarUrl = this.getAvatarUrl(this.currentUser);

        this.api.getPosts().subscribe({
            next: (posts) => {
                this.postCount = posts.filter(p => p.usuario_id === this.currentUser.id).length;
            },
            error: (err) => console.error('Error loading posts count', err)
        });
    }

    getAvatarUrl(user: any): string {
        if (user.github_url) {
            const match = user.github_url.match(/github\.com\/([^\/]+)/);
            if (match && match[1]) {
                return `https://github.com/${match[1]}.png`;
            }
        }
        // Fallback to DiceBear Bottts (Robots) for a "DevSpace" theme
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.nombre)}`;
    }
}
