const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RANDOM_DREAMS = [
  { title: "Liburan ke Jepang", description: "Melihat Sakura dan makan Sushi asli." },
  { title: "Nonton Konser Tulus", description: "Bernyanyi bareng lagu-lagu romantis." },
  { title: "Masak Pasta Bareng", description: "Bikin dinner romantis di rumah." },
  { title: "Piknik di Kebun Raya Bogor", description: "Bawa bekal dan santai di bawah pohon." },
  { title: "Road Trip ke Bali", description: "Petualangan panjang berdua menyisir jalan." },
  { title: "Nabung buat Rumah Impian", description: "Target cicilan pertama tahun depan." },
  { title: "Makan All You Can Eat", description: "Sampai benar-benar kenyang!" },
  { title: "Belajar Bahasa Baru Berdua", description: "Mungkin bahasa Korea atau Jepang?" },
  { title: "Camping di Ciwidey", description: "Melihat bintang di malam hari." },
  { title: "Beli Sepatu Couple", description: "Biar kompak pas jalan-jalan." },
  { title: "Pergi ke Disneyland", description: "Menjadi anak kecil lagi seharian." },
  { title: "Foto Studio Berdua", description: "Buat dipajang di ruang tamu nanti." }
];

async function seed() {
  console.log("Seeding bucket list...");
  for (const dream of RANDOM_DREAMS) {
    await prisma.bucketItem.create({
      data: dream
    });
  }
  console.log("Done!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
