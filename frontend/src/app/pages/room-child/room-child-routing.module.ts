import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomChildComponent } from './room-child.component';

const routes: Routes = [
  {path: '', component: RoomChildComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomChildRoutingModule { }
