import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden bg-white">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-primary uppercase tracking-widest mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          v1.8.3 Stable
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-black tracking-tight text-gray-900 mb-8 leading-[0.85]"
        >
          SCANLY <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-accent">STUDIO</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed">
            The professional standard for QR design. 
            <span className="text-gray-900"> High-performance</span>, cloud-synced, and built for modern brands.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
