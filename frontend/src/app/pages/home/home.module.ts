import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TuiAvatarModule} from '@taiga-ui/kit';
import {TuiButtonModule, TuiHostedDropdownModule, TuiDataListModule, TuiSvgModule} from '@taiga-ui/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NavbarModule } from 'src/app/components/navbar/navbar.module';
import { NumPassModule } from 'src/app/components/num-pass/num-pass.module';

const TAIGA_MODULES = [
  TuiButtonModule,
  TuiAvatarModule,
  TuiHostedDropdownModule,
  TuiDataListModule,
  TuiSvgModule
]

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NavbarModule,
    NumPassModule,
    ...TAIGA_MODULES
  ]
})
export class HomeModule { }
