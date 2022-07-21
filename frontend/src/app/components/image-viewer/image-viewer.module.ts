import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerComponent } from './image-viewer.component';
import { TuiLoaderModule } from '@taiga-ui/core';

const TAIGA_MODULES = [
  TuiLoaderModule
]

@NgModule({
  declarations: [
    ImageViewerComponent
  ],
  imports: [
    CommonModule,
    ...TAIGA_MODULES
  ],
  exports: [
    ImageViewerComponent
  ]
})
export class ImageViewerModule { }
