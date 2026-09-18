"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { supabase } from '@/lib/supabase';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // Upload to Supabase
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `blog-images/${fileName}`;

        try {
          const { error: uploadError } = await supabase.storage
            .from('public-images')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            alert('Failed to upload image. Please try again.');
            return;
          }

          const { data } = supabase.storage.from('public-images').getPublicUrl(filePath);
          editor.chain().focus().setImage({ src: data.publicUrl }).run();
        } catch (error) {
          console.error(error);
          alert('An error occurred during upload.');
        }
      }
    };
    input.click();
  };

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? styles.activeTool : styles.toolBtn}
      >
        <i className="fas fa-bold"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? styles.activeTool : styles.toolBtn}
      >
        <i className="fas fa-italic"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? styles.activeTool : styles.toolBtn}
      >
        <i className="fas fa-strikethrough"></i>
      </button>
      <div className={styles.divider} />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? styles.activeTool : styles.toolBtn}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? styles.activeTool : styles.toolBtn}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? styles.activeTool : styles.toolBtn}
      >
        H3
      </button>
      <div className={styles.divider} />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? styles.activeTool : styles.toolBtn}
      >
        <i className="fas fa-list-ul"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? styles.activeTool : styles.toolBtn}
      >
        <i className="fas fa-list-ol"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? styles.activeTool : styles.toolBtn}
      >
        <i className="fas fa-quote-right"></i>
      </button>
      <div className={styles.divider} />
      <button
        type="button"
        onClick={toggleLink}
        className={editor.isActive('link') ? styles.activeTool : styles.toolBtn}
      >
        <i className="fas fa-link"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={styles.toolBtn}
      >
        <i className="fas fa-minus"></i>
      </button>
      <button
        type="button"
        onClick={addImage}
        className={styles.toolBtn}
        title="Add Image"
      >
        <i className="fas fa-image"></i>
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: styles.editorLink,
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.tiptapEditor,
      },
    },
  });

  // Update editor content if value changes from outside (e.g. data fetching)
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className={styles.editorWrapper}>
      <MenuBar editor={editor} />
      <div className={styles.contentContainer}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
