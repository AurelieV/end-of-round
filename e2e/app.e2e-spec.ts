import { EndOfRoundPage } from './app.po';

describe('end-of-round App', () => {
  let page: EndOfRoundPage;

  beforeEach(() => {
    page = new EndOfRoundPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
