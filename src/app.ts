import './main/sass/main.sass'
import EventListeners from './main/ts/eventListeners';

function importAll(r: any) {
    r.keys().forEach(r);
  }
  
  importAll(require.context('./main/ts', true, /\.ts$/));

  new EventListeners().run()