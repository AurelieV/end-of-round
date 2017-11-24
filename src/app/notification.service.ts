import { MatSnackBar } from "@angular/material";
import { Injectable } from "@angular/core";

@Injectable()
export class NotificationService {
    constructor(private snackBar: MatSnackBar) {}

    notify(message: string) {
        this.snackBar.open(message, null, { duration: 1000 })
    }
}