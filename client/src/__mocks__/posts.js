const posts = [
  {
    type: "post",
    // title of a post
    title: "Feeling swole",
    // id of the post
    id: "http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
    // where did you get this post from?
    source: "http://lastplaceigotthisfrom.com/posts/yyyyy",
    // where is it actually from
    origin: "http://whereitcamefrom.com/posts/zzzzz",
    // a brief description of the post
    description: "Benched a PR today",
    //The content type of the post
    //assume either
    // text/markdown -- common mark
    // text/plain -- UTF-8
    // application/base64
    // image/png;base64 this is an embedded png -- images are POSTS. So you might have a user make 2 posts if a post includes an image!
    // image/jpeg;base64 this is an embedded jpeg
    // for HTML you will want to strip tags before displaying
    contentType: "image/png;base64",
    content: "/static/images/cards/chad.jpg",
    // the author has an ID where by authors can be disambiguated
    author: {
      type: "author",
      // ID of the Author
      id: "http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
      // # the home host of the author
      host: "http://127.0.0.1:5454/",
      // the display name of the author
      displayName: "Chad",
      // url to the authors profile
      url: "http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
      // HATEOS url for Github API
      github: "http://github.com/chad",
      profileImage: "/static/images/avatars/chad.jpg",
    },
    // categories this post fits into (a list of strings
    categories: ["web", "tutorial"],
    // comments about the post
    // return a maximum number of comments
    // total number of comments for this post
    count: 45,
    // page size
    size: 50,
    // the first page of comments
    // comments: "http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
    // You should return ~ 5 comments per post.
    // should be sorted newest(first) to oldest(last)
    comments: [
      {
        type: "comment",
        author: {
          type: "author",
          // ID of the Author (UUID)
          id: "http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
          // url to the authors information
          url: "http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
          host: "http://127.0.0.1:5454/",
          displayName: "Rebecca Smiles",
          // HATEOS url for Github API
          github: "http://github.com/rebbecas",
          profileImage: "/static/images/avatars/rebecca.jpg",
        },
        comment: "Sick Olde English",
        contentType: "text/plain",
        // ISO 8601 TIMESTAMP
        published: "2015-03-09T13:07:04+00:00",
        // ID of the Comment (UUID)
        id: "http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
      },
    ],
    // ISO 8601 TIMESTAMP
    published: "2015-03-09T13:07:04+00:00",
    // visibility ["PUBLIC","FRIENDS"]
    visibility: "PUBLIC",
    // for visibility PUBLIC means it is open to the wild web
    // FRIENDS means if we're direct friends I can see the post
    // FRIENDS should've already been sent the post so they don't need this
    unlisted: false,
    // unlisted means it is public if you know the post name -- use this for images, it's so images don't show up in timelines
  },
  {
    type: "post",
    // title of a post
    title: "This is a title",
    // id of the post
    id: "http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
    // where did you get this post from?
    source: "http://lastplaceigotthisfrom.com/posts/yyyyy",
    // where is it actually from
    origin: "http://whereitcamefrom.com/posts/zzzzz",
    // a brief description of the post
    description: "This is a description",
    //The content type of the post
    //assume either
    // text/markdown -- common mark
    // text/plain -- UTF-8
    // application/base64
    // image/png;base64 this is an embedded png -- images are POSTS. So you might have a user make 2 posts if a post includes an image!
    // image/jpeg;base64 this is an embedded jpeg
    // for HTML you will want to strip tags before displaying
    contentType: "text/plain",
    content:
      "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.",
    // the author has an ID where by authors can be disambiguated
    author: {
      type: "author",
      // ID of the Author
      id: "http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
      // # the home host of the author
      host: "http://127.0.0.1:5454/",
      // the display name of the author
      displayName: "Rebecca",
      // url to the authors profile
      url: "http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
      // HATEOS url for Github API
      github: "http://github.com/rebeccas",
      profileImage: "/static/images/avatars/rebecca.jpg",
    },
    // categories this post fits into (a list of strings
    categories: ["web", "tutorial"],
    // comments about the post
    // return a maximum number of comments
    // total number of comments for this post
    count: 45,
    // page size
    size: 50,
    // the first page of comments
    // comments: "http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
    // You should return ~ 5 comments per post.
    // should be sorted newest(first) to oldest(last)
    comments: [
      {
        type: "comment",
        author: {
          type: "author",
          // ID of the Author (UUID)
          id: "http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
          // url to the authors information
          url: "http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
          host: "http://127.0.0.1:5454/",
          displayName: "Rebecca Smiles",
          // HATEOS url for Github API
          github: "http://github.com/rebbecas",
          profileImage: "/static/images/avatars/rebecca.jpg",
        },
        comment: "Sick Olde English",
        contentType: "text/plain",
        // ISO 8601 TIMESTAMP
        published: "2015-03-09T13:07:04+00:00",
        // ID of the Comment (UUID)
        id: "http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
      },
    ],
    // ISO 8601 TIMESTAMP
    published: "2015-03-09T13:07:04+00:00",
    // visibility ["PUBLIC","FRIENDS"]
    visibility: "PUBLIC",
    // for visibility PUBLIC means it is open to the wild web
    // FRIENDS means if we're direct friends I can see the post
    // FRIENDS should've already been sent the post so they don't need this
    unlisted: false,
    // unlisted means it is public if you know the post name -- use this for images, it's so images don't show up in timelines
  },
];

export default posts;
