import { Component, Input, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { BtnNvgComponent } from '../btn-nvg/btn-nvg.component';

@Component({
  selector: 'portfolio',
  standalone: true,
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  imports: [RouterModule, CardComponent, BtnNvgComponent],
})


export class PortfolioComponent {
  screenWidth: number = 0;
  screenHeight: number = 0;
  idPort: number | null = null;
  constructor(private renderer: Renderer2) {

  }

  @Input() mensajeRecibido: string = "";


  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;


    // Si deseas que se actualice en tiempo real cuando cambie la resolución
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    });
  }



}
