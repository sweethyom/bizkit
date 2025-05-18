import { ReactNode, useEffect, useRef, useState } from 'react';
import { DropDownItemProps, DropDownMenu } from './DropDownMenu';

interface DropDownSectionProps {
  items: DropDownItemProps[];
  button: (handleMenuVisibility: () => void) => ReactNode;
}

export const DropDownSection = ({ items, button }: DropDownSectionProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={menuRef} className='relative'>
      {button(toggleVisibility)}

      {isOpen && <DropDownMenu items={items} toggleVisibility={toggleVisibility} />}
    </div>
  );
};
