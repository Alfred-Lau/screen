'use client';
import * as React from 'react';
export interface LaunchSiteProps {
 brand: string; headline: string; description: string;
 features: {title:string;description:string}[];
 faqs: {question:string;answer:string}[];
 action: {label:string;href:string};
 /** Real evidence only. Leave absent until substantiated. */
 evidence?: string;
}
/** Presentation only: CTA must point to a real destination supplied by the integrator. */
export function LaunchSite({brand,headline,description,features,faqs,action,evidence}:LaunchSiteProps){
 const safeHref=/^(https?:\/\/|\/(?!\/)|#)/i.test(action.href)?action.href:'#';
 return <div className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"><header className="mx-auto flex max-w-5xl items-center justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-800"><strong>{brand}</strong><a className="rounded border border-zinc-300 px-4 py-2 focus-visible:outline-2 focus-visible:outline-teal-600" href={safeHref}>{action.label}</a></header><main className="mx-auto max-w-5xl px-6 py-16"><section className="max-w-3xl"><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{headline}</h1><p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p><a className="mt-8 inline-flex rounded bg-zinc-900 px-5 py-3 text-white focus-visible:outline-2 focus-visible:outline-teal-600 dark:bg-white dark:text-zinc-900" href={safeHref}>{action.label}</a>{evidence&&<p className="mt-5 text-sm text-zinc-500">{evidence}</p>}</section><section className="mt-20 grid gap-6 sm:grid-cols-3" aria-label="Features">{features.map((f,i)=><article key={i} className="rounded border border-zinc-200 p-6 dark:border-zinc-800"><h2 className="font-semibold">{f.title}</h2><p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.description}</p></article>)}</section>{faqs.length>0&&<section className="mt-16" aria-label="Frequently asked questions">{faqs.map((f,i)=><details key={i} className="border-b border-zinc-200 py-5 dark:border-zinc-800"><summary className="cursor-pointer font-medium">{f.question}</summary><p className="mt-3 text-zinc-600 dark:text-zinc-400">{f.answer}</p></details>)}</section>}</main></div>
}
