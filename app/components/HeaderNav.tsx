import { useLocation, useNavigate } from '@remix-run/react';

import ArrowLeft from './icon/ArrowLeftIcon';

export default function HeaderNav({ text, to }: { text: string; to: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = () => {
    if (location.state?.from === to) {
      navigate(-1);
    } else {
      navigate(to, { replace: true });
    }
  };

  return (
    <div className="header-nav">
      <span onClick={navigateTo}>
        <ArrowLeft className="mr-1" />
      </span>
      <h1>{text}</h1>
    </div>
  );
}
