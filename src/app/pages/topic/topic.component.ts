import { UtilityService } from './../../shared/services/utility.service';
import { BookService, BookFilter } from './../../shared/services/book.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit, OnDestroy {

  public searchTerm: string = "";
  public isOutline: boolean = false;
  public filter: BookFilter = { page: 1 };
  public debounceTimer: ReturnType<typeof setTimeout> | any;
  public filteredBooks: any[] = [];
  public isAllDataLoaded: boolean = false;
  public loadingData: boolean = false;
  public unsubscriber$ = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private bookService: BookService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.getParams();
  }

  public getParams(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((params) => {
        console.log("params", params);
        this.filter.topic = params.topic;
        this.getFilteredBooks();
      });
  }

  public getFilteredBooks(): void {
    if (this.isAllDataLoaded) {
      return;
    }
    if (this.filter.page === 1) {
      this.filteredBooks = [];
    }
    this.loadingData = true;
    console.log("parameters for filtering", this.filter);
    this.bookService.getFilterdBooks(this.filter)
      .pipe(takeUntil(this.unsubscriber$))
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
  }

  public searchTextOnDebounce(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.onSearchTextChange();
    }, 2 * 1000);
  }

  public onSearchTextChange(): void {
    this.filter.page = 1;
    this.filter.search = this.searchTerm;
    this.isAllDataLoaded = false;
    this.getFilteredBooks();
  }

  public clearSearchText(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.searchTerm = "";
    this.filter.search = "";
    this.onSearchTextChange();
    this.isOutline = false;
  }

  public onScroll(): void {
    if (this.loadingData) {
      return;
    }
    this.filter.page += 1;
    this.getFilteredBooks();
  }

  public openBook(book): void {
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
  }

  public inputBoxClicked(): void {
    this.isOutline = !this.isOutline;
  }

  public browserBack(): void {
    (window as any).history.back()
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }




}
