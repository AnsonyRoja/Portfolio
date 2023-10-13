import { Component } from '@angular/core';

//DECORADOR
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nombre: String = 'Ansony Rojas';
  title = 'portfolio';
}
