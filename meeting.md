### Sprint 6:

Kylen - Sign-in/sign-out, upstream partner contact, NextAuth configured, Session access token verification, consumer client credentials

Evin - movie/show detail page

Carson - popular page

Geo - Search page

### Sprint 7:

Kylen - edit reviews/ratings in profile tab, merged everything, edited styling

Evin - navigation bar, reviews

Carson - profile, browse

Geo - ratings

Sprint 8:

Kylen - Clean up UI design, double checks, merged everything

Evin - 

Carson - featured page that shows top ratings, most reviewed movies/tv shows, scrolling movie/tv images to homepage

Geo - trending slide and clickable images

### Issues Queue Triage

| Issue | Status | Resolution |
|-------|--------|------------|
| Deleting a rating also deletes a review | Fixed | Changed the Prisma schema `Review.rating` relation from `onDelete: Cascade` to `onDelete: SetNull`, so deleting a rating now nulls the linked review's `ratingId` instead of deleting the review. |
| Feature Request: Search by cast member | Fixed | Added `GET /v1/people/search` route backed by a new people service that queries TMDB's person search endpoint and returns all media the cast member appears in. |
| Cannot find enriched routes | Fixed | Updated `GET /v1/movies/:id` and `GET /v1/tv/:id` to include a `community` object in the response with average star rating, total review count, and up to 3 inline reviews. |

### End Of Quarter Retrospective

What went well across the ten weeks:

What went well for us is we were able to learn a lot of knew technologies and their purposes throughout the quarter and we were able to actually put into practice these technologies. Additionally, we were actually able to build a full-stack project that is production-grade and we can actually put on our resumes. I think what went most well though is working as a team each week to hash out and delegate work, figuring out what is working well and what isn't, and also getting production grade code ready as quickly as possible.

What you'd do differently if you were starting the quarter again:

What we'd do differently if we started the quarter again is we would iterate quicker and get work out quicker while also being able to put into practice the technologies. A lot of the "issues" that we had were really just us having problems with having multiple working parts but in reality certain sections depending on others, so timelines of work got a little crunched because we weren't on a good timeline to get part A done when we needed part A to do part B. 

Another thing that we'd do differently overall is we'd probably include more routes than we did before and would spend more time doing than reading/thinking about how to do it. For us, just getting the thing done and learning how it's done was a lot more rewarding when I was just sitting down and trying to create it rather than sitting and reading a lot of material conceptionally. Practice make progress, so getting more practice early would've helped a lot.

What surprised you about working on someone else's API and having someone else work on yours.

What really surprised me when working on someone else's API is we would need to read a lot more documentation and actually understand how the routes worked before we actually got to working on it, which helped us out a lot. That's something I think is a skill people need to learn even with AI is just being able to read documentation, we still need people to understand how to read what we write so on a higher level we can use it to prompt AI even better.

What you learned about working with AI coding agents that you didn't know in Week 1:

AI coding agents are very useful but also in a way are very detrimental to your learning sometimes along with productivity. Sure, you can push out a lot of code really quickly, but if you don't take the time to actually understand your intentions, why you're doing something, why you made the architectural decisions that you made, then you'll never be able to make real productions grade systems and I think that is an important skill. Now, it is also really good for writing code, but I also needed to direct how it wrote code in a lot of ways as well. Overall though, it was a good learning experience.
