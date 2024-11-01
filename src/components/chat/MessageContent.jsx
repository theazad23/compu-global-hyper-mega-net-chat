import React, { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'lucide-react';
import { cn } from '../../lib/utils';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';

export const MessageContent = ({ content, sources, isUser }) => {
  const { theme } = useTheme();

  // Memoize parsed content to prevent unnecessary re-renders
  const parsedContent = useMemo(() => {
    // Configure marked options
    marked.setOptions({
      highlight: (code, lang) => {
        if (Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
      breaks: true,
      gfm: true
    });

    // Parse markdown and sanitize HTML
    const rawHtml = marked(content);
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'code', 'pre',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a'
      ],
      ALLOWED_ATTR: ['href', 'class', 'target']
    });

    return cleanHtml;
  }, [content]);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "prose prose-sm max-w-none",
          isUser ? "prose-invert" : "prose-neutral",
          "message-content break-words"
        )}
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />

      {sources && sources.length > 0 && (
        <div className={`mt-4 pt-4 border-t ${theme.border}`}>
          <div className={`flex items-center gap-2 ${theme.textMuted} text-sm mb-2`}>
            <Link className="h-4 w-4" />
            <span>Sources:</span>
          </div>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li
                key={index}
                className={`text-sm ${theme.textMuted} hover:${theme.textSecondary}`}
              >
                {source.title || source.url}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};