const sampleNames = ['Alice Johnson', 'Bob Williams', 'Charlie Brown', 'Diana Miller', 'Evan Davis'];
const sampleEmails = ['alice@example.com', 'bob@test.dev', 'charlie@web.io', 'diana@corp.org', 'evan@site.net'];
const roles  = ['Admin', 'Editor', 'Viewer'];
const statuses = ['Active', 'Inactive', 'Pending'];

export const generateMockUsers = (count: number) => {
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      uid: 1000 + i,
      name: sampleNames[i % sampleNames.length] + ` ${Math.floor(i / 5)}`,
      email: `${sampleEmails[i % sampleEmails.length].split('@')[0]}${i}@${sampleEmails[i % sampleEmails.length].split('@')[1]}`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      lastLogin: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
      projects: Math.floor(Math.random() * 10),
    });
  }
  return users;
};