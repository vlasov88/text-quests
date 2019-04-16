import { PageOption } from './page-option';

export class Page {
  public 'number': string;
  public caption: string;
  public text: string;
  public options: PageOption[];
  public update: {[variable: string]: any};
  public calc: {[variable: string]: string};
}
