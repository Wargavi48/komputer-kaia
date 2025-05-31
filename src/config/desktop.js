export const apps = [
  {
    icon: 'cd-audio',
    label: 'Kaia Media Player',
    appletUrl: '/applet/media-player',
    windowSetting: {
      minWidth: 640,
      minHeight: 400,
    },
  },
  {
    icon: 'monalisa',
    label: 'Photo Viewer',
    appletUrl: '/applet/photo-album',
    windowSetting: {
      minWidth: 640,
      minHeight: 480,
    },
  },
  {
    icon: 'people',
    label: 'Video Call',
    appletUrl: '/applet/video-call',
    windowSetting: {
      minWidth: 800,
      minHeight: 600,
    },
  },
  {
    icon: 'telephone',
    label: 'Voicemail',
    appletUrl: '/applet/voice-mail',
    windowSetting: {
      minWidth: 500,
      minHeight: 480,
    },
  },
  {
    icon: 'mail',
    label: 'E-Mail',
    appletUrl: '/applet/email',
    windowSetting: {
      minWidth: 500,
      minHeight: 480,
    },
  },
]

export const desktopIcons = [
  ...apps,
  {
    icon: 'notepad',
    label: 'Terima Kasih Kana.pdf',
    appletUrl: 'https://online.fliphtml5.com/cxnyj/ocnr/',
    windowSetting: {
      minWidth: 500,
      minHeight: 480,
    },
  },
]
