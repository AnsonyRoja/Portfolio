import { Component, AfterViewInit, ElementRef, HostListener, Input, NgZone, OnDestroy, ViewChild, Renderer2, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BtnNvgComponent } from '../btn-nvg/btn-nvg.component';
import { AudioService } from '../audio.service';
declare var YT: any;

@Component({
  selector: 'app-skills-sphere',
  templateUrl: './skills-sphere.component.html',
  styleUrls: ['./skills-sphere.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, BtnNvgComponent],
})
export class SkillsSphereComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  @Input() skills: { name: string; level: number, url: string }[] = [
    { name: 'React', level: 90, url: 'https://react.dev/' },
    { name: 'JavaScript', level: 95, url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { name: 'Express', level: 70, url: 'https://expressjs.com/' },
    { name: 'Sequelize', level: 70, url: 'https://sequelize.org/' },
    { name: 'Postgres', level: 90, url: 'https://www.postgresql.org/' },
    { name: 'MySQL', level: 70, url: 'https://www.mysql.com/' },
    { name: 'NoSQL', level: 70, url: 'https://www.mongodb.com/nosql-explained' },
    { name: 'Firebase', level: 85, url: 'https://firebase.google.com/' },
    { name: 'Angular', level: 60, url: 'https://angular.io/' },
    { name: 'Flutter', level: 90, url: 'https://flutter.dev/' }
  ];

  @Output() videoState = new EventEmitter<'playing' | 'paused'>();
  player: any;


  private ctx!: CanvasRenderingContext2D;
  private width = 400;
  private height = 400;
  private rafId = 0;
  private particles: Array<any> = [];
  private radius = 160; // sphere radius in px
  private rotationX = 0.0008;
  private rotationY = 0.0012;
  private vx = 0; // velocity from pointer
  private vy = 0;
  private isPointerDown = false;
  private lastX = 0;
  private lastY = 0;
  private friction = 0.95;
  private perspective = 0;
  private fontBase = 14;
  showAllSkills: boolean = false;
  isMobile: boolean = false;
  buttonClicked = false;
  isPlaying = false;

  constructor(private ngZone: NgZone, private renderer: Renderer2, private audioService: AudioService) { }

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }




  checkScreenSize() {
    this.isMobile = window.innerWidth <= 500; // Ajusta si quieres otro breakpoint

    // Si vuelve a escritorio, mostrar todas las skills sin botón
    if (!this.isMobile) {
      this.showAllSkills = true;
    }

    console.log(this.isMobile);
  }

  ngAfterViewInit(): void {
    console.log("audio ref", this.audioPlayerRef);

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.createParticles();
    // run animation outside angular to avoid change detection overhead
    this.ngZone.runOutsideAngular(() => this.animate());

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    // -------------------------
    // 💥 EVITAR CARGAR API DOS VECES
    // -------------------------
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      (window as any).onYouTubeIframeAPIReady = () => {
        this.createPlayer();
      };
    } else {
      this.createPlayer(); // API ya cargada
    }
  }

  createPlayer() {
    console.log("🔥 Creando player");

    this.player = new YT.Player('youtube-player', {
      events: {
        'onReady': () => {
          console.log("▶️ Player listo")
        },
        'onStateChange': this.onPlayerStateChange.bind(this)
      }
    });
  }




  onPlayerStateChange(event: any) {

    if (event.data === YT.PlayerState.PLAYING) {
      console.log("is playing");
      this.audioService.pause(); // solo pausa si la música está activada
      this.audioService.ytisActi();
      this.videoState.emit('playing');  // 🔥 Avisar al padre
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      console.log("is paused");
      this.audioService.play();
      this.audioService.ytisActi();
      this.videoState.emit('paused');   // 🔥 Avisar al padre
    }
  }





  hideCursor() {
    const electric = document.getElementById('electric-cursor');


    if (electric) {
      this.renderer.setStyle(electric, 'opacity', '0');
    }

  }

  showCursor() {
    const electric = document.getElementById('electric-cursor');


    if (electric) {
      this.renderer.setStyle(electric, 'opacity', '1');
    }

  }
  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
    this.createParticles(); // reposition
  }

  private drawLightning(x1: number, y1: number, x2: number, y2: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(0,150,255,0.85)'; // color azul eléctrico
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0,150,255,1)';

    ctx.beginPath();
    ctx.moveTo(x1, y1);

    const steps = 20; // cuantos "segmentos" aleatorios
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const nx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 20;
      const ny = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 20;
      ctx.lineTo(nx, ny);
    }

    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  private isPointInText(x: number, y: number, p: any) {
    const ctx = this.ctx;
    const fontSize = Math.max(10, Math.round(this.fontBase * p.scale * 1.1));
    ctx.font = `bold ${fontSize}px Inter, system-ui, Arial`;
    const width = ctx.measureText(p.text).width;
    const height = fontSize;
    // el rectángulo aproximado del texto
    return (
      x >= p.screenX - width / 2 &&
      x <= p.screenX + width / 2 &&
      y >= p.screenY - height / 2 &&
      y <= p.screenY + height / 2
    );
  }

  onCanvasMouseMove(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let isHover = false;

    for (const p of this.particles) {
      if (this.isPointInText(x, y, p)) {
        isHover = true;
        break;
      }
    }

    // Cambia el cursor según hover
    this.canvasRef.nativeElement.style.cursor = isHover ? 'pointer' : 'default';
  }

  // Al hacer click en una habilidad, lo redirije a su aplicacion oficial del lenguaje o framework

  onCanvasClick(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (const p of this.particles) {
      if (this.isPointInText(x, y, p)) {
        // abrir url
        const skill = this.skills.find(s => s.name === p.text);
        if (skill?.url) {
          window.open(skill.url, '_blank');
        }
        break;
      }
    }
  }

  toggleSkills() {
    this.showAllSkills = !this.showAllSkills;
    // Activa animación
    this.buttonClicked = true;

    // La quitamos después de 250ms
    setTimeout(() => {
      this.buttonClicked = false;
    }, 250);
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    // adapt size to container
    const parent = canvas.parentElement;

    // Ahora ajustamos SOLO el tamaño visual del canvas, según la pantalla
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const base = Math.min(innerWidth, innerHeight);
    const visual = base * 0.5;

    if (parent) {
      const rect = parent.getBoundingClientRect();
      this.width = Math.max(300, Math.floor(rect.width));
      this.height = Math.max(300, Math.floor(rect.height));
    } else {
      this.width = 400;
      this.height = 400;
    }
    canvas.width = this.width * devicePixelRatio;
    canvas.height = this.height * devicePixelRatio;
    canvas.style.width = `${innerWidth < 740 ? visual : this.width}px`;
    canvas.style.height = `${innerWidth < 740 ? visual : this.height}px`;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
    this.radius = Math.min(this.width, this.height) * 0.38;
    this.perspective = this.radius * 2;
    console.log(innerWidth, innerHeight)

  }

  private createParticles() {
    this.particles = [];
    const N = this.skills.length;
    for (let i = 0; i < N; i++) {
      const k = -1 + (2 * (i + 1) - 1) / N; // spiral distribution
      const phi = Math.acos(k);
      const theta = Math.sqrt(N * Math.PI) * phi;
      const x = this.radius * Math.sin(phi) * Math.cos(theta);
      const y = this.radius * Math.sin(phi) * Math.sin(theta);
      const z = this.radius * Math.cos(phi);
      this.particles.push({
        x, y, z,
        text: this.skills[i].name,
        scale: 1,
        opacity: 1
      });
    }
  }

  // pointer events
  onPointerDown(e: PointerEvent) {
    this.isPointerDown = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isPointerDown) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.vx = dx * 0.002;
    this.vy = dy * 0.002;
  }

  onPointerUp(e: PointerEvent) {
    this.isPointerDown = false;
  }

  // touch fallback (for older mobile)
  onTouchStart(e: TouchEvent) {
    e.preventDefault(); // 🔥 necesario
    if (e.touches.length === 1) {
      this.isPointerDown = true;
      this.lastX = e.touches[0].clientX;
      this.lastY = e.touches[0].clientY;
    }
  }

  // touch fallback (for older mobile)
  onTouchMove(e: TouchEvent) {
    e.preventDefault();
    if (!this.isPointerDown || e.touches.length !== 1) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();

    const scaleX = this.canvasRef.nativeElement.width / rect.width;
    const scaleY = this.canvasRef.nativeElement.height / rect.height;
    const threshold = rect.height;
    // Posición del touch relativa al canvas
    const x = (e.touches[0].clientX - rect.left) * scaleX / devicePixelRatio;
    const y = (e.touches[0].clientY - rect.top) * scaleY / devicePixelRatio;

    // Diferencia desde el último touch
    const dx = x - this.lastX;
    const dy = y - this.lastY;

    // Guardamos la última posición
    this.lastX = x;
    this.lastY = y;

    // Aplicamos la velocidad igual que en pointerMove

    console.log("eje horizontal", dx);



    // Sensibilidad Eje horizontal
    this.vx = dx * 0.0002;


    //  Sensibilidad en el Eje vertical
    if (dy < -threshold) {
      this.vy = -dy * 0.0002;

    } else {
      this.vy = dy * 0.0002;

    }
  }



  onTouchEnd(e: TouchEvent) {
    e.preventDefault();
    this.isPointerDown = false;
  }


  private animate = () => {
    this.rafId = requestAnimationFrame(this.animate);
    this.update();
    this.render();
  };

  private update() {
    // rotation velocities are combination of auto rotation + pointer velocity
    const rx = this.rotationX + this.vy;
    const ry = this.rotationY + this.vx;

    const sinX = Math.sin(rx);
    const cosX = Math.cos(rx);
    const sinY = Math.sin(ry);
    const cosY = Math.cos(ry);

    for (const p of this.particles) {
      // rotate around X
      let y = p.y * cosX - p.z * sinX;
      let z = p.y * sinX + p.z * cosX;
      p.y = y;
      p.z = z;

      // rotate around Y
      let x = p.x * cosY + p.z * sinY;
      z = -p.x * sinY + p.z * cosY;
      p.x = x;
      p.z = z;

      // project to 2D
      const scale = this.perspective / (this.perspective - p.z);
      p.scale = scale;
      p.screenX = this.width / 2 + p.x;
      p.screenY = this.height / 2 + p.y * 0.9; // slight flatten
      // z-depth used for opacity / font size
      p.opacity = (p.z + this.radius) / (2 * this.radius);
    }

    // apply friction to pointer velocities so it slows down
    this.vx *= this.friction;
    this.vy *= this.friction;
    // tiny clamp to avoid infinite micro movement
    if (Math.abs(this.vx) < 0.00001) this.vx = 0;
    if (Math.abs(this.vy) < 0.00001) this.vy = 0;
  }



  private render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // sort by z to draw far->near
    const list = this.particles.slice().sort((a, b) => (a.z - b.z));

    for (let i = 0; i < 2; i++) { // número de rayos por frame
      const p1 = this.particles[Math.floor(Math.random() * this.particles.length)];
      const p2 = this.particles[Math.floor(Math.random() * this.particles.length)];

      // Solo si están relativamente cerca para que luzca natural
      const dist = Math.hypot(p1.screenX - p2.screenX, p1.screenY - p2.screenY);
      if (dist < this.radius * 0.8) {
        this.drawLightning(p1.screenX, p1.screenY, p2.screenX, p2.screenY);
      }
    }

    for (const p of list) {
      ctx.save();
      ctx.globalAlpha = 0.25 + p.opacity * 0.75; // keep visible even for far items
      const fontSize = Math.max(10, Math.round(this.fontBase * p.scale * 1.1));
      ctx.font = `bold ${fontSize}px Inter, system-ui, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // shadow for depth
      ctx.shadowBlur = 8 * p.opacity;
      ctx.shadowColor = `rgba(0,0,0,${0.25 * p.opacity})`;
      // color variation - near items brighter
      const alphaColor = Math.min(1, 0.35 + p.opacity * 0.65);
      ctx.fillStyle = `rgba(255,255,255,${alphaColor})`;

      ctx.fillText(p.text, p.screenX, p.screenY);
      ctx.restore();
    }
  }
}