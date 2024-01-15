import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    //   await prisma.admin.deleteMany();
    //   await prisma.user.deleteMany();

    const adminSeed = await prisma.admin.create({
        data: {
            id: 1,
            userName: 'admin',
            password: '$2a$15$vjzmB82wjOlkscHsCVgl1uC4Mf3httLHAVwX9Clm4YIEMOn6fZnUi', // 123456
            fullName: 'Super Admin',
            dob: '2001-09-15T00:00:00Z',
            email: 'doanhlinh.hust@gmail.com',
            phone: '99999999',
        },
    });

    const userSeed = await prisma.user.create({
        data: {
            id: 1,
            userName: 'user_01',
            password: '$2a$15$vjzmB82wjOlkscHsCVgl1uC4Mf3httLHAVwX9Clm4YIEMOn6fZnUi', // 123456
            fullName: 'User 01',
            dob: '2001-09-15T00:00:00Z',
            phone: '0123456789',
            email: 'user01@gmail.com',
            gender: 'MALE',
            status: 'ACTIVE',
        },
    });

    console.log(adminSeed, userSeed);
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
