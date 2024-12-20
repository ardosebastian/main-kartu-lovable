import type { Question } from "@/types";

export const questions: Question[] = [
  {
    type: "question",
    text: "Ceritakan fantasi terliar anda",
    hasTimer: false,
    level: 1
  },
  {
    type: "challenge",
    text: "Berikan 3 ciuman di tempat yang berbeda",
    hasTimer: false,
    level: 2
  },
  {
    type: "challenge",
    text: "Lakukan tarian seksi selama 1 menit",
    hasTimer: true,
    duration: 60,
    level: 2
  },
  {
    type: "challenge",
    text: "Berikan pasangan anda pijatan selama 2 menit",
    hasTimer: true,
    duration: 120,
    level: 1
  },
  {
    type: "question",
    text: "Bagian mana dari tubuh pasangan yang paling anda sukai?",
    hasTimer: false,
    level: 1
  },
  {
    type: "challenge",
    text: "Buat pasangan anda tertawa tanpa menggelitik selama 30 detik",
    hasTimer: true,
    duration: 30,
    level: 1
  },
  {
    type: "question",
    text: "Ceritakan pengalaman romantis yang tidak akan pernah anda lupakan",
    hasTimer: false,
    level: 1
  },
  {
    type: "challenge",
    text: "Bisikkan kata-kata nakal di telinga pasangan selama 1 menit",
    hasTimer: true,
    duration: 60,
    level: 2
  },
  {
    type: "question",
    text: "Apa yang membuat anda terangsang?",
    hasTimer: false,
    level: 1
  },
  {
    type: "challenge",
    text: "Berpelukan erat selama 30 detik tanpa berbicara",
    hasTimer: true,
    duration: 30,
    level: 2
  }
];
