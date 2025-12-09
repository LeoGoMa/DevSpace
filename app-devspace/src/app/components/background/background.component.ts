import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-background',
    standalone: true,
    imports: [CommonModule],
    template: `<canvas #canvas></canvas>`,
    styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
      background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
      overflow: hidden;
    }
    canvas {
      display: block;
    }
  `]
})
export class BackgroundComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
    private ctx!: CanvasRenderingContext2D;
    private stars: Star[] = [];
    private animationId: number = 0;
    private mouseX: number = 0;
    private mouseY: number = 0;

    ngAfterViewInit() {
        this.initCanvas();
        this.createStars();
        this.animate();
    }

    ngOnDestroy() {
        cancelAnimationFrame(this.animationId);
    }

    @HostListener('window:resize')
    onResize() {
        this.initCanvas();
        this.createStars();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    private initCanvas() {
        const canvas = this.canvasRef.nativeElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = canvas.getContext('2d')!;
    }

    private createStars() {
        this.stars = [];
        const starCount = Math.floor((window.innerWidth * window.innerHeight) / 3000); // Density
        for (let i = 0; i < starCount; i++) {
            this.stars.push(new Star(window.innerWidth, window.innerHeight));
        }
    }

    private animate() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Draw connecting lines
        this.stars.forEach(star => {
            star.update(this.mouseX, this.mouseY);
            star.draw(this.ctx);
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

class Star {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    originalX: number;
    originalY: number;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.originalX = this.x;
        this.originalY = this.y;
        this.size = Math.random() * 2;

        // Random movement
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;

        // Vibrant colors
        const colors = ['#38bdf8', '#818cf8', '#ffffff', '#c084fc'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update(mouseX: number, mouseY: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;

        // Mouse interaction (Parallax/Repel)
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * 2; // Repel strength
            const directionY = forceDirectionY * force * 2;

            this.x -= directionX;
            this.y -= directionY;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
    }
}
