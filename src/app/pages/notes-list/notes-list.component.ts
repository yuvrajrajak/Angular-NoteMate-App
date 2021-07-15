import { Component, ElementRef, OnInit, QueryList} from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();
  @ViewChild('filterInput') filterInputElRef: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    // we want to retrieve all notes form NotesService
    this.notes = this.notesService.getAll();
    // this.filteredNotes = this.notesService.getAll();
    this.filter('');
  }

  deleteNote(note: Note) {
    let noteId = this.notesService.getId(note);
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  generateNoteURL(note: Note){
    let noteId = this.notesService.getId(note);
    return noteId;
  }

  filter(query:string) {
    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();

    // split up the search query into individual words

    let terms: string[] = query.split(' '); // split on spaces

    // remove duplicate search terms

    terms = this.removeDuplicates(terms);
    // compile all relevant results into the allResults array

    terms.forEach(term=>{
      let results: Note[] = this.relevantNotes(term);
      // append results to the allResults array
      allResults = [...allResults, ...results]
    })
    // allResults will include duplicate notes
    // because a particular note can be the result of many search terms
    // but we don't want to show the same note multiple times on the UI
    // so we first must remove the duplicates

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    // now sort by relevancy
    this.sortByRelevancy(allResults);

  }
  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    // loop through the input array and add the items to the set

    arr.forEach((e) => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter((note) => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if(note.body && note.body.toLowerCase().includes(query)){
        return true;
      }
      return false;
    });
    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]){
  // This method will calculate the relevancy of a note based on the number of times it
  // appears in the search results

  let noteCountObj: Object = {}; // format - key:value => NoteId:number (note object id : count)

  searchResults.forEach(note=>{
    let noteId = this.notesService.getId(note); // get the notes id

    if(noteCountObj[noteId]){
      noteCountObj[noteId] += 1;
    }else {
      noteCountObj[noteId] = 1;
    }
  })
  
  this.filteredNotes = this.filteredNotes.sort((a: Note, b:Note)=>{
    let aId = this.notesService.getId(a);
    let bId = this.notesService.getId(b);

    let aCount = noteCountObj[aId];
    let bCount = noteCountObj[bId];

    return bCount - aCount;
  })

  }
}