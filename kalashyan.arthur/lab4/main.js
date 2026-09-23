import {Team} from './model.js';

const storageKey = 'kalashyan-arthur-lab4-teams';
const operationDelay = 180;
const teamForm = document.querySelector('[data-testid="entity-form"]');
const teamList = document.querySelector('[data-testid="entity-list"]');
const status = document.querySelector('.status');

const initialTeams = [
  new Team('Interface Lab', [
    {name: 'Анна', role: 'Designer'},
    {name: 'Максим', role: 'Frontend'},
  ]),
  new Team('Platform Crew', [
    {name: 'Ирина', role: 'Backend'},
    {name: 'Денис', role: 'QA'},
  ]),
];

let teams = restoreTeams();

function restoreTeams() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));

    if (Array.isArray(stored)) {
      return stored.map((team) => new Team(team.name, team.members));
    }
  } catch {
    return initialTeams;
  }

  return initialTeams;
}

function saveTeams() {
  localStorage.setItem(storageKey, JSON.stringify(teams));
}

function waitForOperation() {
  return new Promise((resolve) => {
    setTimeout(resolve, operationDelay);
  });
}

async function updateTeams(change, message) {
  await waitForOperation();
  change();
  saveTeams();
  renderTeams();
  status.textContent = message;
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function createMemberItem(team, member) {
  const item = createElement('li', 'member-item');
  const info = createElement('div', 'member-info');
  info.append(
    createElement('strong', 'member-name', member.name),
    createElement('span', 'member-role', member.role),
  );

  const removeButton = createElement('button', 'icon-button', 'Удалить');
  removeButton.type = 'button';
  removeButton.setAttribute('aria-label', `Удалить ${member.name}`);
  removeButton.addEventListener('click', async () => {
    removeButton.disabled = true;
    await updateTeams(() => team.removeMember(member.name), 'Участник удалён');
  });

  item.append(info, removeButton);
  return item;
}

function createMemberForm(team) {
  const form = createElement('form', 'member-form');
  const nameLabel = createElement('label', 'field');
  const roleLabel = createElement('label', 'field');
  const nameTitle = createElement('span', 'field-label', 'Имя');
  const roleTitle = createElement('span', 'field-label', 'Роль');
  const nameInput = document.createElement('input');
  const roleInput = document.createElement('input');
  const submitButton = createElement(
    'button',
    'secondary-button',
    'Добавить участника',
  );

  nameInput.name = 'memberName';
  nameInput.placeholder = 'Имя';
  nameInput.autocomplete = 'off';
  nameInput.required = true;
  roleInput.name = 'role';
  roleInput.placeholder = 'Роль';
  roleInput.autocomplete = 'off';
  roleInput.required = true;
  submitButton.type = 'submit';
  nameLabel.append(nameTitle, nameInput);
  roleLabel.append(roleTitle, roleInput);
  form.append(nameLabel, roleLabel, submitButton);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('memberName')).trim();
    const role = String(formData.get('role')).trim();

    if (!name || !role) {
      return;
    }

    submitButton.disabled = true;
    await updateTeams(
      () => team.addMember({name, role}),
      `Участник ${name} добавлен`,
    );
  });

  return form;
}

function createTeamCard(team) {
  const card = createElement('article', 'team-card');
  const heading = createElement('div', 'card-heading');
  const titleBlock = document.createElement('div');
  const title = createElement('h3', '', team.name);
  const count = createElement(
    'p',
    'member-count',
    `${team.memberCount} ${formatMemberCount(team.memberCount)}`,
  );
  const deleteButton = createElement(
    'button',
    'delete-button',
    'Удалить команду',
  );
  const members = createElement('ul', 'member-list');

  card.dataset.testid = 'entity-card';
  deleteButton.type = 'button';
  deleteButton.dataset.testid = 'delete-entity';
  titleBlock.append(title, count);
  heading.append(titleBlock, deleteButton);

  if (team.members.length === 0) {
    members.append(
      createElement('li', 'empty-members', 'В команде пока нет участников'),
    );
  } else {
    members.append(
      ...team.members.map((member) => createMemberItem(team, member)),
    );
  }

  deleteButton.addEventListener('click', async () => {
    deleteButton.disabled = true;
    await updateTeams(() => {
      teams = teams.filter((currentTeam) => currentTeam !== team);
    }, `Команда ${team.name} удалена`);
  });

  card.append(heading, members, createMemberForm(team));
  return card;
}

function formatMemberCount(count) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'участников';
  }
  if (lastDigit === 1) {
    return 'участник';
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'участника';
  }
  return 'участников';
}

function renderTeams() {
  teamList.replaceChildren();

  if (teams.length === 0) {
    teamList.append(
      createElement(
        'p',
        'empty-state',
        'Создайте первую команду, чтобы начать работу.',
      ),
    );
    return;
  }

  teamList.append(...teams.map(createTeamCard));
}

teamForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(teamForm);
  const name = String(formData.get('name')).trim();
  const submitButton = teamForm.querySelector('button[type="submit"]');

  if (!name) {
    return;
  }

  submitButton.disabled = true;
  await updateTeams(
    () => teams.push(new Team(name)),
    `Команда ${name} добавлена`,
  );
  teamForm.reset();
});

renderTeams();
