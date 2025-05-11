// MiEditor.jsx
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useEffect } from 'react';

// Importaciones necesarias para funcionar sin CDN
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';

import 'tinymce/skins/ui/oxide/skin.min.css';

// Plugins locales
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/code';
import 'tinymce/plugins/wordcount';

export default function EditorCacei({setJustification, value, readOnly}) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      if (readOnly) {
        editor.getBody().setAttribute('contenteditable', false);
        editor.getBody().style.userSelect = 'none';
      } else {
        editor.getBody().setAttribute('contenteditable', true);
        editor.getBody().style.userSelect = 'auto';
      }
    }
  }, [readOnly]);

  return (
    <div className="">
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        onEditorChange={(content, editor) => {
          setJustification(content);
        }}
        value={value}
        init={{
          height: 400,
          menubar: false,
          plugins: ['link', 'lists', 'table', 'wordcount'],
          toolbar:
            'fontsize bold italic underline | backcolor | bullist numlist | table ',
          fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
          setup: (editor) => {
            editor.on('init', () => {
              if (readOnly) {
                editor.getBody().setAttribute('contenteditable', false);
                editor.getBody().style.userSelect = 'none';
              }
            });
          }
        }}
      />
    </div>
  );
}
