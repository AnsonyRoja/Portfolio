import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AudioService } from './audio.service';

//DECORADOR
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})


export class AppComponent {



  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  isPlaying = false;
  audioSub: any;
  constructor(private renderer: Renderer2, public audioService: AudioService) { };



  ngAfterViewInit() {

    const cursor = document.getElementById("electric-cursor")!;
    const flash = document.getElementById("cursor-flash")!;
    this.audioSub = this.audioService.isPlaying$.subscribe(playing => {
      this.isPlaying = playing;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isPlaying) {
        // Pausar audio si la página no está visible
        this.audioService.setUserEnabled(false);
      }
    });

    document.addEventListener("mousemove", (e) => {
      const offsetX = 25; // ancho / 2
      const offsetY = 25; // alto / 2

      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";

      flash.style.left = e.clientX - offsetX + "px";
      flash.style.top = e.clientY - offsetY + "px";
    });

  }


  toggleMusic() {
    const audio = this.audioPlayerRef.nativeElement;

    this.audioService.registerAudioElement(this.audioPlayerRef.nativeElement)


    // console.log(audio);
    if (!this.audioService['_isEnabled']) {
      console.log('entre aqui');

      this.audioService.setUserEnabled(true);
    } else if (this.audioService['_isEnabled'] && this.audioService.isActYt == false) {
      this.audioService.setUserEnabled(false);
    } else if (!audio) {
      this.audioService.setUserEnabled(true);
    }
    this.audioService.setVolume(0.1);
    this.audioService.toggle();


  }

  hideCursor() {
    const electric = document.getElementById('electric-cursor');
    const flash = document.getElementById('cursor-flash');

    if (electric) {
      this.renderer.setStyle(electric, 'opacity', '0');
    }

    if (flash) {
      this.renderer.setStyle(flash, 'opacity', '1');
      this.renderer.setStyle(flash, 'transform', 'scale(1.2)');
    }
  }

  showCursor() {
    const electric = document.getElementById('electric-cursor');
    const flash = document.getElementById('cursor-flash');

    if (electric) {
      this.renderer.setStyle(electric, 'opacity', '1');
    }

    if (flash) {
      this.renderer.setStyle(flash, 'opacity', '0');
      this.renderer.setStyle(flash, 'transform', 'scale(1)');
    }
  }


}
