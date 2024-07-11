import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurentDashComponent } from './restaurent-dash/restaurent-dash.component';
import { HomeComponent } from './Home/Home.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'Home',pathMatch: 'full'
  },
  {
   path: 'Home', component: HomeComponent 
  },
 {
   path:'restaurent' , component: RestaurentDashComponent
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
