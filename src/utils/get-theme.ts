import { cookies } from 'next/headers';

export type ThemeType = 'light' | 'dark';

export async function getTheme(): Promise<ThemeType> {
  const cookieStore = await cookies();
  const theme = cookieStore.get('THEME')?.value;
  return theme === 'dark' ? 'dark' : 'light';
}
