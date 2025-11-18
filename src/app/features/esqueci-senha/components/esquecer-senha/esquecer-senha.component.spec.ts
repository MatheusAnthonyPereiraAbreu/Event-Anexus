import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EsquecerSenhaComponent } from './esquecer-senha.component';

describe('EsquecerSenhaComponent', () => {
  let component: EsquecerSenhaComponent;
  let fixture: ComponentFixture<EsquecerSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsquecerSenhaComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EsquecerSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
