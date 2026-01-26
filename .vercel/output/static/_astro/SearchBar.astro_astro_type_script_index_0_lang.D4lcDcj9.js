let g=null,v=null;const b={metabolic:{label:"Metabolic",color:"hsl(45 90% 55%)"},"repair-recovery":{label:"Repair",color:"hsl(142 70% 45%)"},hormonal:{label:"Hormonal",color:"hsl(280 80% 60%)"},longevity:{label:"Longevity",color:"hsl(200 80% 55%)"},cognitive:{label:"Cognitive",color:"hsl(320 70% 55%)"},immune:{label:"Immune",color:"hsl(30 80% 55%)"},other:{label:"Other",color:"hsl(220 15% 60%)"}},$={high:{label:"High Evidence",color:"hsl(142 70% 45%)"},moderate:{label:"Moderate",color:"var(--primary)"},low:{label:"Low Evidence",color:"hsl(45 90% 55%)"},"very-low":{label:"Very Low",color:"hsl(0 70% 55%)"}};async function E(){if(g)return g;try{const e=await fetch("/api/peptide-search.json");if(e.ok)return g=await e.json(),g}catch{console.log("Peptide search index not available")}return[]}async function I(){try{v=await import("/pagefind/pagefind.js"),await v.init()}catch{console.log("Pagefind not available (normal during development)")}}function j(e,a){const n=e.toLowerCase().trim(),o=n.split(/\s+/),c=[];for(const s of a){let t=0,l="content",r;const u=s.name.toLowerCase();if(u===n?(t=1e3,l="name"):u.includes(n)?(t=800,l="name"):o.some(d=>u.includes(d))&&(t=600,l="name"),t<500)for(const d of s.aliases){const i=d.toLowerCase();if(i===n){t=700,l="alias",r=`Also known as: ${d}`;break}else i.includes(n)&&(t=Math.max(t,500),l="alias",r=`Also known as: ${d}`)}if(t<400){const d=s.summary.toLowerCase();o.every(i=>d.includes(i))?(t=Math.max(t,400),l="summary",r=k(s.summary,n)):o.some(i=>d.includes(i))&&(t=Math.max(t,200),l="summary",r=k(s.summary,n))}if(t<300&&s.keyTerms?.length){const d=s.keyTerms.join(" ").toLowerCase();o.every(i=>d.includes(i))?(t=Math.max(t,300),l="content",r=`Related to: ${s.keyTerms.filter(h=>o.some(y=>h.toLowerCase().includes(y))).slice(0,5).join(", ")}`):o.some(i=>d.includes(i))&&(t=Math.max(t,250),l="content",r=`Related to: ${s.keyTerms.filter(h=>o.some(y=>h.toLowerCase().includes(y))).slice(0,5).join(", ")}`)}if(t<200){const d=s.content.toLowerCase(),i=o.filter(h=>d.includes(h)).length;i===o.length?(t=Math.max(t,150+i*20),l="content",r=r||M(s.content,n)):i>0&&(t=Math.max(t,50+i*10),l="content",r=r||M(s.content,o[0]))}t>0&&c.push({peptide:s,score:t,matchType:l,matchContext:r})}return c.sort((s,t)=>t.score-s.score).slice(0,10)}function M(e,a){const n=e.toLowerCase(),o=n.indexOf(a.toLowerCase());if(o===-1){const l=a.split(/\s+/);for(const r of l){const u=n.indexOf(r);if(u!==-1){const d=Math.max(0,u-60),i=Math.min(e.length,u+r.length+80);let h=e.slice(d,i).trim();return d>0&&(h="..."+h),i<e.length&&(h=h+"..."),h}}return e.slice(0,150)+"..."}const c=Math.max(0,o-60),s=Math.min(e.length,o+a.length+80);let t=e.slice(c,s).trim();return c>0&&(t="..."+t),s<e.length&&(t=t+"..."),t}function k(e,a){const o=e.toLowerCase(),c=a.toLowerCase(),s=o.indexOf(c);if(e.length<=180)return e;if(s!==-1){const t=Math.max(0,s-40),l=Math.min(e.length,t+180);let r=e.slice(t,l).trim();return t>0&&(r="..."+r),l<e.length&&(r=r+"..."),r}return e.slice(0,180)+"..."}function L(e){const a=document.createElement("div");return a.textContent=e,a.innerHTML}function T(e,a){const n=L(e),o=a.toLowerCase().split(/\s+/).filter(s=>s.length>1);let c=n;for(const s of o){const t=new RegExp(`(${s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");c=c.replace(t,'<mark class="bg-[var(--primary)]/30 text-white px-0.5 rounded">$1</mark>')}return c}function B(e,a){return e.length===0?`
        <li class="p-6 text-center">
          <div class="text-[var(--muted-foreground)] mb-2">No peptides found for "${L(a)}"</div>
          <a href="/peptides" class="text-[var(--primary)] hover:underline text-sm">Browse all peptides</a>
        </li>
      `:e.map(({peptide:n,matchType:o,matchContext:c})=>{const s=b[n.category]||b.other;$[n.evidenceStrength]||$.low;const t=o==="content"?'<span class="text-xs text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">Found in dossier</span>':"",l=c||n.summary;return`
        <li class="group/item">
          <a href="${n.url}" class="block p-4 relative rounded-lg overflow-hidden transition-all duration-300 hover:bg-gradient-to-r hover:from-[var(--primary)]/40 hover:to-purple-600/30">
            <div class="flex items-start justify-between gap-3 mb-2">
              <div class="font-semibold text-white transition-colors">
                ${T(n.name,a)}
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                      style="color: ${s.color}; border-color: ${s.color}40; background: ${s.color}15;">
                  ${s.label}
                </span>
              </div>
            </div>
            ${n.aliases.length>0?`
              <div class="text-xs text-white/50 mb-2">
                ${n.aliases.slice(0,3).join(" · ")}${n.aliases.length>3?" · ...":""}
              </div>
            `:""}
            <div class="text-sm text-white/70 line-clamp-2 mb-2">
              ${T(l,a)}
            </div>
            <div class="flex items-center gap-3 text-xs text-white/50">
              <span>${n.sources.count} sources</span>
              <span>·</span>
              <span>${n.sources.human} human studies</span>
              ${t}
            </div>
          </a>
        </li>
      `}).join("")}E();I();const w=document.getElementById("search-input"),x=document.getElementById("search-results"),m=document.getElementById("search-results-list"),p=document.getElementById("search-loading"),f=document.getElementById("search-spinner");let C;w?.addEventListener("input",e=>{const a=e.target.value;if(clearTimeout(C),a.length<2){x?.classList.add("hidden"),f?.classList.add("hidden");return}x?.classList.remove("hidden"),p?.classList.remove("hidden"),f?.classList.remove("hidden"),m&&(m.innerHTML=""),C=setTimeout(async()=>{const n=await E();if(n.length>0){const o=j(a,n);p?.classList.add("hidden"),f?.classList.add("hidden"),m&&(m.innerHTML=B(o,a))}else if(v){const o=await v.search(a),c=await Promise.all(o.results.slice(0,8).map(s=>s.data()));if(p?.classList.add("hidden"),f?.classList.add("hidden"),c.length===0){m&&(m.innerHTML=`
              <li class="p-4 text-center text-[var(--muted-foreground)]">No results found for "${L(a)}"</li>
            `);return}m&&(m.innerHTML=c.map(s=>`
            <li>
              <a href="${s.url}" class="block p-4 hover:bg-white/5 transition-colors">
                <div class="font-medium text-white">${s.meta?.title||"Untitled"}</div>
                <div class="mt-1 text-sm text-[var(--muted-foreground)] line-clamp-2">${s.excerpt}</div>
              </a>
            </li>
          `).join(""))}else p?.classList.add("hidden"),f?.classList.add("hidden"),m&&(m.innerHTML=`
            <li class="p-4 text-center text-[var(--muted-foreground)]">
              <div class="mb-2">Search index loading...</div>
              <a href="/peptides" class="text-[var(--primary)] hover:underline">Browse all peptides</a>
            </li>
          `)},300)});document.addEventListener("click",e=>{document.getElementById("search-container")?.contains(e.target)||x?.classList.add("hidden")});document.addEventListener("keydown",e=>{e.key==="Escape"&&(x?.classList.add("hidden"),w?.blur())});w?.addEventListener("keydown",e=>{const a=m?.querySelectorAll("a");a?.length&&e.key==="ArrowDown"&&(e.preventDefault(),a[0].focus())});m?.addEventListener("keydown",e=>{const a=Array.from(m.querySelectorAll("a")),n=a.indexOf(document.activeElement);if(e.key==="ArrowDown"){e.preventDefault();const o=Math.min(n+1,a.length-1);a[o].focus()}else e.key==="ArrowUp"&&(e.preventDefault(),n===0?w?.focus():a[n-1].focus())});
