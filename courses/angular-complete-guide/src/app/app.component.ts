import { Component } from '@angular/core';

export interface PostData {
  autor: string,
  text: string,
  date: Date,
  id? : number,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-complete-guide';

  postsData: PostData[] = [];

  addPost (newPost: PostData){
    newPost['id'] = this.postsData.length + 1;
    this.postsData.unshift(newPost);
  }

  removePost (postId: number) {
    this.postsData.splice(this.postsData.findIndex(item => item.id === postId), 1);

  }
}
