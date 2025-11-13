import Image from 'next/image';
import Link from 'next/link';

export default function Cafe({ params }: { params: { id: string } }) {
    console.log(params);
  return (
    <>
        <Image src={`/images/upload/Cafe${params.id}.png`} alt={`Cafe ${params.id}`} fill />
    </>
  );
}
