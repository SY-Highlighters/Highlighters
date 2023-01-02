class Feed {
  id: string;
  title: string;
  description: string;
  highlight: [];
  Date: string;

  constructor(feed: any) {
    this.id = feed.id;
    this.title = feed.title;
    this.description = feed.description;
    this.highlight = feed.highlight;
    this.Date = feed.Date;
  }
}
export default Feed;
