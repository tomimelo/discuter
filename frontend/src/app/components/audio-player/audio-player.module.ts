import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiSliderModule } from '@taiga-ui/kit';

const TAIGA_MODULES = [
  TuiButtonModule,
  TuiSliderModule,
  TuiLoaderModule
]

@NgModule({
  declarations: [
    AudioPlayerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ...TAIGA_MODULES
  ],
  exports: [
    AudioPlayerComponent
  ]
})
export class AudioPlayerModule { }
