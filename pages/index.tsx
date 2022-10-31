import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { prisma } from "../lib/prisma";

interface FormData {
  title: string;
  content: string;
  id: string;
}

interface Notes {
  notes: {
    id: string;
    title: string;
    content: string;
  }[];
}
export default function Home({ notes }: Notes) {
  const createNote = async (data: FormData) => {
    try {
      fetch("http://localhost:3000/api/createNote", {
        body: JSON.stringify(data),
        headers: {
          "content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        setForm({ title: "", content: "", id: "" });
        refreshData();
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath); // refresh page
  };

  const deleteNote = async (id: string) => {
    try {
      fetch(`http://localhost:3000/api/note/${id}`, {
        headers: {
          "content-Type": "application/json",
        },
        method: "DELETE",
      }).then(() => {
        refreshData();
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      createNote(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    id: "",
  });
  return (
    <div>
      <h1 className="text-center font-bold text-2xl mt-4">Notes</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form);
        }}
        className="w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />

        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-1">
          Add +
        </button>
      </form>
      <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch">
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="border-b border-gray-600 p-2">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{note.title}</h3>
                  <p className="text-sm">{note.content}</p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="bg-red-500 px-3 text-white rounded p-1"
                >
                  X
                </button>
                <button
                  onClick={() =>
                    setForm({
                      title: note.title,
                      content: note.content,
                      id: note.id,
                    })
                  }
                  className="bg-blue-500 px-3 text-white rounded p-1"
                >
                  Update
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // const notes = await prisma.note.findMany(); // basic version
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      content: true,
      id: true,
    },
  });

  return {
    props: { notes },
  };
};
