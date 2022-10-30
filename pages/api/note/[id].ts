import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const noteId = req.query.id;
  console.log("id:", noteId);
  if (req.method === "DELETE") {
    const note = await prisma.note.delete({
      where: { id: Number(noteId) },
    });
    res.json(note);
  } else {
    console.log("note could not be created");
  }
}
