# .plan

# .backlog
- [ ] refresh knet styles, take what's important

# .ingest
- [x] https://github.com/stackshareio/awesome-stacks#readme
- [x] https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/
- [ ] https://opensourceconnections.com/blog/2016/06/01/thoughts-on-algolia/
- [ ] query processing https://www.algolia.com/blog/engineering/inside-the-algolia-engine-part-3-query-processing/
	- > Textual relevance is a very complex domain and the Postgres's built in text search features is a simple keyword matching engine compared to Algolia engine that contains a lot of alternative matching. The mesure of textual relevance is also very different of what you have in the Postgres text search. At the end, this is not only about speed but mainly about relevance 
- [ ] https://ravilabio.info/2020/04/10/reverse-engineering-abebooks-api.html

# study / inspire
- [ ] Trove by the National Library of Australia: https://trove.nla.gov.au/
	- Trove is a new discovery experience focused on Australia and Australians. It supplements what search engines provide with reliable information from Australia's memory institutions. The system hits Open Library when public domain books turn up in searches, and displays links to Open Library.
- [ ] Koha: https://koha-community.org/
	- Koha is an open source library system for public libraries that includes catalog searches and member organizing. It uses Open Library covers, displays OL related subjects, and lendable eBooks using the Read API.
- [ ] read.gov by the Library of Congress: https://read.gov/books/
OK, this isn't exactly Open Library, but it's still awesome! The Library of Congress have modified the Internet Archive's Book Reader to sit perfectly within their Rare Books Collection site.
- [ ] https://www.bookfinder.com/
- [ ] https://books.google.com/
- [ ] goodreads
- [ ] LibraryThing
- [ ] BookBub
- [ ] Litsy
- [ ] Bookish
- [ ] WhichBook
- [ ] BookBrowse
- [ ] FantasticFiction
- [ ] Riffle
- [ ] bookhunter.com
- [ ] abebooks
	- python eg: https://github.com/ravila4/abebooks/blob/master/abebooks.py
	- https://www.abebooks.com/servlet/RecommendationsApi
	- https://www.abebooks.com/servlet/DWRestService/pricingservice
- [ ] amazon book search
- [ ] project gutenberg
- [ ] find sellers / resellers / libraries / other repositories
- [ ] Worldcat
- [ ] project gutenberg

# .stream
- Names
	- Booktopia
	- Bookist
	- Bookwise
	- BookWays
	- BookSource
	- TomeTracker
	- TomeFinder
	- BookSeek
	- BookPursuit
	- BookQuest
	- BookNaut
	- BookLook
	- BookLookout
	- BookWatcher
	- BookScout
	- Booksman
- Picks
	- BookSpotter
	- BookSeeker
	- TomeHunter
	- BookHunter
	- BookExplorer
	- Bookologist


# find APIs for prototype
- https://free-for.dev/#/
- https://github.com/sindresorhus/awesome
- https://www.vinzius.com/post/free-and-paid-api-isbn/

- [x] OpenLibrary: https://openlibrary.org/developers/api
	- OpenLibrary Covers API
	- low volume public web api
	- Links to WorldCat
	- Internet Archive Book Reader: https://archive.org/details/BookReader
		- https://openlibrary.org/dev/docs/bookreader
- amazon

learn and test apis
- [ ] openlibrary
- [ ] amazon


- [ ] OPT: React.FC is unnecessary. Doubly so now that the React 18 types no longer automatically include childrenas a prop.
	- https://www.reddit.com/r/reactjs/comments/wjq51d/is_reactfc_not_recommended_what_are_other/
	- https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/
- [ ] setup linter and prettier on save

- [ ] properly typed fetch responses? openlib types?
- [ ] implement a sidebar that helps narrow down search based on aggregation of unique fields returned for docs, see OL search results