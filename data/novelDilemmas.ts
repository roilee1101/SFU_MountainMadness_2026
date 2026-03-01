export type NovelDilemma = {
  id: string;
  novel: string;
  character: string;
  situation: string;
  prompt: string;
};

export const NOVEL_DILEMMAS: NovelDilemma[] = [
  {
    id: "1",
    novel: "Les Misérables",
    character: "Jean Valjean",
    situation: "A Loaf of Bread",
    prompt: "You can steal a loaf of bread to feed your starving nephew. Getting caught means prison, but walking away means he goes hungry tonight. What do you do?",
  },
  {
    id: "2",
    novel: "Crime & Punishment",
    character: "Raskolnikov",
    situation: "The Pawnbroker's Wealth",
    prompt: "You could eliminate a ruthless moneylender who built her fortune through exploitation, and use her wealth to save countless poor souls. Is sacrificing one evil person to save many ever justified?",
  },
  {
    id: "3",
    novel: "To Kill a Mockingbird",
    character: "Atticus Finch",
    situation: "An Uncomfortable Truth",
    prompt: "An innocent person is about to be wrongfully convicted. Speaking the truth will turn the entire community against you and endanger your family. Do you stay silent, or do you stand up?",
  },
  {
    id: "4",
    novel: "The Lord of the Rings",
    character: "Frodo",
    situation: "The Temptation of the Ring",
    prompt: "Putting on the Ring could save you from immediate danger right now. But using its power even once may doom the entire quest to destroy it. Do you save yourself, or protect the mission?",
  },
  {
    id: "5",
    novel: "The Great Gatsby",
    character: "Nick Carraway",
    situation: "A Friend's Secret",
    prompt: "Your friend hit someone with their car and fled the scene. They beg you to stay silent. Speaking up destroys them — but silence lets an innocent person take the blame. What do you choose?",
  },
  {
    id: "6",
    novel: "1984",
    character: "Winston Smith",
    situation: "Resistance in the Dark",
    prompt: "You are keeping a secret diary as an act of defiance against the regime. Discovery means torture and death. But stopping means surrendering the last shred of your humanity. Do you keep writing?",
  },
  {
    id: "7",
    novel: "Pride & Prejudice",
    character: "Elizabeth Bennet",
    situation: "A Convenient Match",
    prompt: "A wealthy suitor you don't love could lift your entire family out of poverty. Do you sacrifice your own happiness to save them, or refuse and follow your heart?",
  },
  {
    id: "8",
    novel: "The Metamorphosis",
    character: "Gregor Samsa",
    situation: "A Burden to Bear",
    prompt: "You know you have become a financial and emotional burden on your family. Perhaps disappearing would be the greatest gift you could give them. Is erasing yourself an act of love?",
  },
  {
    id: "9",
    novel: "Adventures of Huckleberry Finn",
    character: "Huck Finn",
    situation: "The Runaway Slave",
    prompt: "Jim, an escaped slave, is your truest friend. The law demands you turn him in — but doing so sends him back to chains. Do you follow the law, or follow your conscience?",
  },
  {
    id: "10",
    novel: "Faust",
    character: "Faust",
    situation: "The Devil's Bargain",
    prompt: "The Devil offers you all knowledge and pleasure in exchange for your immortal soul. You only live once — can you sell something eternal for the chance to experience everything?",
  },
];