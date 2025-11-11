'use client';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export const Button = ({
  type,
  name,
}: {
  type: 'submit' | 'reset' | 'button';
  name: string;
}) => {
  return (
    <button
      type={type}
      className="bg-(--button-primary) cursor-pointer w-full text-(--primary-white) py-3 rounded-full px-4"
    >
      {name}
    </button>
  );
};
