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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const initialValueRef = useRef(value);

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

  useEffect(() => {
    // Only update the editor content if the editor is ready and the value has changed externally
    // This prevents the cursor jumping issue and inverted typing
    if (isEditorReady && editorRef.current && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value);
    }
  }, [value, isEditorReady]);

  return (
    <div className="rich-text-editor">
      {!isEditorReady && (
        <div className="bg-gray-100 animate-pulse h-[500px] rounded-md flex items-center justify-center">
          <p className="text-gray-500">Loading editor...</p>
        </div>
      )}
      
      <div className={!isEditorReady ? 'hidden' : ''}>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js" // Use local TinyMCE to avoid external calls
          onInit={(evt: any, editor: any) => {
            editorRef.current = editor;
            // Set initial content once
            editor.setContent(initialValueRef.current);
            setIsEditorReady(true);
          }}
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
            // Disable telemetry to prevent ad-blocker issues
            send_statistics: false,
            image_advtab: true,
            image_title: true,
            automatic_uploads: false,
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
            // This setup is crucial to fixing the inverted typing issue
            setup: function(editor: any) {
              // Only trigger onChange when user explicitly changes content
              editor.on('input keyup paste change', function() {
                // The setTimeout is important to prevent cursor jumping
                setTimeout(() => {
                  const newContent = editor.getContent();
                  onChange(newContent);
                }, 0);
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
