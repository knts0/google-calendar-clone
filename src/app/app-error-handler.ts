import { HttpErrorResponse } from '@angular/common/http'
import { ErrorHandler, Injectable } from '@angular/core'

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      const responseBody: { message: string } | null = error.error
      window.alert([
        responseBody?.message,
      ])
    }

  }
}
