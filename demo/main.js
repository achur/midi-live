window.onload = () => {
  const debugInstrument = new MIDILive.Instruments.DebugInstrument();

  MIDILive.init().then(() => {
    MIDILive.addInstrument(debugInstrument);
  });
};
