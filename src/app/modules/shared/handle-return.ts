import { MatDialogRef } from '@angular/material';

export function handleReturn(dialogRef: MatDialogRef<any>) {
    history.pushState("back", "", null); // for handle back button history has to be not empty
    const close = () => dialogRef.close();
    const listenBack = window.addEventListener("popstate", close);
    dialogRef.afterClosed().subscribe(_ => {
        window.removeEventListener("popstate", close);
    })
}