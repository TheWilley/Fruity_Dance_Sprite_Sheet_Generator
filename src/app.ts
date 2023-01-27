function importAll(r: any) {
    r.keys().forEach(r);
  }
  
  importAll(require.context('./main', true, /\.js$/));