import { UtilityService } from './../../shared/services/utility.service';
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
    private bookService: BookService,
    private utilityService: UtilityService
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
    console.log("parameters for filtering", this.filter);
    this.bookService.getFilterdBooks(this.filter)
      .subscribe(result => {
        console.log("filtered result", result);
        // This is for identifing, if next page is available.
        if (result.next) {
          this.isAllDataLoaded = false;
        } else {
          this.isAllDataLoaded = true;
        }
        const booksWithCoverImage = result.results.filter(x => {
          return x.formats['image/jpeg'];
        })
        this.filteredBooks = this.filteredBooks.concat(booksWithCoverImage);
        this.loadingData = false;
        console.log("filterd books", this.filteredBooks);

      }, error => {
        this.loadingData = false;
        this.utilityService.showError(error, "Something Went Wrong!");
      });
  };

  onSearchTextChange() {
    this.filter.page = 1;
    this.isAllDataLoaded = false;
    this.getFilteredBooks();
  };


  debounceTimer: any;
  searchTextOnDebounce() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.onSearchTextChange();
    }, 1 * 1000);
  };

  clearSearchText() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.filter.search = "";
    this.onSearchTextChange();
    this.isOutline = false;
  }



  onScroll() {
    if (this.loadingData) {
      return;
    }
    this.filter.page += 1;
    this.getFilteredBooks();
  };

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
      this.utilityService.showError("No viewable version available");
    }
  };


  isOutline: boolean = false;
  inputBoxClicked() {
    this.isOutline = !this.isOutline;

  }





}
