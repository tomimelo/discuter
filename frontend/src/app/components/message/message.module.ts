import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiAvatarModule} from '@taiga-ui/kit';

import { MessageComponent } from './message.component';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { TuiButtonModule } from '@taiga-ui/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AudioPlayerModule } from '../audio-player/audio-player.module';
import { ImageViewerModule } from '../image-viewer/image-viewer.module';

const TAIGA_MODULES = [
  TuiAvatarModule,
  TuiButtonModule,
]

@NgModule({
  declarations: [
    MessageComponent,
    TimePipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    AudioPlayerModule,
    ImageViewerModule,
    ...TAIGA_MODULES
  ],
  exports: [
    MessageComponent
  ]
})
export class MessageModule { }
