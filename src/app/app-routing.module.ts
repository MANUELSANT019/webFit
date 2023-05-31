import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EjercicioComponent } from './components/ejercicio/ejercicio.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { GuiaComponent } from './components/guia/guia.component';

const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'ejercicio', component: EjercicioComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: AppComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'guia', component: GuiaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
