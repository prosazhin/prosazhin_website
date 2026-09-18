'use client';

import { Container } from '@prosazhin/pbcomponents';
import { ReactNode } from 'react';

const PageWithLeftAside = ({
  children,
  aside,
  size = 's',
}: {
  children: ReactNode;
  aside: ReactNode;
  size?: 's' | 'm' | 'full';
}) => {
  return (
    <Container size={size}>
      {/* Ниже xl колонка схлопывается и aside встаёт над контентом — добавляем воздух к gap грида. */}
      <Container.LeftAside className='max-xl:mb-24 print:mb-0'>{aside}</Container.LeftAside>
      <Container.Main>{children}</Container.Main>
    </Container>
  );
};

export default PageWithLeftAside;
