import React, {StrictMode, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const catalog = [
  {
    label: 'Михаил Булгаков',
    type: 'Автор',
    children: [
      {
        label: 'Азбука',
        type: 'Издательство',
        children: [
          {
            label: 'Роман',
            type: 'Жанр',
            children: ['Мастер и Маргарита', 'Белая гвардия'],
          },
          {
            label: 'Повесть',
            type: 'Жанр',
            children: ['Собачье сердце'],
          },
        ],
      },
    ],
  },
  {
    label: 'Стругацкие',
    type: 'Авторы',
    children: [
      {
        label: 'Neoclassic',
        type: 'Издательство',
        children: [
          {
            label: 'Научная фантастика',
            type: 'Жанр',
            children: ['Пикник на обочине', 'Трудно быть богом'],
          },
        ],
      },
    ],
  },
  {
    label: 'Татьяна Толстая',
    type: 'Автор',
    children: [
      {
        label: 'АСТ',
        type: 'Издательство',
        children: [
          {
            label: 'Антиутопия',
            type: 'Жанр',
            children: ['Кысь'],
          },
        ],
      },
    ],
  },
];

function branchIds(nodes, parentId = 'root') {
  return nodes.flatMap((node, index) => {
    if (typeof node === 'string') {
      return [];
    }

    const id = `${parentId}-${index}`;
    return [id, ...branchIds(node.children, id)];
  });
}

function TreeNode({node, nodeId, level, expanded, onToggle}) {
  if (typeof node === 'string') {
    return (
      <li className="book-leaf" data-testid="tree-level">
        <span className="book-mark" aria-hidden="true">
          Т
        </span>
        <span>
          <span className="node-type">Книга</span>
          <strong>{node}</strong>
        </span>
      </li>
    );
  }

  const isExpanded = expanded.has(nodeId);

  return (
    <li className={`tree-node level-${level}`} data-testid="tree-branch">
      <button
        className="tree-toggle"
        type="button"
        data-testid="tree-toggle"
        aria-expanded={isExpanded}
        onClick={() => onToggle(nodeId)}
      >
        <span className="toggle-icon" aria-hidden="true">
          {isExpanded ? '−' : '+'}
        </span>
        <span>
          <span className="node-type">{node.type}</span>
          <strong>{node.label}</strong>
        </span>
        <span className="item-count">{node.children.length}</span>
      </button>
      {isExpanded && (
        <ul className="tree-level" data-testid="tree-level">
          {node.children.map((child, index) => (
            <TreeNode
              key={`${nodeId}-${index}`}
              node={child}
              nodeId={`${nodeId}-${index}`}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function App() {
  const allBranchIds = useMemo(() => branchIds(catalog), []);
  const [expanded, setExpanded] = useState(() => new Set(allBranchIds));

  function toggleBranch(nodeId) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }

  function setAllBranches(open) {
    setExpanded(new Set(open ? allBranchIds : []));
  }

  return (
    <div className="app-shell">
      <header className="catalog-header">
        <div>
          <h1>Книжная картотека</h1>
          <p className="intro">
            Исследуйте каталог по авторам, издательствам и жанрам.
          </p>
        </div>
        <div className="catalog-summary" aria-label="Сводка каталога">
          <strong>3</strong>
          <span>автора</span>
          <strong>6</strong>
          <span>книг</span>
        </div>
      </header>
      <section className="catalog-panel" aria-labelledby="tree-title">
        <div className="panel-heading">
          <div>
            <p className="section-label">Каталог</p>
            <h2 id="tree-title">Дерево книг</h2>
          </div>
          <div className="tree-actions">
            <button type="button" onClick={() => setAllBranches(true)}>
              Раскрыть все
            </button>
            <button type="button" onClick={() => setAllBranches(false)}>
              Свернуть все
            </button>
          </div>
        </div>
        <ul className="book-tree" data-testid="tree">
          {catalog.map((node, index) => (
            <TreeNode
              key={`root-${index}`}
              node={node}
              nodeId={`root-${index}`}
              level={1}
              expanded={expanded}
              onToggle={toggleBranch}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
