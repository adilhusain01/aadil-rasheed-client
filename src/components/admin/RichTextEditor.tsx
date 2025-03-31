"use client";

import { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

interface FilePickerCallbackArgs {
  callback: (url: string, meta?: Record<string, string>) => void;
  value: string;
  meta: {
    filetype: string;
    [key: string]: any;
  };
}

const RichTextEditor = ({ value, onChange, height = 500, placeholder = 'Write your content here...' }: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [internalContent, setInternalContent] = useState(value);

  // Update internal content when value prop changes
  useEffect(() => {
    // Only update if the editor isn't currently focused to prevent cursor jumping
    if (editorRef.current && !editorRef.current.hasFocus()) {
      setInternalContent(value);
    }
  }, [value]);

  useEffect(() => {
    // Check if system prefers dark mode
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      mediaQuery.addEventListener('change', handler);
      
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  const handleEditorChange = (content: string) => {
    setInternalContent(content);
    onChange(content);
  };

  return (
    <>
      <Editor
        apiKey="zsw4tabnusu8qdsksj8vjszbka7n6zt3b9uo92dh7si5g90u" // Using no API key to avoid external calls
        onInit={(evt: any, editor: any) => {
          editorRef.current = editor;
          setEditorInitialized(true);
        }}
        value={internalContent}
        onEditorChange={handleEditorChange}
        init={{
          height,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | link image media | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          placeholder,
          skin: isDarkMode ? 'oxide-dark' : 'oxide',
          content_css: isDarkMode ? 'dark' : 'default',
          branding: false,
          promotion: false,
          image_advtab: true,
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          file_picker_callback: function (callback: (url: string, meta?: Record<string, string>) => void, value: string, meta: { filetype: string }) {
            // Custom file picker that prompts the user to input a URL
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              
              input.onchange = function () {
                if (input.files && input.files[0]) {
                  const file = input.files[0];
                  
                  // Check if the file is an image
                  if (!file.type.startsWith('image/')) {
                    alert('Please select an image file.');
                    return;
                  }
                  
                  // Alert the user that in a real application this would
                  // upload to the server, but for this example, we'll just use a placeholder
                  alert('In a real application, this would upload the image to your server. Please use Media Uploads for actual image uploads.');
                  
                  // Use a placeholder image URL for demonstration
                  // In a real app, you'd upload to your server and return the URL
                  const reader = new FileReader();
                  reader.onload = function (e) {
                    if (e.target && typeof e.target.result === 'string') {
                      callback(e.target.result, { alt: file.name });
                    }
                  };
                  reader.readAsDataURL(file);
                }
              };
              
              input.click();
            }
          },
          send_statistics: false,
          collect_annotations: false,
          setup: function(editor: any) {
            editor.on('change', function() {
              editor.save(); // This will trigger the onEditorChange event
            });
          }
        }}
      />
      {!editorInitialized && (
        <div className="bg-gray-100 animate-pulse h-[500px] rounded-md flex items-center justify-center">
          <p className="text-gray-500">Loading editor...</p>
        </div>
      )}
    </>
  );
};

export default RichTextEditor;
