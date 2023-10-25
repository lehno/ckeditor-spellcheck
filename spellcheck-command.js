import { Command } from '@ckeditor/ckeditor5-core';

export default class SpellcheckCommand extends Command {
  execute(dictionary) {
    const range = this.editor.model.createRangeIn(this.editor.model.document.getRoot());
    const bodySections = [];
    for (const value of range.getItems()) {
      if (value.is('element', 'sectionContent')) {
        bodySections.push(value);
      }
    }

    this.editor.model.change(writer => {
      for (const section of bodySections) {
        const sectionRange = this.editor.model.createRangeIn(section);
        const ranges = [];
        for (const item of sectionRange.getItems()) {
          if (item.is('$textProxy')) {
            console.log(item.data);
            let words = item.data.split(' ');
            for (const word of words) {
              let sIdx = item.textNode.data.indexOf(word);
              let eIdx = sIdx + word.length;
              const startPosition = writer.createPositionAt(item.textNode.parent, sIdx + item.textNode.startOffset);
              const endPosition = writer.createPositionAt(item.textNode.parent, eIdx + item.textNode.startOffset);
              const range = writer.createRange(startPosition, endPosition);
              ranges.push(range);
              // writer.setAttribute('words', 'test,qwe,qwe,ewq', range);
            }
          }
        }
        for (const range of ranges.reverse()) {
          writer.setAttribute('words', 'test,qwe,qwe,ewq', range);
        }
      }
    });

    // const range = this.editor.editing.view.createRangeIn(this.editor.editing.view.document.getRoot());
    // const toBeChanged = [];
    // for (const value of range.getWalker({ignoreElementEnd: true})) {
    //   if (value.item.name === 'div' && value.item.hasClass('body-section')) {
    //     toBeChanged.push(value.item);
    //   }
    // }
    // this.editor.editing.view.change(writer => {
    //   for (const viewElement of toBeChanged) {
    //     this.traverseModel(viewElement, writer, dictionary);
    //   }
    // });

    // for (const viewElement of toBeChanged) {
    //   if (viewElement.hasClass('highlight-selected')) {
    //     writer.removeClass('highlight-selected', viewElement);
    //   } else if (+viewElement.getAttribute('utterance') === utterance) {
    //     writer.addClass('highlight-selected', viewElement);
    //   }
    //   // const oldText = item;
    //   // const newText = writer.createText(content, Object.fromEntries(oldText.getAttributes()));
    //   // this.editor.model.insertContent(newText, writer.createRangeOn(oldText));
    // }
  }

  traverseModel(element, writer, dictionary) {
    for (const child of element.getChildren()) {
      if (child.is('text')) {
        const words = child.data.split(' ');
        console.log(words);
        for (const word of words) {
          console.log(word);
        }
      } else if (child.is('element')) {
        this.traverseModel(child, writer);
      }
    }
  }
}
