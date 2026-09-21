export class Team {
  constructor(name, members = []) {
    this.name = name;
    this.members = members.map((member) => ({...member}));
  }

  addMember(member) {
    this.members.push({...member});
  }

  removeMember(name) {
    this.members = this.members.filter((member) => member.name !== name);
  }

  get memberCount() {
    return this.members.length;
  }
}

export function groupMembersByRole(teams) {
  const groups = new Map();

  for (const team of teams) {
    for (const member of team.members) {
      const members = groups.get(member.role) ?? [];
      groups.set(member.role, [...members, member]);
    }
  }

  return groups;
}

export function getUniqueRoles(teams) {
  return [
    ...new Set(
      teams.flatMap((team) => team.members.map((member) => member.role)),
    ),
  ];
}

export function groupTeamsByMemberCount(teams) {
  const groups = new Map();

  for (const team of teams) {
    const groupedTeams = groups.get(team.memberCount) ?? [];
    groups.set(team.memberCount, [...groupedTeams, team]);
  }

  return groups;
}

export function findTeamsByMember(teams, name) {
  return teams.filter((team) =>
    team.members.some((member) => member.name === name),
  );
}

export function getUniqueMembers(teams) {
  const members = new Map();

  for (const team of teams) {
    for (const member of team.members) {
      const key = `${member.name}\u0000${member.role}`;
      if (!members.has(key)) {
        members.set(key, {...member});
      }
    }
  }

  return [...members.values()];
}
