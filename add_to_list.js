// 1. Configure these
// List name from your list URL
// E.g. "vtw7y5fj" from my list https://leetcode.com/problem-list/vtw7y5fj/
const favoriteIdHash = "your_list_name";
const csrf = document.cookie.match(/csrftoken=([^;]+)/)[1];

// 2. Add all your LeetCode question IDs (as strings)
const questionIds = [
  "1", // two-sum
  "2", // add-two-numbers
];

// 3. Define the mutation
const addQuestion = async (id) => {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-csrftoken": csrf
    },
    body: JSON.stringify({
      query: `
        mutation add($questionId: String!, $favoriteIdHash: String!) {
          addQuestionToFavorite(questionId: $questionId, favoriteIdHash: $favoriteIdHash) {
            ok
            error
          }
        }
      `,
      variables: { questionId: id, favoriteIdHash }
    })
  });
  const data = await res.json();
  console.log("Added:", id, data);
};

// 4. Run for all problems with short delay to avoid rate limits
(async () => {
  for (const id of questionIds) {
    await addQuestion(id);
    await new Promise(r => setTimeout(r, 400)); // 0.4s between requests
  }
})();
