import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin } from "lucide-react"
import { company } from "@/content/company"

export function SiteFooter({ locale }: { locale: string }) {
  const footerCompanyName = company.legalName.replace(/[.\s]+$/, "")
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href={`/${locale}`} aria-label="PARTY HUB home" className="inline-flex max-w-full rounded-xl bg-white p-2">
            <Image src="/brand/logo.png" alt="PARTY HUB" width={240} height={200} className="h-auto w-48 max-w-full object-contain" />
          </Link>
          <span className="eyebrow">PARTY HUB</span>
          <h2>Make every celebration impossible to miss.</h2>
        </div>
        <div><h3>Explore</h3><Link href={`/${locale}/products`}>Products</Link><Link href={`/${locale}/custom-solutions`}>Custom Solutions</Link><Link href={`/${locale}/manufacturing`}>Manufacturing</Link></div>
        <div><h3>Company</h3><Link href={`/${locale}/about`}>About</Link><Link href={`/${locale}/quality-compliance`}>Quality &amp; Compliance</Link><Link href={`/${locale}/faq`}>FAQ</Link></div>
        <div><h3>Contact</h3><a href={`mailto:${company.email}`}><Mail size={16} />{company.email}</a><p><MapPin size={16} />Yiwu, Zhejiang, China</p></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {footerCompanyName}. All rights reserved.</span><Link href={`/${locale}/privacy`}>Privacy</Link></div>
    </footer>
  )
}
