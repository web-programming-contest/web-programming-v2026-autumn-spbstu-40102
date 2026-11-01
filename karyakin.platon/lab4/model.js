function toDateString(date) {
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }
  return String(date);
}

function getMonth(date) {
  return Number(toDateString(date).slice(5, 7));
}

export class Event {
  constructor(id, title, participants = [], date = '') {
    const data =
      typeof id === 'object' && id !== null
        ? id
        : {id, title, participants, date};
    // Допускаем и порядок (id, title, participants, date), и (id, title, date, participants).
    const swapped =
      Array.isArray(data.date) && !Array.isArray(data.participants);

    this.id = data.id;
    this.title = data.title;
    this.participants = [...(swapped ? data.date : (data.participants ?? []))];
    this.date = swapped ? data.participants : data.date;
  }

  addParticipant(name) {
    const participant = String(name).trim();
    if (!participant || this.participants.includes(participant)) {
      return false;
    }
    this.participants.push(participant);
    return true;
  }

  removeParticipant(name) {
    const index = this.participants.indexOf(String(name).trim());
    if (index === -1) {
      return false;
    }
    this.participants.splice(index, 1);
    return true;
  }

  get participantCount() {
    return this.participants.length;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      participants: [...this.participants],
      date: toDateString(this.date),
    };
  }
}

export function groupEventsByDate(events) {
  const groups = {};
  for (const event of events) {
    const key = toDateString(event.date);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(event);
  }
  return groups;
}

export function getUniqueParticipants(events) {
  return [...new Set(events.flatMap((event) => event.participants))];
}

export function groupEventsByParticipantCount(events) {
  const groups = {};
  for (const event of events) {
    const key = event.participants.length;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(event);
  }
  return groups;
}

export function findEventsByParticipant(events, name) {
  return events.filter((event) => event.participants.includes(name));
}

export function findEventsByMonth(events, month) {
  return events.filter((event) => getMonth(event.date) === Number(month));
}
