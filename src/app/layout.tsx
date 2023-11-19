// IMPORT MODULES
import ContextVariable from './ContextVariable';
import '../css/styles.css';
  // These styles apply to every route in the application

// DEFAULT NAMING
export const metadata = {
  title: 'Tsugo',
}

// ROOT LAYOUT
export default function RootLayout({ children }: { children: React.ReactNode}) {
  return (
    <html lang="en">
      <ContextVariable childrenProp={children}/>
    </html>
  )
}
