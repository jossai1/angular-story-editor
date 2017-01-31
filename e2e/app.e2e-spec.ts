import { AngularStoryEditorPage } from './app.po';

describe('angular-story-editor App', function() {
  let page: AngularStoryEditorPage;

  beforeEach(() => {
    page = new AngularStoryEditorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
