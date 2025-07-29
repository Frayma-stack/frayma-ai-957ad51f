import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, Node as TiptapNode } from '@tiptap/react';
import { PLSBlockComponent } from '../components/PLSBlockComponent';

export interface PLSBlockAttributes {
  type: 'relatable' | 'real' | 'remarkable' | 'results';
  content: string;
  guidance: string;
  locked: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    plsBlock: {
      setPLSBlock: (attributes: PLSBlockAttributes) => ReturnType;
    };
  }
}

export const PLSSmartBlock = Node.create({
  name: 'plsBlock',
  
  group: 'block',
  
  content: 'block*',
  
  addAttributes() {
    return {
      type: {
        default: 'relatable',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => ({
          'data-type': attributes.type,
        }),
      },
      content: {
        default: '',
        parseHTML: element => element.getAttribute('data-content'),
        renderHTML: attributes => ({
          'data-content': attributes.content,
        }),
      },
      guidance: {
        default: '',
        parseHTML: element => element.getAttribute('data-guidance'),
        renderHTML: attributes => ({
          'data-guidance': attributes.guidance,
        }),
      },
      locked: {
        default: false,
        parseHTML: element => element.getAttribute('data-locked') === 'true',
        renderHTML: attributes => ({
          'data-locked': attributes.locked.toString(),
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="pls-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'pls-block' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PLSBlockComponent);
  },

  addCommands() {
    return {
      setPLSBlock:
        (attributes: PLSBlockAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});