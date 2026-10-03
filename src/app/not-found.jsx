import NotFoundContent from '@/components/NotFoundContent';

// not-found рендерится в root layout, минуя (site)/layout.jsx, поэтому
// обёртку <main> (отступ под шапку и минимальная высота) повторяем здесь
const NotFound = () => {
  return (
    <main className='desktop:min-h-[calc(100vh-107px-80px-(72px+40px))] mt-112 mb-80 min-h-[calc(100vh-299px-80px-(72px+40px))]'>
      <NotFoundContent />
    </main>
  );
};

export default NotFound;
