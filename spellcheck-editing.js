import { Plugin } from '@ckeditor/ckeditor5-core';
import './spellcheck.css';
import TwoStepCaretMovement from '@ckeditor/ckeditor5-typing/src/twostepcaretmovement';
import { clickOutsideHandler, ContextualBalloon } from '@ckeditor/ckeditor5-ui';
import { ClickObserver } from '@ckeditor/ckeditor5-engine';
import SpellcheckView from './spellcheck-view';
import SpellcheckReplaceCommand from './spellcheck-replace-command';
import SpellcheckCommand from './spellcheck-command';

export default class SpellcheckEditing extends Plugin {

  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add(
      'replaceWord', new SpellcheckReplaceCommand(this.editor)
    );

    this.editor.commands.add(
      'spellcheck', new SpellcheckCommand(this.editor)
    );

    this.editor.editing.view.addObserver(ClickObserver);

    this.listenTo(this.editor.editing.view.document, 'click', (evt, data) => {
      let clickedElement = data.target;
      if (clickedElement.is('element', 'span') && clickedElement.hasClass('spellcheck')) {
        this.dropDown = this._createDropdown(clickedElement.getAttribute('words'));
        this._showUI();
      }
    }, {context: '$capture'});

    const twoStepCaretMovementPlugin = this.editor.plugins.get(TwoStepCaretMovement);
    twoStepCaretMovementPlugin.registerAttribute('words');
  }

  _createDropdown(words) {
    const editor = this.editor;
    const spellcheckView = new SpellcheckView(editor.locale, words);

    this.listenTo(spellcheckView, 'replace', (evt, args) => {
      editor.editing.view.focus();
      editor.execute('replaceWord', args.item);
      this._hideUI();
    });

    clickOutsideHandler({
      emitter: spellcheckView,
      activator: () => this._balloon.visibleView === spellcheckView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI()
    });

    spellcheckView.keystrokes.set('Esc', (data, cancel) => {
      this._hideUI();
      cancel();
    });

    return spellcheckView;
  }

  _hideUI() {
    this._balloon.remove(this.dropDown);
    this.editor.editing.view.focus();
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;
    target = () => view.domConverter.viewRangeToDom(
      viewDocument.selection.getFirstRange()
    );
    return {target};
  }

  _showUI() {
    this._balloon.add({
      view: this.dropDown,
      position: this._getBalloonPositionData()
    });

    this.dropDown.focus();
  }

  _defineSchema() {
    const schema = this.editor.model.schema;
    schema.extend('$text', {
      allowAttributes: ['words']
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;
    conversion.for('upcast').elementToAttribute({
      view: {
        name: 'span',
        attributes: ['spellcheck'],
      },
      model: {
        key: 'words',
        value: viewElement => {
          return viewElement.getAttribute('words');
        }
      }
    });

    conversion.for('editingDowncast').attributeToElement({
      model: 'words',
      view: (words, {writer}) => {
        return writer.createAttributeElement('span', {
          words,
          class: 'spellcheck'
        });
      }
    });

    conversion.for('dataDowncast').attributeToElement({
      model: 'words',
      view: (words, {writer}) => {
        return writer.createAttributeElement('span', {
          words,
          class: 'spellcheck'
        });
      }
    });
  }
}
