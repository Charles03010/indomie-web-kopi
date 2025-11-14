'use client';
import { Camera, Eye, EyeOff, SquareUserRound } from 'lucide-react';
import { useState } from 'react';

export const Input = ({
  type,
  placeholder,
  name,
  label,
  showPassword,
  setShowPassword,
  value,
  onChange,
}: {
  type: string;
  placeholder: string;
  name: string;
  label: string;
  showPassword?: boolean;
  setShowPassword?: (value: boolean) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  const passwordVisible = showPassword ?? internalShowPassword;
  const toggleShow = (setShowPassword ?? setInternalShowPassword) as (
    v: boolean
  ) => void;
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="text-(--head-text)">
      <label className="font-extrabold" htmlFor={name}>
        {label}
      </label>
      {type !== 'file' ? (
        <div className="flex bg-(--input-bg) mt-2 w-full rounded-xl items-center">
          <input
            type={passwordVisible ? 'text' : type}
            id={name}
            name={name}
            autoComplete={name}
            className="w-full p-4 outline-0"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
          {(name === 'password' || name === 'confirmPassword') &&
            passwordVisible === false && (
              <Eye
                className="mr-4 cursor-pointer"
                onClick={() => toggleShow(!passwordVisible)}
              />
            )}
          {(name === 'password' || name === 'confirmPassword') &&
            passwordVisible === true && (
              <EyeOff
                className="mr-4 cursor-pointer"
                onClick={() => toggleShow(!passwordVisible)}
              />
            )}
        </div>
      ) : (
        <>
          <label
            htmlFor={name}
            className="relative w-full aspect-square bg-(--input-bg) rounded-xl mt-2 outline-0 flex items-center justify-center cursor-pointer 
                   overflow-hidden transition-colors duration-200
                   group"
          >
            <input
              onChange={handleFileChange}
              accept="image/*"
              type={type}
              id={name}
              name={name}
              className="hidden"
            />
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex group-hover:hidden flex-col items-center text-gray-500">
                <SquareUserRound className="w-16 h-16 mb-2" />
                <span className="">Upload Photo</span>
              </div>
            )}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center 
                        opacity-0 group-hover:opacity-50 transition-opacity duration-200"
            >
              <Camera className="w-8 h-8 text-white" />
            </div>
          </label>
        </>
      )}
    </div>
  );
};

export const InputProfile = ({ name, url }: { name: string; url: string }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };
  return (
    <label
      htmlFor={name}
      className="relative w-1/3 mx-auto aspect-square bg-(--input-bg) rounded-full outline-0 flex items-center justify-center cursor-pointer 
                   overflow-hidden transition-colors duration-200
                   group"
    >
      <input
        onChange={handleFileChange}
        accept="image/*"
        type="file"
        id={name}
        name={name}
        className="hidden"
      />
      {preview || url ? (
        <img
          src={preview || url}
          alt="Profile Preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex group-hover:hidden flex-col items-center text-gray-500">
          <SquareUserRound className="w-8 h-8 mb-2" />
          <span className="text-xs">Upload Photo</span>
        </div>
      )}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center 
                        opacity-0 group-hover:opacity-50 transition-opacity duration-200"
      >
        <Camera className="w-8 h-8 text-white" />
      </div>
    </label>
  );
};
