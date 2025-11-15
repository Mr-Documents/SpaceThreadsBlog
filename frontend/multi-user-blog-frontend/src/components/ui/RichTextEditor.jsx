import React, { useState, useRef } from 'react';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing your post...', 
  className = '',
  minHeight = '300px' 
}) => {
  const [content, setContent] = useState(value);
  const [isPreview, setIsPreview] = useState(false);
  const editorRef = useRef(null);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const insertFormatting = (before, after = '') => {
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: '𝐁',
      title: 'Bold',
      action: () => insertFormatting('**', '**'),
    },
    {
      icon: '𝐼',
      title: 'Italic',
      action: () => insertFormatting('*', '*'),
    },
    {
      icon: '≡',
      title: 'Heading',
      action: () => insertFormatting('## '),
    },
    {
      icon: '•',
      title: 'Bullet List',
      action: () => insertFormatting('- '),
    },
    {
      icon: '1.',
      title: 'Numbered List',
      action: () => insertFormatting('1. '),
    },
    {
      icon: '🔗',
      title: 'Link',
      action: () => insertFormatting('[', '](url)'),
    },
    {
      icon: '📷',
      title: 'Image',
      action: () => insertFormatting('![alt text](', ')'),
    },
    {
      icon: '💬',
      title: 'Quote',
      action: () => insertFormatting('> '),
    },
    {
      icon: '⌨',
      title: 'Code',
      action: () => insertFormatting('`', '`'),
    },
  ];

  const renderPreview = (text) => {
    // Simple markdown-like rendering
    let html = text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-white mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-white mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>')
      
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      
      // Code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-blue-300 px-2 py-1 rounded text-sm">$1</code>')
      
      // Quotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-300 my-2">$1</blockquote>')
      
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      
      // Line breaks
      .replace(/\n/g, '<br />');

    return html;
  };

  return (
    <div className={`border border-gray-600 rounded-lg bg-gray-800 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-600">
        <div className="flex items-center space-x-2">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              title={button.title}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors duration-200"
            >
              {button.icon}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
              isPreview 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {isPreview ? '📝 Edit' : '👁 Preview'}
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-4 text-gray-100 prose prose-invert max-w-none"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
          />
        ) : (
          <textarea
            ref={editorRef}
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            className="w-full p-4 bg-transparent text-white placeholder-gray-400 border-none outline-none resize-none"
            style={{ minHeight }}
          />
        )}
      </div>

      {/* Footer with tips */}
      <div className="px-4 py-2 border-t border-gray-600 text-xs text-gray-400">
        <span>💡 Tip: Use **bold**, *italic*, ## headings, [links](url), and more markdown syntax</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
