import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { SocketService } from './shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sensors';

  constructor(private dialog : MatDialog, private socketService: SocketService) {}

  ngOnInit(): void{
    this.socketService.buildConnection();
  }

  openSettingsWindow()
  {
    this.dialog.open(SettingsComponent);
  }
}
