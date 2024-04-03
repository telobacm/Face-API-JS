import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { CREATE, LIST } from '../crud'

const prisma = new PrismaClient()

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method === 'POST') {
//     const descriptor = req.body

//     try {
//       const result = await prisma.descriptor.create({
//         data: {
//           name: descriptor.name,
//           nip: descriptor.nip,
//           faceData: descriptor.faceData,
//         },
//       })

//       res.status(200).json(result)
//     } catch (err) {
//       console.error(err)
//       res.status(500).json({ message: 'Error creating descriptor' })
//     }
//   }
// }
export const POST = CREATE
export const GET = LIST
