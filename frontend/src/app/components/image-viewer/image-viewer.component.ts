import { Component, Input, OnInit } from '@angular/core';

export interface Image {
  id: string;
  url: string;
}

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  @Input() image: Image | null = null

  constructor() { }

  ngOnInit(): void {
  }

}
