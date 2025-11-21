import { Component } from '@angular/core';
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

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('idPort');
    this.idPort = id ? parseInt(id) : null;

    console.log('numero por url, recibido', this.idPort);


  }
}
