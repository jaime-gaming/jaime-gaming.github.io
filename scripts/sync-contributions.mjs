import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";

const query = `query {
  user(login: "jaime-gaming") {
    contributionsCollection {
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } }
      commitContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner url isPrivate owner { login } }
        contributions(first: 100) { nodes { occurredAt commitCount } pageInfo { hasNextPage } }
      }
      issueContributions(first: 100) {
        nodes { occurredAt issue { title url number repository { nameWithOwner isPrivate owner { login } } } }
        pageInfo { hasNextPage }
      }
      pullRequestContributions(first: 100) {
        nodes { occurredAt pullRequest { title url number repository { nameWithOwner isPrivate owner { login } } } }
        pageInfo { hasNextPage }
      }
    }
  }
}`;

const { stdout } = await promisify(execFile)("gh", ["api", "graphql", "-f", `query=${query}`], { maxBuffer: 5 * 1024 * 1024 });
const response = JSON.parse(stdout);
if (response.errors || !response.data?.user?.contributionsCollection) throw new Error("GitHub did not return contribution data");
const source = response.data.user.contributionsCollection;
const calendar = source.contributionCalendar;
const levels = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
const details = {};
const isPublicPersonal = (repo) => repo && !repo.isPrivate && repo.owner.login.toLowerCase() === "jaime-gaming";

for (const entry of source.commitContributionsByRepository) {
  const repo = entry.repository;
  if (!isPublicPersonal(repo)) continue;
  for (const contribution of entry.contributions.nodes) {
    const day = contribution.occurredAt.slice(0, 10);
    (details[day] ||= []).push({ type: "commits", count: contribution.commitCount, repo: repo.nameWithOwner, url: `${repo.url}/commits?since=${day}T00%3A00%3A00Z&until=${day}T23%3A59%3A59Z` });
  }
}
for (const [field, key, type] of [["issueContributions", "issue", "issue"], ["pullRequestContributions", "pullRequest", "pull"]]) {
  for (const contribution of source[field].nodes) {
    const item = contribution[key];
    if (!isPublicPersonal(item.repository)) continue;
    (details[contribution.occurredAt.slice(0, 10)] ||= []).push({ type, repo: item.repository.nameWithOwner, title: item.title, number: item.number, url: item.url });
  }
}
const detailIncomplete = source.commitContributionsByRepository.length === 100
  || source.commitContributionsByRepository.some((entry) => isPublicPersonal(entry.repository) && entry.contributions.pageInfo.hasNextPage)
  || source.issueContributions.pageInfo.hasNextPage || source.pullRequestContributions.pageInfo.hasNextPage;
const record = {
  timestamp: Date.now(), source: "GitHub GraphQL API", detailIncomplete,
  data: {
    contributions: calendar.weeks.flatMap((week) => week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount, level: levels[day.contributionLevel] ?? 0 }))),
    total: { lastYear: calendar.totalContributions },
  },
  details,
};
await writeFile(new URL("../assets/data/contributions.json", import.meta.url), JSON.stringify(record, null, 2) + "\n");
console.log(`Saved ${record.data.contributions.length} days and ${Object.keys(details).length} daily summaries from GitHub.`);
