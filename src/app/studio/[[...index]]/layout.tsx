export const metadata = {
  title: 'Autovaly Studio',
  description: 'Content Management for Autovaly',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
