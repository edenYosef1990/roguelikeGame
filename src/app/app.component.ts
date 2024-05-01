import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createGame } from '@eden_yosef/protogame/src/set-up-game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    createGame();
  }
  title = 'roguelikeGame';
}
