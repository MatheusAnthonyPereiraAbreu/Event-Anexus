import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

describe('TextareaComponent', () => {
    let component: TextareaComponent;
    let fixture: ComponentFixture<TextareaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TextareaComponent, FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TextareaComponent);
        component = fixture.componentInstance;
        component.control = new FormControl('');
        component.name = 'test-textarea';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render textarea element', () => {
        const compiled = fixture.nativeElement;
        const textarea = compiled.querySelector('textarea');
        expect(textarea).toBeTruthy();
    });

    it('should have default rows', () => {
        expect(component.rows).toBe(4);
    });
});
