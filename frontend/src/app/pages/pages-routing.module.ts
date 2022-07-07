import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: "home", loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: "room/:id", canActivate: [AuthGuard], loadChildren: () => import('./room/room.module').then(m => m.RoomModule)},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
