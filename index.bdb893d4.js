var e={API_KEY:"8c1c21cb3de0f31fcce2cce049e2c70c",BASE_URL_ALL:"https://api.themoviedb.org/3/trending/all/day",BASE_URL_GENRE:"https://api.themoviedb.org/3/movie/",cards:document.querySelector(".js-cards"),arrowRight:document.querySelector(".js-arrow-to_right"),arrowLeft:document.querySelector(".js-arrow-to_left")};const{API_KEY:t,BASE_URL_ALL:a,BASE_URL_GENRE:r}=e;async function s(e=1){let s=await fetch(`${a}?api_key=${t}&page=${e}`),n=await s.json(),i=await n.results.map(async e=>{try{let a=await fetch(`${r}${e.id}?api_key=${t}&include_image_language=en,null`);if(!a.ok)throw Error(a.statusText);return await a.json()}catch(e){console.log("Errorrrrrr",e)}});return await Promise.all(i)}const{cards:n}=e;async function i(e){try{let t=e.filter(e=>{if(e&&null!==e.poster_path)return e}).map(({title:e,poster_path:t,genres:a,release_date:r})=>{let s=a.map(e=>e.name).join(", "),n=r.slice(0,4);return`
              <li class="page-item">
                 <a href="#" class="page-item__link">
                 <img src="https://image.tmdb.org/t/p/w500${t}">
                 <div class="page-description">
                     <h2 class="page-description__title">${e}</h2>
                     <p class="page-description__podscription">${s} <span>| ${n}</span></p>
                 </div>
                 </a>
              </li>`}).join(" ");n.insertAdjacentHTML("beforeend",t)}catch(e){console.log(e)}}let c=1;const{API_KEY:l,BASE_URL_ALL:o,cards:p,arrowRight:u,arrowLeft:d}=e;!async function(){let e=await s(c);await i(e),_()}();const{handleLeftClick:h,handleRightClick:g}={handleRightClick:async()=>{c+=1;try{m();let e=await s(c);i(e),_()}catch(e){console.error(e)}},handleLeftClick:async()=>{c-=1;try{m();let e=await s(c);i(e),_()}catch(e){console.error(e)}}};function m(){p.innerHTML=""}async function _(){let e=await fetch(`${o}?api_key=${l}&page=${c}`),{totalPageCount:t,currentPage:a,pageNumbers:r,maxPageBtn:n,nearEdgeThreshold:p,pageNumbersHtml:h}={totalPageCount:(await e.json()).total_pages,currentPage:c,pageNumbers:[],maxPageBtn:9,nearEdgeThreshold:3,pageNumbersHtml:document.querySelector(".js-list")};if(t<=n)for(let e=1;e<=t;e+=1)r.push(e);else if(a<=p+1){for(let e=1;e<=n-2;e+=1)r.push(e);r.push("..."),r.push(t)}else if(a>=t-p){r.push(1),r.push("...");for(let e=t-n+3;e<=t;e+=1)r.push(e)}else{r.push(1),r.push("...");for(let e=a-p;e<=a+p;e+=1)r.push(e);r.push("..."),r.push(t)}let g=r.map(e=>{if("..."===e)return`<span>${e}</span>`;{let t=c===e?"isactive":"";return`<button class="js-page-number ${t}" data-page="${e}">${e}</button>`}}).join("");h.innerHTML=g,u.disabled=c===t,d.disabled=1===c,document.querySelectorAll(".js-page-number").forEach(e=>{e.addEventListener("click",async()=>{let t=parseInt(e.dataset.page);isNaN(t)||(c=t,m(),i(await s(c)),_())})})}d.addEventListener("click",h),u.addEventListener("click",g);
//# sourceMappingURL=index.bdb893d4.js.map