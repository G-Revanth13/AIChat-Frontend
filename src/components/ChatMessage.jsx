const bulletPatterns = [
  /^\s*[-*]\s+/, // - item / * item
  /^\s*\d+\.[\s]+/, // 1. item
  /^\s*•\s+/, // • item
];

const isBulletLine = (line) => bulletPatterns.some((re) => re.test(line));

const normalizeBulletItem = (line) => {
  // Remove common bullet prefixes (-, *, •, 1.)
  let out = line
    .replace(/^\s*[-*]\s+/, '')
    .replace(/^\s*\d+\.[\s]+/, '')
    .replace(/^\s*•\s+/, '')
    .trim();

  // Also remove leading markdown-like list markers that may appear after normalization
  // e.g. "- * item" or "- # item"
  out = out.replace(/^[*#]\s+/, '').trim();

  return out;
};


const parseToBlocks = (text) => {
  const raw = text == null ? '' : String(text);
  const lines = raw.split(/\r?\n/);

  const blocks = [];
  let currentList = null; // { type: 'ul'|'ol', items: [] }

  const flushList = () => {
    if (currentList && currentList.items.length) {
      blocks.push(currentList);
    }
    currentList = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Blank line breaks paragraphs/lists
    if (!trimmed) {
      flushList();
      continue;
    }

    if (isBulletLine(trimmed)) {
      // Decide ordered vs unordered by pattern (\d+.)
      const isOrdered = /^\s*\d+\.[\s]+/.test(trimmed);
      if (!currentList) {
        currentList = { type: isOrdered ? 'ol' : 'ul', items: [] };
      } else if (currentList.type !== (isOrdered ? 'ol' : 'ul')) {
        // Different list type -> flush and start new
        flushList();
        currentList = { type: isOrdered ? 'ol' : 'ul', items: [] };
      }

      currentList.items.push(normalizeBulletItem(trimmed));
      continue;
    }

    // Non-bullet line => paragraph
    flushList();
    blocks.push({ type: 'p', text: trimmed });
  }

  flushList();
  return blocks;
};

const ChatMessage = ({ message }) => {
  const isUser = message.isUser || message.role === 'user';
  const text = message.text || message.content;

  const blocks = parseToBlocks(text);

  return (
    <div className={`message ${isUser ? 'user' : 'ai'}`}>
      <div className="message-bubble">
        {blocks.length === 1 && blocks[0].type === 'p' ? (
          text
        ) : (
          blocks.map((b, idx) => {
            if (b.type === 'ul') {
              return (
                <ul key={idx} style={{ margin: '0 0 0.75rem 1.1rem', padding: 0 }}>
                  {b.items.map((it, i) => (
                    <li key={i} style={{ margin: '0.25rem 0' }}>
                      {it}
                    </li>
                  ))}
                </ul>
              );
            }
            if (b.type === 'ol') {
              return (
                <ol key={idx} style={{ margin: '0 0 0.75rem 1.1rem', padding: 0 }}>
                  {b.items.map((it, i) => (
                    <li key={i} style={{ margin: '0.25rem 0' }}>
                      {it}
                    </li>
                  ))}
                </ol>
              );
            }
            // paragraph
            return (
              <p key={idx} style={{ margin: '0 0 0.75rem 0', whiteSpace: 'pre-wrap' }}>
                {b.text}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatMessage;


