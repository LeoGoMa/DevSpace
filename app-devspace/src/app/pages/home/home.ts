import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { PostCardComponent } from '../../components/post-card/post-card';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostCardComponent, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  posts: any[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // 1. Set Initial Loading State
    this.posts = [{
      titulo: 'Iniciando...',
      descripcion: 'Esperando respuesta del servidor...',
      usuario_nombre: 'System',
      fecha_publicacion: new Date(),
      lenguaje_nombre: 'System',
      lenguaje_icono: 'fa-solid fa-spinner fa-spin',
      tags: '#loading',
      foto_perfil: 'assets/default-avatar.png' // Placeholder
    }];

    // 2. Make API Call (No Timeout)
    this.api.getPosts().subscribe({
      next: (res) => {
        console.log('API Response:', res);
        if (Array.isArray(res) && res.length > 0) {
          this.posts = res.map(post => ({
            ...post,
            // Assign random avatar if missing. Using DiceBear for nice avatars.
            foto_perfil: post.foto_perfil || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.usuario_nombre || 'User'}`
          }));
        } else {
          this.posts = []; // Clear loading state if empty
        }
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => {
        console.error('API Error:', err);
        this.posts = [{
          titulo: 'Error de Conexión',
          descripcion: `Error: ${err.message}. Por favor verifica que el servidor esté corriendo.`,
          tags: '#error',
          lenguaje_icono: 'fa-solid fa-triangle-exclamation',
          foto_perfil: 'assets/error-avatar.png'
        }];
        this.cdr.detectChanges(); // Force UI update
      }
    });
  }
}
