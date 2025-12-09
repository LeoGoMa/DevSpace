import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-lenguajes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lenguajes-list.html',
  styleUrl: './lenguajes-list.css'
})
export class LenguajesListComponent implements OnInit {
  lenguajes: any[] = [];

  constructor(private api: ApiService) { }

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
}
