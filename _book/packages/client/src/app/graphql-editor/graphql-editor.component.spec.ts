import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphqlEditorComponent } from './graphql-editor.component';

describe('GraphqlEditorComponent', () => {
  let component: GraphqlEditorComponent;
  let fixture: ComponentFixture<GraphqlEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphqlEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphqlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
