"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const items = [["Products","products"],["Custom Solutions","custom-solutions"],["Manufacturing","manufacturing"],["Quality","quality-compliance"],["About","about"],["News","news"]] as const;

export function SiteHeader({ locale }: { locale: string }) {
  const [open,setOpen]=useState(false);
  useEffect(()=>{ if(!open)return; const close=(e:KeyboardEvent)=>e.key==="Escape"&&setOpen(false); document.body.style.overflow="hidden"; window.addEventListener("keydown",close); return()=>{document.body.style.overflow="";window.removeEventListener("keydown",close)}; },[open]);
  return <header className="site-header"><div className="header-inner"><Link className="brand" href={`/${locale}`} aria-label="PARTY HUB home"><span className="brand-mark"><Image src="/brand/logo.png" alt="" fill sizes="54px" /></span><span><strong>PARTY HUB</strong><small>Celebration Supply Studio</small></span></Link><nav className="desktop-nav" aria-label="Primary navigation">{items.map(([label,path])=><Link key={path} href={`/${locale}/${path}`}>{label}</Link>)}</nav><div className="header-actions"><Link className="button button-small" href={`/${locale}/contact`}><Sparkles size={15}/>Request a Quote</Link><button className="menu-button" aria-label="Open menu" onClick={()=>setOpen(true)}><Menu/></button></div></div>{open&&<div className="mobile-nav" role="dialog" aria-label="Mobile navigation" aria-modal="true"><button aria-label="Close menu" onClick={()=>setOpen(false)}><X/></button><nav>{items.map(([label,path])=><Link key={path} href={`/${locale}/${path}`}>{label}</Link>)}</nav><Link className="button" href={`/${locale}/contact`}>Request a Quote</Link></div>}</header>;
}
