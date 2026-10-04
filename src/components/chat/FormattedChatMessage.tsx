import React from 'react';

interface FormattedChatMessageProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

/**
 * Parses markdown text (bold, bullet lists, numbered lists, headings, line breaks)
 * and renders clean, readable JSX without unformatted asterisk symbols.
 */
export function FormattedChatMessage({ content, isUser = false, className = '' }: FormattedChatMessageProps) {
  if (!content) return null;

  // Clean any hanging trailing markers if any
  const sanitizedContent = content.trim();

  // If user message, just display clean with line breaks preserved
  if (isUser) {
    return (
      <div className={`whitespace-pre-wrap leading-relaxed ${className}`}>
        {sanitizedContent}
      </div>
    );
  }

  // Helper to format inline bold, italics, etc.
  const formatInline = (text: string): React.ReactNode[] => {
    // Regex matches:
    // 1. **bold** or __bold__
    // 2. *italic* or _italic_
    // 3. `code`
    const regex = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Bold **text** or __text__
      if ((part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
          (part.startsWith('__') && part.endsWith('__') && part.length >= 4)) {
        const inner = part.slice(2, -2);
        return <strong key={index} className="font-semibold text-gray-900 dark:text-white">{inner}</strong>;
      }

      // Inline code `text`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        const inner = part.slice(1, -1);
        return (
          <code key={index} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs font-mono text-primary-700 dark:text-primary-300">
            {inner}
          </code>
        );
      }

      // Italic *text* or _text_ (only if not a lone asterisk)
      if ((part.startsWith('*') && part.endsWith('*') && part.length >= 3) ||
          (part.startsWith('_') && part.endsWith('_') && part.length >= 3)) {
        const inner = part.slice(1, -1);
        return <em key={index} className="italic text-gray-800 dark:text-gray-200">{inner}</em>;
      }

      // Remove any leftover stray asterisks at the edge of words
      const cleanedPart = part.replace(/(^\*|\*$)/g, '');
      return <span key={index}>{cleanedPart}</span>;
    });
  };

  // Split content into blocks by double newlines or single newlines
  const lines = sanitizedContent.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let isNumberedList = false;
  let blockKey = 0;

  const flushList = () => {
    if (currentListItems.length > 0) {
      if (isNumberedList) {
        renderedElements.push(
          <ol key={`ol-${blockKey++}`} className="list-decimal pl-5 my-2 space-y-1.5 leading-relaxed text-gray-800 dark:text-gray-200">
            {currentListItems}
          </ol>
        );
      } else {
        renderedElements.push(
          <ul key={`ul-${blockKey++}`} className="list-disc pl-5 my-2 space-y-1.5 leading-relaxed text-gray-800 dark:text-gray-200">
            {currentListItems}
          </ul>
        );
      }
      currentListItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Blank line
    if (!trimmed) {
      flushList();
      continue;
    }

    // Horizontal divider
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushList();
      renderedElements.push(<hr key={`hr-${blockKey++}`} className="my-3 border-gray-200 dark:border-gray-700" />);
      continue;
    }

    // Headings (###, ##, #)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      
      if (level <= 2) {
        renderedElements.push(
          <h3 key={`h-${blockKey++}`} className="text-base font-bold text-gray-900 dark:text-white mt-3 mb-1.5">
            {formatInline(headingText)}
          </h3>
        );
      } else {
        renderedElements.push(
          <h4 key={`h-${blockKey++}`} className="text-sm font-bold text-primary-700 dark:text-primary-400 mt-2.5 mb-1">
            {formatInline(headingText)}
          </h4>
        );
      }
      continue;
    }

    // Bullet points: *, -, +, or Unicode bullets •
    const bulletMatch = trimmed.match(/^([*\-+•])\s+(.+)$/);
    if (bulletMatch) {
      if (isNumberedList) flushList();
      isNumberedList = false;
      const itemContent = bulletMatch[2];
      currentListItems.push(
        <li key={`li-${blockKey++}`} className="pl-1">
          {formatInline(itemContent)}
        </li>
      );
      continue;
    }

    // Numbered list: 1., 2., 1), etc.
    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (numberedMatch) {
      if (!isNumberedList) flushList();
      isNumberedList = true;
      const itemContent = numberedMatch[2];
      currentListItems.push(
        <li key={`li-${blockKey++}`} className="pl-1">
          {formatInline(itemContent)}
        </li>
      );
      continue;
    }

    // Regular paragraph / text line
    flushList();
    renderedElements.push(
      <p key={`p-${blockKey++}`} className="my-1.5 leading-relaxed text-gray-800 dark:text-gray-200">
        {formatInline(trimmed)}
      </p>
    );
  }

  flushList();

  return (
    <div className={`space-y-1 text-sm leading-relaxed ${className}`}>
      {renderedElements}
    </div>
  );
}
