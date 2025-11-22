import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: true,
  imports: [NgIf]

})


export class CardComponent {

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';
  @Input() projectLink: string = '';
  @Input() githubLink: string = '';
  @Input() images: string[] = []; // Recibe las imágenes desde el padre
  @ViewChild('descWrapper') descWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('descText') descText!: ElementRef<HTMLParagraphElement>;
  constructor(private renderer: Renderer2) { };
  expanded: boolean = false;


  currentIndex: number = 0;
  sliding = false;

  nextImage() {
    if (this.sliding) return; // ⛔ Evita spam de clics

    if (!this.images || this.images.length === 0) return; // ⛔ No hay imágenes

    this.sliding = true;

    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.sliding = false;
    }, 200);
  }

  prevImage() {
    if (this.sliding) return; // ⛔ Evita spam de clics

    if (!this.images || this.images.length === 0) return; // ⛔ No hay imágenes

    this.sliding = true;

    setTimeout(() => {
      this.currentIndex =
        (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.sliding = false;
    }, 200);
  }

  toggleText() {
    const wrapper = this.descWrapper.nativeElement;
    const text = this.descText.nativeElement;

    if (!this.expanded) {
      // Expande: altura real del texto
      wrapper.style.height = text.scrollHeight + 'px';
    } else {
      // Colapsa: altura inicial
      wrapper.style.height = '120px';
    }

    this.expanded = !this.expanded;
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
