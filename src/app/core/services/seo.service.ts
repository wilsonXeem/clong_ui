import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  updateTitle(title: string): void {
    this.title.setTitle(title);
  }

  updateMetaTags(tags: { [key: string]: string }): void {
    Object.keys(tags).forEach(key => {
      this.meta.updateTag({ name: key, content: tags[key] });
    });
  }

  updateDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
  }

  updateKeywords(keywords: string): void {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  updateOgTags(tags: { title?: string; description?: string; image?: string; url?: string }): void {
    if (tags.title) {
      this.meta.updateTag({ property: 'og:title', content: tags.title });
    }
    if (tags.description) {
      this.meta.updateTag({ property: 'og:description', content: tags.description });
    }
    if (tags.image) {
      this.meta.updateTag({ property: 'og:image', content: tags.image });
    }
    if (tags.url) {
      this.meta.updateTag({ property: 'og:url', content: tags.url });
    }
  }
}
