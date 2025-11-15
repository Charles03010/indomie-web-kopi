import Image from 'next/image';
import Menu from './menu';
import Foto from './foto';
import Ulasan from './ulasan';

export default async function Cafe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dataCafe = {
    name: 'Cafe A',
    description:
      'Cafe A adalah tempat yang nyaman untuk menikmati kopi dan bersantai bersama teman-teman. Dengan suasana yang hangat dan pelayanan yang ramah, Cafe A menawarkan berbagai pilihan kopi berkualitas tinggi serta makanan ringan yang lezat.',
    menu: [
      {
        title: 'Espresso',
        imageUrl: '/images/upload/Cafe1.png',
        description: 'ini deskripsi',
        rating: 3,
        price: 25000,
      },
      {
        title: 'Cappuccino',
        imageUrl: '/images/upload/Cafe1.png',
        description: 'ini deskripsi',
        rating: 5,
        price: 30000,
      },
      {
        title: 'Latte',
        imageUrl: '/images/upload/Cafe1.png',
        description: 'ini deskripsi',
        rating: 5,
        price: 30000,
      },
    ],
    foto: [
      { imageUrl: '/images/upload/Cafe1.png', alt: 'Cafe 1' },
      { imageUrl: '/images/upload/Cafe1.png', alt: 'Cafe 2' },
      { imageUrl: '/images/upload/Cafe1.png', alt: 'Cafe 3' },
    ],
    ulasan: [
      {
        user: 'User1',
        comment: 'Tempatnya nyaman dan kopinya enak!',
        rating: 5,
        profilepic: '/images/upload/Cafe1.png',
      },
      {
        user: 'User2',
        comment: 'Pelayanan yang ramah dan suasana yang cozy.',
        rating: 4,
        profilepic: '/images/upload/Cafe1.png',
      },
      {
        user: 'User3',
        comment: 'Menu kopinya bervariasi dan lezat.',
        rating: 5,
        profilepic: '/images/upload/Cafe1.png',
      },
    ],
  };
  return (
    <>
      <section>
        <div className="relative w-3/4 aspect-3/1 overflow-hidden mx-auto mt-25">
          <Image
            src={`/images/upload/Cafe${id}.png`}
            className="rounded-xl"
            alt={`Cafe ${id}`}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>
      <section className="my-10 mx-20">
        <h2 className="text-6xl text-(--head-text) font-extrabold">
          {dataCafe.name}
        </h2>
        <p className="text-(--head-text) font-light mt-3">
          {dataCafe.description}
        </p>
      </section>
      <Menu data={dataCafe.menu} />
      <Foto data={dataCafe.foto} />
      <Ulasan data={dataCafe.ulasan} />
    </>
  );
}
