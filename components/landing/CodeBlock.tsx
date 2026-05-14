'use client';

import * as React from 'react';
import { useState } from 'react';

/* ============================================================
   <CodeBlock /> — themed code block with single-pass tokenizer
   syntax highlighting for Kotlin and bash.
   ============================================================ */

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

interface TokenRule {
  name: string;
  re: RegExp;
  accept?: (t: string) => boolean;
}

// ---------- Kotlin ----------

const KOTLIN_RULES: TokenRule[] = [
  { name: 'com',  re: /\/\/.*$/y },
  { name: 'str',  re: /"(?:[^"\\]|\\.)*"/y },
  { name: 'ann',  re: /@[A-Za-z_][A-Za-z0-9_]*/y },
  { name: 'num',  re: /\b\d+(?:\.\d+)?[fLuU]?\b/y },
  { name: 'kw',   re: /\b(?:val|var|fun|class|object|package|import|return|if|else|for|while|when|is|as|in|by|this|null|true|false|private|public|internal|protected|override|open|abstract|sealed|data|companion|suspend|inline|operator|interface|enum|annotation|typealias|const|lateinit|init|throw|try|catch|finally|out|where|do|continue|break)\b/y },
  { name: 'type', re: /\b(?:String|Int|Long|Boolean|Float|Double|Unit|Any|List|Map|Set|MutableList|MutableMap|Array|Nothing|TargetFormat|File|Path|Color|Icon|Icons|Composable|Tray|TrayApp|Item|Divider|SubMenu|CheckableItem|Notification|NotificationAction|Modifier|Clipboard|Desktop)\b/y },
  { name: 'fn',   re: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/y },
];

export function highlightKotlin(line: string): string {
  return tokenize(line, KOTLIN_RULES);
}

// ---------- Bash ----------

const BASH_CMDS = new Set([
  'curl', 'bash', 'sudo', 'cd', 'export', 'brew', 'apt', 'yum',
  'chmod', 'chown', 'mkdir', 'rm', 'mv', 'cp', 'echo', 'cat',
  'grep', 'ls', 'gradle', 'gradlew', 'npm', 'node', 'winget',
]);

const BASH_RULES: TokenRule[] = [
  { name: 'com',  re: /#.*$/y },
  { name: 'str',  re: /"(?:[^"\\]|\\.)*"/y },
  { name: 'kw',   re: /--?[a-zA-Z][a-zA-Z0-9-]*/y },
  { name: 'fn',   re: /\.?\/?[a-zA-Z][a-zA-Z0-9_./]*/y, accept: (t) => BASH_CMDS.has(t.replace(/^\.\//, '')) },
];

export function highlightBash(line: string): string {
  return tokenize(line, BASH_RULES);
}

// ---------- Generic single-pass tokenizer ----------

function tokenize(line: string, rules: TokenRule[]): string {
  let i = 0;
  let out = '';
  let plain = '';
  while (i < line.length) {
    let matched: { name: string; text: string } | null = null;
    for (const rule of rules) {
      rule.re.lastIndex = i;
      const m = rule.re.exec(line);
      if (m && m.index === i) {
        if (rule.accept && !rule.accept(m[0])) continue;
        matched = { name: rule.name, text: m[0] };
        break;
      }
    }
    if (matched) {
      if (plain) { out += escapeHtml(plain); plain = ''; }
      out += `<span class="ck-${matched.name}">${escapeHtml(matched.text)}</span>`;
      i += matched.text.length;
    } else {
      plain += line[i];
      i += 1;
    }
  }
  if (plain) out += escapeHtml(plain);
  return out;
}

// ---------- CodeBlock React component ----------

export interface CodeTab {
  filename: string;
  lang: string;
  code: string;
}

interface CodeBlockProps {
  code?: string;
  lang?: string;
  filename?: string;
  tabs?: CodeTab[];
}

export function CodeBlock({ code, lang = 'kotlin', filename, tabs }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);

  const currentCode = tabs ? tabs[activeTab].code : code ?? '';
  const currentLang = tabs ? tabs[activeTab].lang || lang : lang;
  const currentFile = tabs ? tabs[activeTab].filename : filename;

  const lines = currentCode.split('\n');

  return (
    <div className="cb-window">
      <div className="cb-titlebar">
        <div className="cb-traffic">
          <span className="cb-dot cb-r" />
          <span className="cb-dot cb-y" />
          <span className="cb-dot cb-g" />
        </div>
        {tabs ? (
          <div className="cb-tabs">
            {tabs.map((t, i) => (
              <button
                key={i}
                className={`cb-tab ${i === activeTab ? 'active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {t.filename}
              </button>
            ))}
          </div>
        ) : (
          <div className="cb-filename">{currentFile || ''}</div>
        )}
        <div className="cb-lang">{currentLang}</div>
      </div>
      <pre className="cb-pre">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="cb-line">
              <span className="cb-lineno">{i + 1}</span>
              <span
                className="cb-linecode"
                dangerouslySetInnerHTML={{
                  __html: currentLang === 'bash' ? highlightBash(line) : highlightKotlin(line),
                }}
              />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
