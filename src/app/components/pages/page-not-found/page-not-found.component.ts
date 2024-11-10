import { Component } from '@angular/core';
import { LinkButtonComponent } from "../../partials/link-button/link-button.component";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [LinkButtonComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

}
