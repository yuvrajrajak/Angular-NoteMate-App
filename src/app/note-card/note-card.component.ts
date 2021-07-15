import { Input, Output, Renderer2, EventEmitter } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent implements OnInit {
  
  @Input('title') title: string;
  @Input('body') body: string;
  @Input() link: string; 

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  // @ViewChild('truncator') truncator: ElementRef<HTMLElement>;
  // @ViewChild('bodyText') bodyText: ElementRef<HTMLElement>;

  // constructor(private renderer: Renderer2) {}
  constructor( ) {}


  ngOnInit() {
    // // work out if there is a text overflow and if not, then hide the truncator
    // let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    // let viewableHeight = parseInt(style.getPropertyValue('height'), 10);

    // if (this.bodyText.nativeElement.scrollHeight > viewableHeight) {
    //   // if there is no text overflow, show the fade out truncator
    //   this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    // } else {
    //   // else (there is a text overflow ), hide the fade out truncator
    //   this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    // }

   
  }

  onXButtonClick(){
    this.deleteEvent.emit();
  }
}
