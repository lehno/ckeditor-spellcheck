import { FocusCycler, submitHandler, View } from '@ckeditor/ckeditor5-ui';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { FocusTracker, KeystrokeHandler } from '@ckeditor/ckeditor5-utils';

export default class SpellcheckView extends View {
  constructor(locale, words) {
    super(locale);
    const list = words.split(',');
    const buttons = [];
    for (let item of list) {
      const actionButton = new ButtonView();
      actionButton.set({
        label: item,
        withText: true,
      });
      actionButton.on('execute', () => this.fire('replace', {item}));
      actionButton.render();
      buttons.push(actionButton);
    }
    this.focusTracker = new FocusTracker();
    this.keystrokes = new KeystrokeHandler();
    this.childViews = this.createCollection(buttons);

    this._focusCycler = new FocusCycler({
      focusables: this.childViews,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        focusPrevious: 'shift + tab',
        focusNext: 'tab'
      }
    });

    this.setTemplate({
      tag: 'div',
      attributes: {
        class: ['ck-spellcheck-dropdown']
      },
      children: this.childViews
    });
  }

  render() {
    super.render();

    submitHandler({
      view: this
    });

    this.childViews._items.forEach(view => {
      this.focusTracker.add(view.element);
    });
    this.keystrokes.listenTo(this.element);
  }

  focus() {
    this.childViews.first.focus();
  }

  destroy() {
    super.destroy();
    this.focusTracker.destroy();
    this.keystrokes.destroy();
  }
}
