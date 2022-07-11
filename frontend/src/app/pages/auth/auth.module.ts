import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import {TuiLoaderModule} from '@taiga-ui/core';

const TAIGA_MODULES = [
  TuiLoaderModule
]
@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ...TAIGA_MODULES
  ]
})
export class AuthModule { }
