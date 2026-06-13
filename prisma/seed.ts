import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const existing = await prisma.registration.findFirst()
  if (existing) {
    console.log("Database already has data, skipping seed.")
    return
  }

  await prisma.registration.create({
    data: {
      fullName: "John Doe",
      whatsappNumber: "+2348012345678",
      email: "john@example.com",
    },
  })

  await prisma.registration.create({
    data: {
      fullName: "Jane Smith",
      whatsappNumber: "+2348098765432",
    },
  })

  console.log("Seeded 2 sample registrations.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
