import {Component, Input, EventEmitter, Output,} from '@angular/core';
import { PostData } from "../app.component";

@Component({
  selector: 'app-post-render',
  templateUrl: './post-render.component.html',
  styleUrls: ['./post-render.component.scss']
})
export class PostRenderComponent
{
  @Output() onRemovePost = new EventEmitter<number>();
  @Input() post: PostData;

  constructor() { }

  deletePost(postId) {
    this.onRemovePost.emit(
        postId,
    );
  }
}
