export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  date: string;
  likes: number;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: "हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें, आज की क़द्र करेंगे तो ही कल बनता है",
    slug: "ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein",
    excerpt: "हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें, आज की क़द्र करेंगे तो ही कल बनता है ...",
    image: "https://res.cloudinary.com/djxuqljgr/image/upload/v1742234779/imagr2_l80wqe.jpg",
    date: "December 6, 2024",
    likes: 31,
    content: `
      <p>हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें</br>
      आज की क़द्र करेंगे तो ही कल बनता है</br>
      तपना पड़ता है मुक़द्दर को बनाने के लिए</br>
      खारा पानी तभी बरसात का जल बनता है</br>
      उम्र लगती है तो लहजा ए ग़ज़ल बनता है</br>
      एक दो दिन में कहीं ताजमहल बनता है</br>
      उसने इल्ज़ाम लगाया तो ये हक़ है मेरा</br>
      यार अहसान का इतना तो बदल बनता है</p>
    `,
  },
];
