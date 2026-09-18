const contacts = [
  {
    title: 'prosazhin@gmail.com',
    url: 'mailto:prosazhin@gmail.com',
    link: false,
  },
  {
    title: 'Telegram',
    url: 'https://t.me/prosazhin',
    link: true,
  },
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/prosazhin',
    link: true,
  },
  {
    title: 'Habr Career',
    url: 'https://career.habr.com/prosazhin',
    link: true,
  },
  {
    title: 'hh.ru',
    url: 'https://sochi.hh.ru/resume/189bff75ff0ee32bed0039ed1f6d5345696862',
    link: true,
  },
  {
    title: 'Behance',
    url: 'https://www.behance.net/prosazhin',
    link: true,
  },
  {
    title: 'GitHub',
    url: 'https://github.com/prosazhin',
    link: true,
  },
  {
    title: 'Medium',
    url: 'https://medium.com/@prosazhin',
    link: true,
  },
  {
    title: 'Figma Community',
    url: 'https://www.figma.com/@prosazhin',
    link: true,
  },
];

// Телефон — только в PDF (для ATS и рекрутёров), на сайте не публикуется.
const phone = {
  title: '+7 913 823-78-16',
  url: 'tel:+79138237816',
  link: false,
};

export const cvContacts = [contacts[0], phone, ...contacts.slice(1)];

export default contacts;
