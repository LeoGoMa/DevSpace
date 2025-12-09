import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      github_url: [''],
      nivel_experiencia: ['', Validators.required],
      biografia: ['']
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.api.registerUser(this.registroForm.value).subscribe({
        next: (res) => {
          console.log('Usuario registrado', res);
          // Save user to localStorage
          if (res && res.id) {
            const userToSave = { ...this.registroForm.value, ...res };
            localStorage.setItem('currentUser', JSON.stringify(userToSave));
          }
          alert('¡Usuario registrado con éxito! Ahora puedes crear posts.');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al registrar', err);
          alert('Error al registrar usuario: ' + (err.error?.error || err.message));
        }
      });
    } else {
      alert('Por favor completa todos los campos requeridos correctamente.');
    }
  }
}
