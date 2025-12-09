import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        if (localStorage.getItem('currentUser')) {
            this.router.navigate(['/home']);
        }
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.api.login(this.loginForm.value).subscribe({
                next: (res) => {
                    console.log('Login exitoso', res);
                    if (res.user) {
                        localStorage.setItem('currentUser', JSON.stringify(res.user));
                        this.router.navigate(['/home']);
                    }
                },
                error: (err) => {
                    console.error('Error en login', err);
                    this.errorMessage = err.error?.message || 'Error al iniciar sesión';
                }
            });
        }
    }
}
