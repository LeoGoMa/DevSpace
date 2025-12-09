import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-post.html',
  styleUrl: './crear-post.css'
})
export class CrearPostComponent implements OnInit {
  postForm: FormGroup;
  lenguajes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      titulo: ['', Validators.required],
      codigo: ['', Validators.required],
      descripcion: [''],
      tags: [''],
      visibilidad: ['publico'],
      lenguaje_id: ['', Validators.required],
      usuario_id: [this.getCurrentUserId()]
    });
  }

  getCurrentUserId(): number {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || 1;
    }
    return 1; // Fallback to default user
  }

  ngOnInit() {
    this.api.getLenguajes().subscribe({
      next: (res) => {
        this.lenguajes = res;
      },
      error: (err) => {
        console.error('Error al cargar lenguajes', err);
      }
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.api.createPost(this.postForm.value).subscribe({
        next: (res) => {
          console.log('Post creado', res);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error al crear post', err);
        }
      });
    }
  }
}
