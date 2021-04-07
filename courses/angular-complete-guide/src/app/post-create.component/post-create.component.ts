import {Component, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
import { PostData } from "../app.component";

@Component({
   selector: 'post-create',
   templateUrl: './post-create.component.html',
   styleUrls: ['post-create.component.scss'],
})
export class PostCreateComponent {
    @Output() onAddPost = new EventEmitter<PostData>();
    @Output() OnRemovePost = new EventEmitter<number>();
    @ViewChild('inputAutor') inpurRef: ElementRef;

    autor: string;
    postText: string;

    addNewPost() {
        if (!this.autor.trim() || !this.postText.trim()) {
            return
        }
        this.onAddPost.emit({
            autor: this.autor,
            text: this.postText,
            date: new Date(),
        });

        this.autor = this.postText = '';
    }

    focusAutor() {
        this.inpurRef.nativeElement.focus();
        console.log();
    }
}