// MiEditor.jsx
import { useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function EditorCacei({ setJustification, value, readOnly }) {
  useEffect(() => {
    console.log('EditorCacei - Props:', { value, readOnly });
  }, [readOnly, value]);

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          toolbar: readOnly
            ? []
            : [
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'insertTable',
                'undo',
                'redo'
              ],
          table: {
            contentToolbar: readOnly
              ? []
              : ['tableColumn', 'tableRow', 'mergeTableCells']
          },
          readOnly: readOnly
        }}
        onReady={(editor) => {
          console.log('EditorCacei - Editor initialized:', {
            isReadOnly: editor.isReadOnly
          });
        }}
        onChange={(event, editor) => {
          const content = editor.getData();
          console.log('EditorCacei - Content changed:', {
            contentLength: content.length,
            isReadOnly: editor.isReadOnly
          });
          setJustification(content);
        }}
      />
    </div>
  );
}
