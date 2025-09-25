import { Directive, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';

@Directive({
  selector: '[appQuillEditor]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorDirective),
      multi: true
    }
  ]
})
export class QuillEditorDirective implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() placeholder = '';
  @Output() contentChange = new EventEmitter<string>();

  private quill: Quill | null = null;
  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const toolbarOptions = [
      ['bold', 'italic', 'underline'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ];

    this.quill = new Quill(this.elementRef.nativeElement, {
      theme: 'snow',
      placeholder: this.placeholder,
      modules: {
        toolbar: toolbarOptions
      }
    });

    this.quill.on('text-change', () => {
      const content = this.quill?.root.innerHTML || '';
      this.onChange(content);
      this.contentChange.emit(content);
    });

    this.quill.on('selection-change', () => {
      this.onTouched();
    });
  }

  ngOnDestroy() {
    if (this.quill) {
      this.quill = null;
    }
  }

  writeValue(value: string): void {
    if (this.quill && value !== this.quill.root.innerHTML) {
      this.quill.root.innerHTML = value || '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}