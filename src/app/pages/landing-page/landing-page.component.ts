import { takeUntil } from 'rxjs/operators';
import { BookService } from './../../shared/services/book.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {

  public allBooks: any[] = [];
  public topics = [
    "fiction",
    "PHILOSOPHY",
    "drama",
    "history",
    "humor",
    "adventure",
    "politics"
  ];

  public unsubscriber$ = new Subject();

  constructor(
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.getAllBooks();
  }


  public getAllBooks(): void {
    this.bookService.getBooks()
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(result => {
        this.allBooks = result.results;
        console.log("all books", this.allBooks);
      }, error => {
        console.log("error", error);

      })
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }







}
