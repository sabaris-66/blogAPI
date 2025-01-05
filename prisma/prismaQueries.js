const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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

async function main() {
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
  //   await prisma.blogUser.create({
  //     data: {
  //       username: "dd",
  //       email: "fe#",
  //       password: "password",
  //     },
  //   });
  const u = await prisma.blogUser.findMany();
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
