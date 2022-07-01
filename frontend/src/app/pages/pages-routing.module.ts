import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: "home", loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path: "room", loadChildren: () => import('./room/room.module').then(m => m.RoomModule)},
  {path: "room/:id", loadChildren: () => import('./room-child/room-child.module').then(m => m.RoomChildModule)},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
