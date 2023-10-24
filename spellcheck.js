import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SpellcheckEditing from './spellcheck-editing';

export default class Spellcheck extends Plugin {
  static get requires() {
    return [SpellcheckEditing];
  }
}
