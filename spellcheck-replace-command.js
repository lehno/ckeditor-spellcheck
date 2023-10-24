import { Command } from '@ckeditor/ckeditor5-core';

export default class SpellcheckReplaceCommand extends Command {
  execute(word) {
    const model = this.editor.model;
    const selection = model.document.selection;
    model.change(writer => {
      writer.remove(selection.anchor.textNode);
      model.insertContent(writer.createText(word), selection.getFirstPosition());
    });
  }
}
