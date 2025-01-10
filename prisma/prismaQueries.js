const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.findUser = async (username) => {
  const user = await prisma.blogUser.findFirst({
    where: {
      username: username,
    },
  });
  return user;
};

exports.findByUsername = async (username) => {
  const existingUser = await prisma.blogUser.findFirst({
    where: {
      username: username,
    },
  });
  return existingUser;
};

exports.findByEmail = async (email) => {
  const existingEmail = await prisma.blogUser.findFirst({
    where: {
      email: email,
    },
  });
  return existingEmail;
};

exports.pushBlogUser = async (username, email, password) => {
  await prisma.blogUser.create({
    data: {
      username: username,
      email: email,
      password: password,
    },
  });
};

// getting all posts for displaying the titles in the front page
exports.findPosts = async () => {
  const posts = await prisma.blogUserPost.findMany();
  return posts;
};

exports.findPublishedPosts = async () => {
  const publishedPosts = await prisma.blogUserPost.findMany({
    where: {
      published: true,
    },
  });
  return publishedPosts;
};

// to get the specific posts and their comments
exports.findPostWithComments = async (id) => {
  const post = await prisma.blogUserPost.findFirst({
    where: {
      id: id,
    },
    include: {
      comments: true,
    },
  });
  return post;
};

// get all the posts created by a specific user
// exports.findAuthorPosts = async (username) => {
//   const authorPosts = await prisma.blogUserPost.findMany({
//     where: {
//       authorId: username,
//     },
//   });
//   return authorPosts;
// };

// exports.findSpecificPost = async (id) => {
//   const post = await prisma.blogUserPost.findFirst({
//     where: {
//       id: id,
//     },
//   });
//   return post;
// };

exports.postNewBlogPost = async (title, content) => {
  await prisma.blogUserPost.create({
    data: {
      title: title,
      content: content,
    },
  });
};

exports.postNewBlogComment = async (comment, postId) => {
  await prisma.blogUserComment.create({
    data: {
      comment: comment,
      postId: postId,
    },
  });
};

exports.changePublishedStatus = async (status, postId) => {
  console.log(status, postId);
  await prisma.blogUserPost.update({
    where: {
      id: postId,
    },
    data: {
      published: status,
    },
  });
};

exports.updatePost = async (newTitle, newContent, postId) => {
  await prisma.blogUserPost.update({
    where: {
      id: postId,
    },
    data: {
      title: newTitle,
      content: newContent,
    },
  });
};

exports.deletePost = async (postId) => {
  await prisma.blogUserComment.deleteMany({
    where: {
      postId: postId,
    },
  });

  await prisma.blogUserPost.delete({
    where: {
      id: postId,
    },
  });
};

exports.deleteComment = async (commentId) => {
  await prisma.blogUserComment.delete({
    where: {
      id: commentId,
    },
  });
};

async function main() {
  // await prisma.blogUserComment.deleteMany();
  // await prisma.blogUserPost.deleteMany();
  // await prisma.blogUser.deleteMany();
  // await prisma.blogUserComment.create({
  //   data: {
  //     comment: "blacky black blah blah",
  //     postId: 11,
  //   },
  // });

  // await prisma.blogUserPost.deleteMany({
  //   where: {
  //     authorId: "blahblah22",
  //   },
  // });
  // await prisma.blogUserPost.create({
  //   data: {
  //     title: "blah",
  //     content: "blah blah blah",
  //     authorId: "blahblah22",
  //   },
  // });
  // const aa = await prisma.blogUser.findFirst({
  //   where: {
  //     username: "blahblah22",
  //   },
  //   include: {
  //     posts: true,
  //   },
  // });
  // console.log(aa);
  // await prisma.blogUserPost.deleteMany({
  //   where: {
  //     authorId: "lasher55",
  //   },
  // });
  // await prisma.blogUser.delete({
  //   where: {
  //     username: "lasher55",
  //   },
  // });
  // await prisma.blogUserPost.updateMany({
  //   where: {
  //     authorId: "blahblah22",
  //   },
  //   data: {
  //     published: true,
  //   },
  // });
  //   await prisma.blogUser.deleteMany();
  //   const u = await prisma.blogUser.findFirst({
  //     where: {
  //       username: "dd",
  //     },
  //     include: {
  //       posts: true,
  //       comments: true,
  //     },
  //   });
  //   console.log(u);
  // ... you will write your Prisma Client queries here
  // await prisma.blogUser.create({
  //   data: {
  //     username: "blahblah22",
  //     email: "fedjd@gmail.com",
  //     password: "QtPassword@2",
  //   },
  // });
  const u = await prisma.blogUserPost.findMany();
  console.log(u);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
