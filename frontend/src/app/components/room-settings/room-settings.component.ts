import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.scss']
})
export class RoomSettingsComponent implements OnInit {

  get soundsForm(): FormGroup {
    return this.settingsForm.get('sounds') as FormGroup
  }

  public settingsForm = new FormGroup({
    sounds: new FormGroup({
      newMessage: new FormControl(true),
    })
  })

  constructor(private roomService: RoomService) { }

  public ngOnInit(): void {
    this.loadSettings()
    this.soundsForm.valueChanges.subscribe(() => {
      const newSettings = {
        sounds: this.soundsForm.value
      }
      this.roomService.setSettings(newSettings)
    })
  }

  public loadSettings(): void {
    const roomSettings = this.roomService.getSettings()
    this.settingsForm.patchValue(roomSettings, {emitEvent: false})
  }

}
