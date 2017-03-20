window.onload = () => {
  const piano = new MIDILive.Instruments.SoundfontInstrument('./lib/soundfont/', 'acoustic_grand_piano');

  MIDILive.init().then(() => {
    piano.init().then(() => {
      MIDILive.listInputs().forEach((input) => {
        let node = document.createElement('li');
        let text = document.createTextNode(input.name);
        node.appendChild(text);
        document.getElementById('instruments').appendChild(node);
      });
      MIDILive.addInstrument(piano);
    });
  });
};
