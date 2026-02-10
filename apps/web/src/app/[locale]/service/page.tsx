import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Key, Settings, CheckCircle, MessageCircle, Mail, Phone } from 'lucide-react';

export default function ServicePage() {
  const t = useTranslations('ServicePage');

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#0a0e17]/80 backdrop-blur-xl fixed w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
              {t('nav.brand')}
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <div className="hidden sm:flex gap-4 text-sm font-medium text-slate-400">
              <Link href="/en/service" className="hover:text-white transition">EN</Link>
              <Link href="/zh/service" className="hover:text-white transition">中文</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/90 via-[#0a0e17]/80 to-[#0a0e17] z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        </div>
        
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <Badge variant="outline" className="mb-8 border-blue-500/50 text-blue-300 bg-blue-500/10 px-4 py-1 rounded-full backdrop-blur-md">
            {t('hero.badge')}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-white drop-shadow-2xl">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/639696352688" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="h-12 text-lg bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 rounded-full px-8">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </a>
            <a href="https://t.me/+639696352688" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="h-12 text-lg border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-8">
                Telegram
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 bg-slate-900/30 border-y border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-8">{t('requirements.title')}</h2>
          <div className="inline-flex items-center gap-4 bg-slate-800/50 px-8 py-4 rounded-2xl border border-slate-700">
            <Monitor className="w-10 h-10 text-blue-400" />
            <div className="text-left">
              <p className="text-lg font-medium">{t('requirements.item1')}</p>
              <p className="text-slate-400 text-sm">{t('requirements.item1_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Includes */}
      <section className="py-20 px-4 bg-[#0a0e17]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('services.title')}</h2>
            <p className="text-slate-400">{t('services.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 inline-block mb-6">
                <Monitor className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('services.service1_title')}</h3>
              <p className="text-slate-400 leading-relaxed">{t('services.service1_desc')}</p>
            </div>
            
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-colors">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 inline-block mb-6">
                <Key className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('services.service2_title')}</h3>
              <p className="text-slate-400 leading-relaxed">{t('services.service2_desc')}</p>
            </div>
            
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 inline-block mb-6">
                <Settings className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('services.service3_title')}</h3>
              <p className="text-slate-400 leading-relaxed">{t('services.service3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900/50 to-[#0a0e17]">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-10 rounded-3xl border border-blue-500/20 text-center">
            <p className="text-blue-300 font-medium mb-2">{t('pricing.label')}</p>
            <div className="text-5xl font-bold mb-4">
              ₱5,000 <span className="text-xl font-normal text-slate-400">{t('pricing.unit')}</span>
            </div>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">{t('pricing.description')}</p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-slate-800 text-slate-300 px-4 py-2">💵 Cash</Badge>
              <Badge className="bg-slate-800 text-slate-300 px-4 py-2">📱 GCash</Badge>
              <Badge className="bg-slate-800 text-slate-300 px-4 py-2">💳 Maya</Badge>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{t('pricing.guarantee')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 bg-[#0a0e17]">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-6">{t('about.title')}</h2>
          <p className="text-slate-400 leading-relaxed text-lg">{t('about.description')}</p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-slate-900/30 border-t border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">{t('contact.title')}</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
            <a href="https://wa.me/639696352688" target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-3 bg-green-600/20 hover:bg-green-600/30 px-6 py-4 rounded-xl border border-green-500/30 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-400" />
              <div className="text-left">
                <p className="text-sm text-slate-400">WhatsApp / Telegram</p>
                <p className="font-medium">+63 969 635 2688</p>
              </div>
            </a>
            
            <a href="mailto:kaneliu0@gmail.com"
               className="flex items-center gap-3 bg-blue-600/20 hover:bg-blue-600/30 px-6 py-4 rounded-xl border border-blue-500/30 transition-colors">
              <Mail className="w-6 h-6 text-blue-400" />
              <div className="text-left">
                <p className="text-sm text-slate-400">Email</p>
                <p className="font-medium">kaneliu0@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#05080f]">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-slate-500 text-sm leading-relaxed">
            {t('footer.text')}
          </p>
          <div className="mt-8 text-slate-600 text-xs">
            &copy; 2026 OpenClaw Service. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
