import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CanvasDirective } from './canvas.directive';
import { GraphqlEditorComponent } from './graphql-editor/graphql-editor.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CanvasDirective,
        GraphqlEditorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
