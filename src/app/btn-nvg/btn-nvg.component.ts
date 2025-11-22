import { Component, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-btn-nvg',
  templateUrl: './btn-nvg.component.html',
  styleUrls: ['./btn-nvg.component.css'],
  imports: [RouterModule],
  standalone: true,
})
export class BtnNvgComponent {

  idPort: number | null = null;
  menuOpen = false;


  constructor(private route: ActivatedRoute, private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside && this.menuOpen) {
      this.menuOpen = false; // ⛔ Cerrar menú
    }
  }
  toggleMenu() {
    console.log("Se esta ejecutando la funcion de toggle menu");
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('idPort');
    this.idPort = id ? parseInt(id) : null;

    console.log('numero por url, recibido', this.idPort);


  }
}
