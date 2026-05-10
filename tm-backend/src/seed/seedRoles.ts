import prisma from "../config/prisma";

// Inserts the default "admin" and "user" roles into the database.
async function seedRoles() {
  await prisma.role.createMany({
    data: [
      { name: "admin" },
      { name: "user" },
    ],
  });

  console.log("Roles seeded successfully");
}

seedRoles()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });