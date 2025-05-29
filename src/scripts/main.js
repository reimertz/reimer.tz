// Original functionality adapted for ES modules
import Writer from './modules/Writer.js';
import Translater from './modules/Translater.js';
import LazyLoader from './modules/LazyLoader.js';
import CursorFriend from './modules/CursorFriend.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  const introText = `hi, my name is piérre reimertz.

i am a humble developer@@@#########magician@@@########coder, designer, fake-it-til-you-make-it#######################entrepreneur and everyday hustler.

creativity is my addiction.

$http://github.com/reimertz$github$ | $http://twitter.com/reimertz$twitter$ | $https://www.linkedin.com/in/reimertz$linkedin$ | $mailto:pierre.reimertz@gmail.com$hire me$ `;

  const writer = new Writer(document.querySelectorAll('.writer'), introText);
  const translater = new Translater(document.querySelector('.tre-d'), 10, 10);
  const ll = new LazyLoader({ 
    lines: 5,
    throttle: 500,
    checkOnStart: false,
    fakeSlowness: {
      delayBeforeFetch: () => { return Math.random() * 3500 + 1000},
      percentageOfImages: 0.3
    }
  });
  const cF = new CursorFriend({selector: '.project'});

  // Start everything
  requestAnimationFrame(() => {
    writer.start();
    translater.start();
    ll.start();
    cF.start();
  });
});