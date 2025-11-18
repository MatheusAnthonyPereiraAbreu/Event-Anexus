import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

describe('InputComponent', () => {
    let component: InputComponent;
    let fixture: ComponentFixture<InputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InputComponent, FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
        component.control = new FormControl('');
        component.name = 'test-input';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render input element', () => {
        const compiled = fixture.nativeElement;
        const input = compiled.querySelector('input');
        expect(input).toBeTruthy();
    });

    it('should have default type text', () => {
        expect(component.type).toBe('text');
    });
});
