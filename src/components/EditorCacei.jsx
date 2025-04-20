// MiEditor.jsx
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

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

export default function EditorCacei({setJustification}) {
  const editorRef = useRef(null);


  return (
    <div className="">
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        onEditorChange={(content, editor) => {
          setJustification(content);
        }}
        init={{
          height: 400,
          menubar: false,
          plugins: ['link', 'lists', 'table', 'wordcount'],
          toolbar:
            'undo redo | fontsize bold italic underline | backcolor | bullist numlist | table ',
            fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
        }}
      />

    </div>
  );
}
