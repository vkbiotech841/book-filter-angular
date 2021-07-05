import { environment } from './../../environments/environment';
import { Injectable } from "@angular/core";

@Injectable()
export class BaseApiUrl {

    public static Books = environment.BookUrl;

}