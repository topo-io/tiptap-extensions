import { RichTextEditor } from '../components';

import { BASIC_CONTENT } from '../data';

function HomePage() {
  return (
    <div id="Wrapper">
      <RichTextEditor content={BASIC_CONTENT} />
    </div>
  );
}

export default HomePage;
