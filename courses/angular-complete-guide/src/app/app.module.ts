import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {PostCreateComponent} from "./post-create.component/post-create.component";
import {FormsModule} from "@angular/forms";
import { PostRenderComponent } from './post-render.component/post-render.component';

@NgModule({
    declarations: [
        AppComponent,
        PostCreateComponent,
        PostRenderComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
