import { useState } from 'react';

export default function useScrollTop () {
  const [scrollTop, setScrollTop] = useState(0);
  const onScroll = (event: any) => setScrollTop(event.target.scrollTop);
  return [scrollTop, { onScroll }];
}