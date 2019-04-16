import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Page } from '../page';
import { Quest } from '../quest';
import { Condition } from '../condition';
import { PageOption } from '../page-option';

@Component({
  templateUrl: './quest-page.component.html'
})
export class QuestPageComponent implements OnInit {

  public pages: Map<string, Page> = new Map<string, Page>();

  public page: Page;

  public variables: Map<string, any>;

  public constructor(private http: HttpClient) {
  }

  public ngOnInit() {
    this.getJSON().subscribe((quest: Quest) => {
      if (quest.init) {
        this.variables = new Map(Object.entries(quest.init));
      }
      if (quest.pages) {
        quest.pages.forEach((page: Page) => this.pages.set(page.number, page));
        this.onClick('1');
      }
    });
  }

  public onClick(route: string): void {
    const page = this.pages.get(route);
    if (page.update) {
      Object.entries(page.update).forEach(([k, v]: [string, any]) => {
        this.variables.set(k, v);
      });
    }
    if (page.calc) {
      Object.entries(page.calc).forEach(([k, v]: [string, any]) => {
        this.variables.set(k, (new Function('return ' + v))());
      });
    }
    this.page = this.pages.get(route);
  }

  public getJSON(): Observable<any> {
    return this.http.get('mock/quest.json');
  }

  public calcCondition(option: PageOption): boolean {
    if (!option.condition) {
      return true;
    }
    const condition: Condition = option.condition;
    return (new Function(...condition.args, 'return ' + condition.body))
      .apply(null, condition.args.map((a: string) => this.variables.get(a)));
  }

}

