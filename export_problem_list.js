(async () => {
  const links = Array.from(document.querySelectorAll('a'))
    .filter(a => a.href.includes('/problems/') && !a.href.includes('/solution'))
    .map(a => {
      const slugMatch = a.href.match(/\/problems\/([^\/?]+)/);
      const slug = slugMatch ? slugMatch[1] : '';
      return slug;
    });

  const results = [];

  for (let i = 0; i < links.length; i++) {
    const slug = links[i];
    const url = `https://leetcode.com/problems/${slug}/`;

    try {
      const res = await fetch(url);
      const text = await res.text();

      // Extract JSON from <script id="__NEXT_DATA__">
      const jsonMatch = text.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
      if (!jsonMatch) {
        console.log(`Skipped ${slug} — __NEXT_DATA__ not found`);
        continue;
      }

      const data = JSON.parse(jsonMatch[1]);
      const question = data.props.pageProps.dehydratedState.queries
        .map(q => q.state.data)
        .find(d => d && d.question) 
        ?.question;

      if (!question) {
        console.log(`Skipped ${slug} — question data not found`);
        continue;
      }

      let title = question.title;
      let difficulty = question.difficulty;
      let problemId = question.questionFrontendId;
      let topics = question.topicTags.map(t => t.name).join('|');

      console.log(`${i}: ${title} | ID: ${problemId} | Difficulty: ${difficulty} | Topics: ${topics}`);

      results.push({
        title, slug, url, difficulty, problemId, topics
      });
    } catch (err) {
      console.error(`Error fetching ${slug}:`, err);
    }
  }

  // Build CSV
  const csvContent = [
    ["Title", "Slug", "URL", "Difficulty", "Problem ID", "Topics"].join(","),
    ...results.map(r =>
      [
        `"${r.title.replace(/"/g,'""')}"`,
        `"${r.slug}"`,
        `"${r.url}"`,
        `"${r.difficulty}"`,
        `"${r.problemId}"`,
        `"${r.topics}"`
      ].join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leetcode_problems_full.csv';
  a.click();

  console.log(`📥 Downloaded leetcode_problems_full.csv (${results.length} problems)`);
})();
