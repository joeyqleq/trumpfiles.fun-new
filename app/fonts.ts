import localFont from 'next/font/local'

// Arctic Guardian font family - multiple variants for creative typography
export const arcticGuardian3D = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardian3d.ttf',
  variable: '--font-arctic-3d',
  display: 'swap',
})

export const arcticGuardianGrad = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardiangrad.ttf',
  variable: '--font-arctic-grad',
  display: 'swap',
})

export const arcticGuardianLaser = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianlaser.ttf',
  variable: '--font-arctic-laser',
  display: 'swap',
})

export const arcticGuardianHalf = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianhalf.ttf',
  variable: '--font-arctic-half',
  display: 'swap',
})

export const arcticGuardianTwoTone = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardiantwotone.ttf',
  variable: '--font-arctic-twotone',
  display: 'swap',
})

export const arcticGuardianLeft = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianleft.ttf',
  variable: '--font-arctic-left',
  display: 'swap',
})

// Main Arctic Guardian for headings
export const arcticGuardian = localFont({
  src: [
    {
      path: '../public/fonts/Arctic_Guardian/arcticguardian3d.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Arctic_Guardian/arcticguardian3dital.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-arctic-guardian',
  display: 'swap',
})

// Epilogue font family - for body text, paragraphs, captions
export const epilogue = localFont({
  src: [
    {
      path: '../public/fonts/Epilogue/Epilogue-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-ExtraLightItalic.ttf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/Epilogue/Epilogue-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-epilogue',
  display: 'swap',
})