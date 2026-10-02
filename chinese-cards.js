/* Small, explicitly checked supplement, not a complete Chinese card database.
 * Printed identities were read from the validation photos. Product URLs were
 * verified on Cardmarket, but V suffixes are not proof of a foil match.
 */
(function(root){
  'use strict';
  const families={
    'CBB1C:03':{name:'Fuecoco',local:'呆火鳄',total:9},
    'CBB1C:04':{name:'Crocalor',local:'炙烫鳄',total:8},
    'CBB1C:07':{name:'Captain Pikachu',local:'船长皮卡丘',total:9},
    'CBB3C:02':{name:'Meowth',local:'喵喵',total:7}
  };
  const products={
    'CBB1C:0304/09':'Gem-Pack-Vol-1/Fuecoco-V4-CBB1C03',
    'CBB1C:0402/08':'Gem-Pack-Vol-1/Crocalor-V2-CBB1C04',
    'CBB1C:0701/09':'Gem-Pack-Vol-1/Captain-Pikachu-V1-CBB1C07',
    'CBB1C:0702/09':'Gem-Pack-Vol-1/Captain-Pikachu-V2-CBB1C07',
    'CBB1C:0704/09':'Gem-Pack-Vol-1/Captain-Pikachu-V4-CBB1C07',
    'CBB3C:0202/07':'Gem-Pack-Vol-3/Meowth-V2-CBB3C02',
    'CBB3C:0203/07':'Gem-Pack-Vol-3/Meowth-V3-CBB3C02',
    'CBB3C:0204/07':'Gem-Pack-Vol-3/Meowth-V4-CBB3C02'
  };
  function describe(d){
    if(d.lang!=='zh')return null;
    const printed=String(d.code || d.printedCode || '').normalize('NFKC').replace(/\s/g,'').toUpperCase();
    const code=({CM1C:'CBB1C',CM3C:'CBB3C',CBB1C:'CBB1C',CBB3C:'CBB3C'})[printed];
    const number=String(d.number || '').normalize('NFKC').replace(/\s/g,'');
    const m=/^(\d{2})(\d{2})\/(\d{2})$/.exec(number);
    if(!code || !m || +m[2]<1 || +m[2]>+m[3])return null;
    const f=families[code+':'+m[1]];
    if(!f || f.total!==+m[3])return null;
    // Volume 1 includes an ordinary Pikachu print among Captain Pikachu prints.
    const name=code==='CBB1C' && m[1]==='07' && +m[2]===6 ? 'Pikachu' : f.name;
    const local=name==='Pikachu'?'皮卡丘':f.local;
    const known=String(d.enName || d.local || d.name || '').trim();
    const norm=s=>s.normalize('NFKC').toLowerCase().replace(/[\s-]/g,'');
    const conflict=!!known && ![name,local,...(name==='Captain Pikachu'?['Pikachu','皮卡丘']:[])].some(n=>norm(n)===norm(known));
    const path=products[code+':'+number];
    return {name,local,code,number,conflict,variant:+m[2],variants:+m[3],
      label:code+' '+m[1]+' · Druckvariante '+(+m[2])+'/'+(+m[3]),
      candidate:path?'https://www.cardmarket.com/de/Pokemon/Products/Singles/'+path:''};
  }
  function apply(d){
    // Remove only our own inferred values after a correction; preserve user edits.
    if(d.catalogName){
      if(d.name===d.catalogName && !d.nameTouched)d.name='';
      if(d.enName===d.catalogName)d.enName='';
      if(d.local===d.catalogLocal)d.local='';
      d.catalogName='';d.catalogLocal='';
    }
    const info=describe(d);
    if(info && !info.conflict && !d.nameTouched && !d.name && !d.enName && !d.local){
      d.name=d.enName=d.catalogName=info.name;
      d.local=d.catalogLocal=info.local;
    }
    return info;
  }
  function suggestions(d){
    if(d.code || d.printedCode || (d.langSure && d.lang!=='zh')) return [];
    const numbers=[...new Set([d.number,...(d.observedNumbers || [])])].filter(n=>/^\d{4}\/\d{2}$/.test(n || ''));
    const out=[];
    for(const number of numbers)for(const code of ['CM1C','CM3C']){
      const info=describe({...d,lang:'zh',code,number});
      if(info && !info.conflict && info.candidate)out.push({...info,printedCode:code});
    }
    return out;
  }
  const api={describe,apply,suggestions};
  if(typeof module!=='undefined' && module.exports)module.exports=api;
  else root.ChineseCards=api;
})(typeof window!=='undefined'?window:globalThis);
