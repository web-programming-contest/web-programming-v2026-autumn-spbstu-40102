export class Student {
  constructor(id, name, grades = {}) {
    this.id = id;
    this.name = name;
    this.grades = {...grades};
  }

  addGrade(subject, grade) {
    this.grades[subject] = grade;
  }

  getAverageGrade() {
    const grades = Object.values(this.grades);

    if (grades.length === 0) {
      return 0;
    }

    let sum = 0;

    for (const grade of grades) {
      sum += grade;
    }

    return sum / grades.length;
  }

  get summary() {
    return `Студент ${this.name} (id: ${this.id}) — средний балл: ${this.getAverageGrade().toFixed(2)}`;
  }
}

export function groupStudentsByAverageGrade(students) {
  const groups = new Map();

  for (const student of students) {
    const average = student.getAverageGrade();

    if (!groups.has(average)) {
      groups.set(average, []);
    }

    groups.get(average).push(student);
  }

  return groups;
}

export function getUniqueSubjects(students) {
  const subjects = new Set();

  for (const student of students) {
    for (const subject of Object.keys(student.grades)) {
      subjects.add(subject);
    }
  }

  return [...subjects];
}

export function groupStudentsBySubject(students) {
  const groups = new Map();

  for (const student of students) {
    for (const subject of Object.keys(student.grades)) {
      if (!groups.has(subject)) {
        groups.set(subject, []);
      }

      groups.get(subject).push(student);
    }
  }

  return groups;
}

export function getStudentsWithMaxAverage(students) {
  if (students.length === 0) {
    return [];
  }

  let maxAverage = -Infinity;

  for (const student of students) {
    const average = student.getAverageGrade();

    if (average > maxAverage) {
      maxAverage = average;
    }
  }

  return students.filter((student) => student.getAverageGrade() === maxAverage);
}

export function getStudentsWhoPassedSubject(students, subject) {
  return students.filter(
    (student) =>
      Object.hasOwn(student.grades, subject) && student.grades[subject] >= 3,
  );
}

export {Student as student};
export {groupStudentsByAverageGrade as groupStudentsByAverage};
export {groupStudentsBySubject as groupStudentsBySubjects};
export {getStudentsWithMaxAverage as getTopStudents};
export {getStudentsWithMaxAverage as getStudentsWithHighestAverage};
export {getStudentsWhoPassedSubject as getStudentsBySubject};
export {getStudentsWhoPassedSubject as findStudentsBySubject};
