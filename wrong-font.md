import localFont from 'next/font/local';

// Arctic Guardian Font Family - All variants
export const arcticGuardian = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianleft.ttf',
  variable: '--font-arctic-guardian',
  display: 'swap',
});

export const arcticGuardian3D = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardian3d.ttf',
  variable: '--font-arctic-guardian-3d',
  display: 'swap',
});

export const arcticGuardianGrad = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardiangrad.ttf',
  variable: '--font-arctic-guardian-grad',
  display: 'swap',
});

export const arcticGuardianLaser = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianlaser.ttf',
  variable: '--font-arctic-guardian-laser',
  display: 'swap',
});

export const arcticGuardianHalf = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianhalf.ttf',
  variable: '--font-arctic-guardian-half',
  display: 'swap',
});

export const arcticGuardianTwoTone = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardiantwotone.ttf',
  variable: '--font-arctic-guardian-twotone',
  display: 'swap',
});

export const arcticGuardianLeft = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianleft.ttf',
  variable: '--font-arctic-guardian-left',
  display: 'swap',
});

// Neuething Font Family - Using the Regular weight as the base
export const neuething = localFont({
  src: [
    {
      path: '../public/fonts/neue_thing/NeuethingVariableTest-Regular-BF64bf225f65f7c.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/neue_thing/NeuethingVariableTest-Meduim-BF64bf225f5cde9.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/neue_thing/NeuethingVariableTest-SemiBold-BF64bf225f8bf7a.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/neue_thing/NeuethingVariableTest-Bold-BF64bf225e66873.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/neue_thing/NeuethingVariableTest-ExtraBold-BF64bf225ed523f.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/neue_thing/NeuethingVariableTest-Black-BF64bf225e2ece3.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-neuething',
  display: 'swap',
});

// Epilogue Font (if still needed as fallback)
export const epilogue = localFont({
  src: '../public/fonts/Epilogue/Epilogue-VariableFont_wght.ttf',
  variable: '--font-epilogue',
  display: 'swap',
});



