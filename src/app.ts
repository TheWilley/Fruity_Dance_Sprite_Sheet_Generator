import './main/sass/main.sass'

function importAll(r: any) {
    r.keys().forEach(r);
  }
  
  importAll(require.context('./main/ts', true, /\.ts$/));