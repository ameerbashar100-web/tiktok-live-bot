// Simple To‑Do with localStorage
(() => {
  const STORAGE_KEY = 'todos_v1';
  const todoForm = document.getElementById('todoForm');
  const todoInput = document.getElementById('todoInput');
  const todoList = document.getElementById('todoList');
  const countEl = document.getElementById('count');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const toggleAllBtn = document.getElementById('toggleAllBtn');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importFile');

  let todos = [];
  let filter = 'all'; // all | active | completed

  // Load from localStorage
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      todos = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to parse todos from storage', e);
      todos = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  // Utility: create id
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  }

  // Render
  function render() {
    todoList.innerHTML = '';
    const list = todos.filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    });

    list.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.completed ? ' completed' : '');
      li.dataset.id = todo.id;

      // checkbox
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'todo-checkbox';
      cb.checked = !!todo.completed;
      cb.setAttribute('aria-label', 'Mark task complete');
      cb.addEventListener('change', () => toggleComplete(todo.id));
      li.appendChild(cb);

      // text (editable)
      const span = document.createElement('div');
      span.className = 'todo-text';
      span.tabIndex = 0;
      span.textContent = todo.text;
      // double click or Enter to edit
      span.addEventListener('dblclick', () => startEdit(todo.id, span));
      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startEdit(todo.id, span);
      });
      li.appendChild(span);

      // actions
      const actions = document.createElement('div');
      actions.className = 'todo-actions';

      // edit button
      const editBtn = document.createElement('button');
      editBtn.title = 'Edit';
      editBtn.innerHTML = '✎';
      editBtn.addEventListener('click', () => startEdit(todo.id, span));
      actions.appendChild(editBtn);

      // delete button
      const delBtn = document.createElement('button');
      delBtn.title = 'Delete';
      delBtn.innerHTML = '🗑';
      delBtn.addEventListener('click', () => removeTodo(todo.id));
      actions.appendChild(delBtn);

      li.appendChild(actions);
      todoList.appendChild(li);
    });

    countEl.textContent = todos.length;
  }

  // Add
  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    todos.unshift({ id: uid(), text: trimmed, completed: false, created: Date.now() });
    save(); render();
  }

  // Remove
  function removeTodo(id) {
    todos = todos.filter(t => t.id !== id);
    save(); render();
  }

  // Toggle complete
  function toggleComplete(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    save(); render();
  }

  // Start inline edit
  function startEdit(id, spanEl) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    // create input
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.className = 'edit-input';
    input.style.width = '100%';
    spanEl.replaceWith(input);
    input.focus();
    input.select();

    function finish() {
      const val = input.value.trim();
      if (!val) {
        // delete if empty
        removeTodo(id);
      } else {
        todos = todos.map(t => t.id === id ? { ...t, text: val } : t);
        save();
      }
      render();
    }

    input.addEventListener('blur', finish);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') finish();
      if (e.key === 'Escape') render();
    });
  }

  // Toggle all
  function toggleAll() {
    const allCompleted = todos.length && todos.every(t => t.completed);
    todos = todos.map(t => ({ ...t, completed: !allCompleted }));
    save(); render();
  }

  // Clear completed
  function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    save(); render();
  }

  // Export JSON
  function exportJSON() {
    const data = JSON.stringify(todos, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Import JSON file input
  function importJSONFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) throw new Error('Invalid file');
        // merge safely: map to our shape if necessary
        const imported = parsed.map(t => ({
          id: t.id || uid(),
          text: t.text || '',
          completed: !!t.completed,
          created: t.created || Date.now()
        })).filter(t => t.text && typeof t.text === 'string');
        // simple merge: append imported items
        todos = [...imported, ...todos];
        save(); render();
        alert('Import successful (' + imported.length + ' items).');
      } catch (e) {
        alert('Import failed: ' + e.message);
      }
    };
    reader.readAsText(file);
  }

  // Handlers / events
  todoForm.addEventListener('submit', e => {
    e.preventDefault();
    addTodo(todoInput.value);
    todoInput.value = '';
    todoInput.focus();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      filter = btn.dataset.filter;
      render();
    });
  });

  toggleAllBtn.addEventListener('click', toggleAll);
  clearCompletedBtn.addEventListener('click', () => {
    if (confirm('Clear all completed tasks?')) clearCompleted();
  });

  exportBtn.addEventListener('click', exportJSON);
  importBtn.addEventListener('click', () => {
    if (importFile.files && importFile.files.length) {
      importJSONFile(importFile.files[0]);
      importFile.value = '';
    } else {
      alert('Select a JSON file to import first');
    }
  });

  // init
  load();
  render();

  // expose for debugging (optional)
  window._todos = todos;
})();
