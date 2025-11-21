import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SkillsSphereComponent } from './skills-sphere/skills-sphere.component';
import { RssComponent } from './rss/rss.component';

const routes: Routes = [
  { path: '', component: PortfolioComponent }, // Corresponde a routerLink="/"
  { path: 'skills-sphere', component: SkillsSphereComponent }, // Corresponde a routerLink="/sobre-mi"
  { path: 'rss', component: RssComponent },
  { path: ':idPort', component: PortfolioComponent }, // Corresponde a routerLink="/"

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
