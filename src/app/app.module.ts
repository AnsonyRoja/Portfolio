import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// Asegúrate de que tus componentes existan
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SkillsSphereComponent } from './skills-sphere/skills-sphere.component';
import { CardComponent } from './card/card.component';
import { RssComponent } from './rss/rss.component';
import { BtnNvgComponent } from './btn-nvg/btn-nvg.component';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PortfolioComponent,
    SkillsSphereComponent,
    CardComponent,
    RssComponent,
    BtnNvgComponent,
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {


}
