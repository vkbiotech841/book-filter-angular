import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private toastrService: ToastrService
  ) { }

  /////////////////// ngx-toastr services start here //////////////////////////
  public showSuccess(title?, message?, time?): void {
    this.toastrService.success(title, message, {
      timeOut: time || 3000,
      // progressBar: true,
      positionClass: 'toast-top-right'
    });
  };

  public showError(title?, message?, time?): void {
    this.toastrService.error(title, message, {
      timeOut: time || 3000,
      // progressBar: true,
      positionClass: 'toast-top-right'
    });
  };

  public showInfo(title?, message?, time?): void {
    this.toastrService.info(title, message, {
      timeOut: time || 3000,
      // progressBar: true,
      positionClass: 'toast-top-center'
    });
  };

  public showWarning(title?, message?, time?): void {
    this.toastrService.warning(title, message, {
      timeOut: time || 3000,
      // progressBar: true,
      positionClass: 'toast-top-center'
    });
  };

  /////////////////// ngx-toastr services ends here //////////////////////////
}
