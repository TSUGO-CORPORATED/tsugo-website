// IMPORT MODULES
import LayoutSub from './layout-sub';
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
      <LayoutSub childrenProp={children}/>
    </html>
  )
}
