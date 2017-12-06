import { MatSnackBar } from "@angular/material";
import { Injectable } from "@angular/core";

@Injectable()
export class NotificationService {
    constructor(private snackBar: MatSnackBar) {}

    notify(message: string) {
        this.snackBar.open(message, "Dismiss", { duration: 5000, verticalPosition: 'top' })
    }
}