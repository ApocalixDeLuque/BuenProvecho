'use client';
import Link from 'next/link';
import React, { forwardRef } from 'react';

interface ButtonProps {
  text: string;
  color?: 'pink' | 'blue' | 'green';
  link?: string;
  onClick?: () => void;
  selected?: boolean;
  submit?: boolean;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  ref?: React.Ref<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  submit,
  text,
  color = 'green',
  link,
  onClick,
  selected,
  buttonProps,
  ref,
}) => {
  const ButtonContent = () => (
    <button
      {...buttonProps}
      ref={ref}
      type={submit ? 'submit' : 'button'}
      className={`w-full text-center font-medium ${
        color === 'pink'
          ? selected
            ? 'bg-pink-400 border-pink-400 text-white'
            : 'border-pink-400 text-pink-400'
          : color === 'blue'
          ? selected
            ? 'bg-blue-400 border-blue-400 text-white'
            : 'border-blue-400 text-blue-400'
          : color === 'green'
          ? selected
            ? 'bg-verde-salud border-verde-salud text-white'
            : 'border-verde-salud text-verde-salud'
          : ''
      } border-2 rounded-lg py-1 lg:py-2 lg:text-xl`}
      onClick={onClick}
    >
      {text}
    </button>
  );

  return link ? (
    <Link href={link} className="w-full">
      <ButtonContent />
    </Link>
  ) : (
    <ButtonContent />
  );
};

const _Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <Button
      {...props}
      ref={ref}
      buttonProps={{
        ...props.buttonProps,
      }}
    />
  );
});

_Button.displayName = 'Button';

export default _Button;
