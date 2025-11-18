import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EditUserComponent } from './edit-user.component';

describe('EditUserComponent', () => {
    let component: EditUserComponent;
    let fixture: ComponentFixture<EditUserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditUserComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EditUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
