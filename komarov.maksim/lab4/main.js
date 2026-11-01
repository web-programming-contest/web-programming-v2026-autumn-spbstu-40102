import {Student, getUniqueSubjects} from './model.js';

const storageKey = 'lab4-variant2-students';
const studentForm = document.querySelector('[data-testid="entity-form"]');
const studentList = document.querySelector('[data-testid="entity-list"]');
const message = document.querySelector('[data-testid="message"]');
const studentCount = document.querySelector('[data-testid="student-count"]');
const subjectCount = document.querySelector('[data-testid="subject-count"]');
const groupAverage = document.querySelector('[data-testid="group-average"]');

function loadStudents() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (!Array.isArray(saved)) {
      return [];
    }

    return saved
      .filter((item) => item && typeof item === 'object')
      .map((item) => new Student(item.id, item.name, item.grades || {}));
  } catch {
    return [];
  }
}

let students = loadStudents();

function saveStudents() {
  localStorage.setItem(storageKey, JSON.stringify(students));
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('message-error', isError);
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function runAsync(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      action();
      saveStudents();
      renderStudents();
      resolve();
    }, 100);
  });
}

function createGradeRow(student, subject, grade) {
  const row = createElement('li', 'grade-row');
  const details = createElement(
    'span',
    'grade-description',
    `${subject}: ${grade}`,
  );
  const removeButton = createElement(
    'button',
    'button button-small button-danger',
    'Удалить оценку',
  );
  removeButton.type = 'button';
  removeButton.setAttribute('data-testid', 'delete-grade');

  removeButton.addEventListener('click', async () => {
    removeButton.disabled = true;

    await runAsync(() => {
      delete student.grades[subject];
    });

    showMessage(`Оценка по предмету «${subject}» удалена.`);
  });

  row.append(details, removeButton);
  return row;
}

function createGradeForm(student) {
  const form = createElement('form', 'grade-form');
  form.setAttribute('data-testid', 'grade-form');

  const subjectLabel = createElement('label', 'field');
  const subjectCaption = createElement('span', '', 'Предмет');
  const subjectInput = createElement('input', '');
  subjectInput.name = 'subject';
  subjectInput.placeholder = 'Математика';
  subjectInput.maxLength = 60;
  subjectInput.required = true;
  subjectLabel.append(subjectCaption, subjectInput);

  const gradeLabel = createElement('label', 'field');
  const gradeCaption = createElement('span', '', 'Оценка');
  const gradeInput = createElement('input', '');
  gradeInput.name = 'grade';
  gradeInput.type = 'number';
  gradeInput.step = 'any';
  gradeInput.placeholder = '5';
  gradeInput.required = true;
  gradeLabel.append(gradeCaption, gradeInput);

  const addButton = createElement(
    'button',
    'button button-secondary',
    'Добавить оценку',
  );
  addButton.type = 'submit';
  addButton.setAttribute('data-testid', 'add-grade');

  form.append(subjectLabel, gradeLabel, addButton);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const subject = subjectInput.value.trim();
    const grade = Number(gradeInput.value);

    if (!subject || !Number.isFinite(grade)) {
      showMessage('Введите предмет и числовую оценку.', true);
      return;
    }

    addButton.disabled = true;

    await runAsync(() => {
      student.addGrade(subject, grade);
    });

    showMessage(`Оценка по предмету «${subject}» сохранена.`);
  });

  return form;
}

function createStudentCard(student) {
  const card = createElement('article', 'student-card');
  card.setAttribute('data-testid', 'entity-card');
  card.dataset.id = String(student.id);

  const top = createElement('div', 'card-top');
  const identity = createElement('div', 'student-identity');
  identity.append(
    createElement('span', 'student-id', `ID: ${student.id}`),
    createElement('h3', 'student-name', student.name),
  );

  const removeButton = createElement(
    'button',
    'button button-small button-danger',
    'Удалить студента',
  );
  removeButton.type = 'button';
  removeButton.setAttribute('data-testid', 'delete-entity');

  removeButton.addEventListener('click', async () => {
    removeButton.disabled = true;

    await runAsync(() => {
      students = students.filter((item) => item.id !== student.id);
    });

    showMessage(`Студент ${student.name} удалён.`);
  });

  top.append(identity, removeButton);

  const average = createElement(
    'p',
    'average',
    `Средний балл: ${Object.keys(student.grades).length === 0 ? '—' : student.getAverageGrade().toFixed(2)}`,
  );
  average.setAttribute('data-testid', 'average-grade');

  const gradesTitle = createElement('h4', 'grades-title', 'Предметы и оценки');
  const gradesList = createElement('ul', 'grades-list');
  gradesList.setAttribute('data-testid', 'grades-list');

  for (const [subject, grade] of Object.entries(student.grades)) {
    gradesList.append(createGradeRow(student, subject, grade));
  }

  if (gradesList.children.length === 0) {
    gradesList.append(createElement('li', 'grades-empty', 'Оценок пока нет'));
  }

  card.append(top, average, gradesTitle, gradesList, createGradeForm(student));
  return card;
}

function renderStudents() {
  studentList.replaceChildren();
  studentCount.textContent = String(students.length);
  subjectCount.textContent = String(getUniqueSubjects(students).length);

  let total = 0;
  let withGrades = 0;

  for (const student of students) {
    studentList.append(createStudentCard(student));

    if (Object.keys(student.grades).length > 0) {
      total += student.getAverageGrade();
      withGrades++;
    }
  }

  groupAverage.textContent =
    withGrades === 0 ? '—' : (total / withGrades).toFixed(2);

  if (students.length === 0) {
    studentList.append(
      createElement(
        'p',
        'empty-state',
        'Студентов пока нет. Добавьте первого с помощью формы выше.',
      ),
    );
  }
}

studentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = new FormData(studentForm);
  const id = Number(data.get('id'));
  const name = String(data.get('name') || '').trim();

  if (!Number.isFinite(id) || !name) {
    showMessage('Введите числовой ID и имя.', true);
    return;
  }

  if (students.some((student) => student.id === id)) {
    showMessage('Студент с таким ID уже существует.', true);
    return;
  }

  const submitButton = studentForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  await runAsync(() => {
    students.push(new Student(id, name));
  });

  studentForm.reset();
  submitButton.disabled = false;
  showMessage(`Студент ${name} добавлен.`);
});

renderStudents();
