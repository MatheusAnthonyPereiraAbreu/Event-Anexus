import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

describe('SelectComponent', () => {
    let component: SelectComponent;
    let fixture: ComponentFixture<SelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectComponent, FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(SelectComponent);
        component = fixture.componentInstance;
        component.control = new FormControl('');
        component.name = 'test-select';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render select element', () => {
        const compiled = fixture.nativeElement;
        const select = compiled.querySelector('select');
        expect(select).toBeTruthy();
    });

    it('should have empty options by default', () => {
        expect(component.options).toEqual([]);
    });
});
