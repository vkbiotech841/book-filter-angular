import { BookService } from './../../shared/services/book.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.getAllBooks();
  }

  allBooks: any[] = [];

  getAllBooks() {
    this.bookService.getBooks()
      .subscribe(result => {
        this.allBooks = result.results;
        console.log("all books", this.allBooks);

      }, error => {
        console.log("error", error);

      })
  };


  topics = [
    "fiction",

  ]




}
