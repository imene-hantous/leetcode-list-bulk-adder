const slugs = ["two-sum", "add-two-numbers", /* ... */];
const ids = [];

for (const slug of slugs) {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: `
        query question($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
          }
        }
      `,
      variables: { titleSlug: slug }
    })
  });
  const data = await res.json();
  const id = data.data?.question?.questionId;
  console.log(slug, "→", id);
  ids.push(id);
}
console.log("IDs:", ids);
