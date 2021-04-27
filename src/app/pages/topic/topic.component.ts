import { BookService, BookFilter } from './../../shared/services/book.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  filter: BookFilter = { page: 1 };

  constructor(
    private activatedRoute: ActivatedRoute,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.getParams();
  }


  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      console.log("params", params);
      this.filter.topic = params.topic;
      this.getFilteredBooks();
    });
  };


  filteredBooks: any[] = [];
  isAllDataLoaded: boolean = false;
  loadingData: boolean = false;

  getFilteredBooks() {
    if (this.isAllDataLoaded) {
      return;
    }
    if (this.filter.page === 1) {
      this.filteredBooks = [];
    }
    this.loadingData = true;
    this.bookService.getFilterdBooks(this.filter)
      .subscribe(result => {
        if (result.next) {
          this.isAllDataLoaded = false;
        } else {
          this.isAllDataLoaded = true;
        }
        this.filteredBooks = this.filteredBooks.concat(result.results);
        this.loadingData = false;
        console.log("filterd result", this.filteredBooks);

      }, error => {
        this.loadingData = false;
      });
  }

  onSearchTextChange() {
    this.filter.page = 1;
    this.isAllDataLoaded = false;
    this.getFilteredBooks();
  }

  onScroll() {
    if (this.loadingData) {
      return;
    }
    this.filter.page += 1;
    this.getFilteredBooks();
  }

  openBook(book) {
    let bookUrlTobeOpened;
    if (book.formats["text/html"]) {
      bookUrlTobeOpened = book.formats["text/html"]
    } else if (book.formats["application/pdf"]) {
      bookUrlTobeOpened = book.formats["application/pdf"]
    } else if (book.formats["text/plain"]) {
      bookUrlTobeOpened = book.formats["text/plain"]
    } else if (book.formats["application/zip"]) {
      bookUrlTobeOpened = 'https://docs.google.com/viewer?url=' + book.formats["application/zip"]
    }

    if (bookUrlTobeOpened) {
      window.open(bookUrlTobeOpened, '_target')
    } else {
      window.alert("No viewable version available");
    }
  }





}
