"use strict";
// router.post('/signup', async (req, res) => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         res.status(400).json({ error: 'Username or password is missing' });
//         return;
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//         const newUser = await prisma.user.create({ data: { username, hashedPassword } });
//         res.status(201).json(newUser);
//     } catch (error: any) {
//         if (error.code === 'P2002') {
//             const userThatIsAlreadyThere = await prisma.user.findUnique({ where: { username } });
//             res.status(400).json({ error: 'User already exists', id: userThatIsAlreadyThere?.id });
//             return;
//         } else {
//             res.status(500).json({ error: error.message });
//             return;
//         }
//     }
// });
